# Analytics Service Module
# This module handles all analytics-related business logic including:
# - Event tracking and creation
# - Page visit analytics
# - User engagement metrics (click rate, bounce rate)
# - Conversion tracking
# - User retention analysis

from sqlalchemy.orm import Session
from sqlalchemy import func, case, and_
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from ..db.models.event import Event
from ..db.models.pageview import PageView
from ..db.models.session import Session as DBSession
from ..db.models.site import Site
from .schemas import (
    EventCreate,
    EventResponse,
    AnalyticsFilter,
    PageViewCreate
)

class AnalyticsService:
    """
    Service class for handling analytics operations.
    Provides methods for tracking and analyzing user behavior and site performance.
    """

    def __init__(self, db: Session):
        """
        Initialize the analytics service with a database session.
        
        Args:
            db (Session): SQLAlchemy database session
        """
        self.db = db

    def create_pageview(self, site_id: int, properties: Dict[str, Any] = None) -> PageView:
        """Create a new page view record."""
        # Create page view
        db_pageview = PageView(
            site_id=site_id,
            timestamp=datetime.utcnow()
        )
        self.db.add(db_pageview)
        self.db.commit()
        self.db.refresh(db_pageview)
        return db_pageview

    def create_event(self, event: EventCreate) -> EventResponse:
        """Create a new analytics event."""
        # If it's a pageview event, create a page view record
        if event.name == "pageview":
            self.create_pageview(event.site_id, event.properties)
            
        # Create event
        db_event = Event(
            site_id=event.site_id,
            name=event.name,
            properties=event.properties,
            timestamp=datetime.utcnow()
        )
        self.db.add(db_event)
        self.db.commit()
        self.db.refresh(db_event)
        return db_event

    def get_events(self, filter_params: AnalyticsFilter) -> List[EventResponse]:
        """Get filtered events."""
        query = self.db.query(Event)

        if filter_params.site_id:
            query = query.filter(Event.site_id == filter_params.site_id)
        if filter_params.start_date:
            query = query.filter(Event.timestamp >= filter_params.start_date)
        if filter_params.end_date:
            query = query.filter(Event.timestamp <= filter_params.end_date)
        if filter_params.event_type:
            query = query.filter(Event.name == filter_params.event_type)

        return query.all()

    def get_event_counts(self, site_id: int, days: int = 30) -> Dict[str, int]:
        """Get event counts by type for a specific site."""
        start_date = datetime.utcnow() - timedelta(days=days)
        
        events = self.db.query(
            Event.name,
            func.count(Event.id).label('count')
        ).filter(
            Event.site_id == site_id,
            Event.timestamp >= start_date
        ).group_by(Event.name).all()

        return {event.name: event.count for event in events}

    def get_analytics_overview(self, site_id: str, days: int = 30) -> Dict[str, Any]:
        """Get comprehensive analytics overview."""
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get total pageviews
        total_pageviews = self.db.query(func.count(PageView.id)).filter(
            PageView.site_id == site_id,
            PageView.timestamp >= start_date,
            PageView.timestamp <= end_date
        ).scalar() or 0

        # Get unique users
        unique_users = self.db.query(func.count(DBSession.user_id.distinct())).filter(
            DBSession.site_id == site_id,
            DBSession.started_at >= start_date,
            DBSession.started_at <= end_date
        ).scalar() or 0

        # Get total events
        total_events = self.db.query(func.count(Event.id)).filter(
            Event.site_id == site_id,
            Event.timestamp >= start_date,
            Event.timestamp <= end_date
        ).scalar() or 0

        # Get average session duration
        avg_duration = self.db.query(
            func.avg(
                func.extract('epoch', DBSession.ended_at - DBSession.started_at)
            )
        ).filter(
            DBSession.site_id == site_id,
            DBSession.started_at >= start_date,
            DBSession.started_at <= end_date,
            DBSession.ended_at.isnot(None)
        ).scalar() or 0

        return {
            "total_pageviews": total_pageviews,
            "unique_users": unique_users,
            "total_events": total_events,
            "average_session_duration": round(avg_duration, 2),
            "period_days": days,
            "start_date": start_date,
            "end_date": end_date
        }

    def get_page_performance(self, site_id: str, days: int = 30) -> List[dict]:
        """
        Get page performance metrics over time.
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back
            
        Returns:
            List[dict]: List of daily page performance metrics with format:
            {
                date: str,
                pageviews: int,
                clicks: int,
                bounce_rate: float
            }
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Get page views and clicks for each day
        page_views = self.db.query(PageView).filter(
            PageView.site_id == site_id,
            PageView.timestamp >= start_date,
            PageView.timestamp <= end_date
        ).all()
        
        clicks = self.db.query(Event).filter(
            Event.site_id == site_id,
            Event.name == 'click',
            Event.timestamp >= start_date,
            Event.timestamp <= end_date
        ).all()
        
        # Initialize daily metrics with default values
        daily_metrics = {}
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.date().isoformat()
            daily_metrics[date_str] = {
                'date': date_str,
                'pageviews': 0,
                'clicks': 0,
                'bounce_rate': 0
            }
            current_date += timedelta(days=1)
        
        # Update metrics with actual data
        for page_view in page_views:
            date = page_view.timestamp.date().isoformat()
            daily_metrics[date]['pageviews'] += 1
        
        for click in clicks:
            date = click.timestamp.date().isoformat()
            daily_metrics[date]['clicks'] += 1
        
        # Calculate bounce rate for each day
        for date in daily_metrics:
            if daily_metrics[date]['pageviews'] > 0:
                daily_metrics[date]['bounce_rate'] = round(
                    (daily_metrics[date]['pageviews'] - daily_metrics[date]['clicks']) / 
                    daily_metrics[date]['pageviews'] * 100, 2
                )
        
        # Convert to list and sort by date
        result = list(daily_metrics.values())
        result.sort(key=lambda x: x['date'])
        
        return result

    def get_user_behavior(self, site_id: int, days: int = 30) -> Dict[str, Any]:
        """Get user behavior analytics for a site."""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get session data
            sessions = self.db.query(DBSession).filter(
                DBSession.site_id == site_id,
                DBSession.started_at >= start_date,
                DBSession.started_at <= end_date
            ).all()
            
            # Calculate metrics
            total_sessions = len(sessions)
            total_duration = sum(
                (s.ended_at - s.started_at).total_seconds() 
                for s in sessions 
                if s.ended_at is not None
            )
            avg_duration = total_duration / total_sessions if total_sessions > 0 else 0
            
            # Calculate bounce rate from session metadata
            bounce_sessions = sum(
                1 for s in sessions 
                if s.session_metadata and s.session_metadata.get('bounce', False)
            )
            bounce_rate = (bounce_sessions / total_sessions * 100) if total_sessions > 0 else 0
            
            # Calculate pages per session
            pages_per_session = sum(
                len(s.page_views) for s in sessions
            ) / total_sessions if total_sessions > 0 else 0
            
            return {
                "total_sessions": total_sessions,
                "avg_session_duration": round(avg_duration / 60, 2),  # Convert to minutes
                "bounce_rate": round(bounce_rate, 1),
                "pages_per_session": round(pages_per_session, 1)
            }
        except Exception as e:
            raise Exception(f"Error getting user behavior: {str(e)}")

    def get_conversion_funnel(self, site_id: int, days: int = 30) -> List[Dict[str, Any]]:
        """Get conversion funnel analytics for a site."""
        try:
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get page views and events
            page_views = self.db.query(PageView).filter(
                PageView.site_id == site_id,
                PageView.timestamp >= start_date,
                PageView.timestamp <= end_date
            ).all()
            
            events = self.db.query(Event).filter(
                Event.site_id == site_id,
                Event.timestamp >= start_date,
                Event.timestamp <= end_date
            ).all()
            
            # Calculate funnel stages
            total_visitors = len(set(pv.session_id for pv in page_views))
            product_views = len([e for e in events if e.name == 'product_view'])
            add_to_cart = len([e for e in events if e.name == 'add_to_cart'])
            checkout_starts = len([e for e in events if e.name == 'checkout_start'])
            purchases = len([e for e in events if e.name == 'purchase'])
            
            return [
                {"stage": "Visitors", "count": total_visitors, "conversion": "100%"},
                {"stage": "Product Views", "count": product_views, "conversion": f"{(product_views/total_visitors*100):.1f}%"},
                {"stage": "Add to Cart", "count": add_to_cart, "conversion": f"{(add_to_cart/total_visitors*100):.1f}%"},
                {"stage": "Checkout", "count": checkout_starts, "conversion": f"{(checkout_starts/total_visitors*100):.1f}%"},
                {"stage": "Purchase", "count": purchases, "conversion": f"{(purchases/total_visitors*100):.1f}%"}
            ]
        except Exception as e:
            raise Exception(f"Error getting conversion funnel: {str(e)}")

    def get_page_visits(self, site_id: str, days: int = 30) -> List[Dict[str, Any]]:
        """
        Get page visits data for graphing.
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back
            
        Returns:
            List[Dict[str, Any]]: List of daily page visits with format:
            {
                date: str,
                visits: int
            }
        """
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days)
        
        # Initialize daily visits with default values
        daily_visits = {}
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.date().isoformat()
            daily_visits[date_str] = {
                'date': date_str,
                'visits': 0
            }
            current_date += timedelta(days=1)
        
        # Get actual page views
        page_views = self.db.query(
            func.date(PageView.timestamp).label('date'),
            func.count(PageView.id).label('count')
        ).filter(
            PageView.site_id == site_id,
            PageView.timestamp >= start_date,
            PageView.timestamp <= end_date
        ).group_by(
            func.date(PageView.timestamp)
        ).all()
        
        # Update with actual data
        for date, count in page_views:
            date_str = date.isoformat()
            if date_str in daily_visits:
                daily_visits[date_str]['visits'] = count
        
        # Convert to list and sort by date
        result = list(daily_visits.values())
        result.sort(key=lambda x: x['date'])
        
        return result

    def get_click_rate(self, site_id: str, days: int = 30) -> float:
        """
        Calculate click-through rate (CTR) as a percentage.
        CTR = (Number of clicks / Number of page views) * 100
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back (default: 30)
            
        Returns:
            float: Click rate as a percentage
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        clicks = self.db.query(Event).filter(
            Event.site_id == site_id,
            Event.name == "click",
            Event.timestamp >= start_date
        ).count()
        views = self.db.query(Event).filter(
            Event.site_id == site_id,
            Event.name == "pageview",
            Event.timestamp >= start_date
        ).count()
        return round(clicks / views * 100, 2) if views > 0 else 0.0

    def get_bounce_rate(self, site_id: str, days: int = 30) -> float:
        """
        Calculate bounce rate as a percentage.
        Bounce rate = (Number of single-page sessions / Total sessions) * 100
        A bounce is defined as a session that lasted less than 10 seconds.
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back (default: 30)
            
        Returns:
            float: Bounce rate as a percentage
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        # Find sessions that lasted less than 10 seconds
        subquery = (
            self.db.query(Event.session_id)
            .filter(
                Event.site_id == site_id,
                Event.timestamp >= start_date
            )
            .group_by(Event.session_id)
            .having(
                func.max(Event.timestamp) - func.min(Event.timestamp) < timedelta(seconds=10)
            )
            .subquery()
        )
        total_sessions = self.db.query(Event.session_id).filter(
            Event.site_id == site_id,
            Event.timestamp >= start_date
        ).distinct().count()
        bounces = self.db.query(subquery).count()
        return round(bounces / total_sessions * 100, 2) if total_sessions > 0 else 0.0

    def get_conversion_rate(self, site_id: str, days: int = 30) -> float:
        """
        Calculate conversion rate as a percentage.
        Conversion rate = (Number of conversions / Total sessions) * 100
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back (default: 30)
            
        Returns:
            float: Conversion rate as a percentage
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        conversions = self.db.query(Event).filter(
            Event.site_id == site_id,
            Event.name == "conversion",
            Event.timestamp >= start_date
        ).count()
        sessions = self.db.query(Event.session_id).filter(
            Event.site_id == site_id,
            Event.timestamp >= start_date
        ).distinct().count()
        return round(conversions / sessions * 100, 2) if sessions > 0 else 0.0

    def get_retention_rate(self, site_id: str, days: int = 30) -> float:
        """
        Calculate user retention rate as a percentage.
        Retention rate = (Number of returning users / Total users) * 100
        A returning user is defined as someone who visited more than once
        with visits separated by at least 24 hours.
        
        Args:
            site_id (str): ID of the site
            days (int): Number of days to look back (default: 30)
            
        Returns:
            float: Retention rate as a percentage
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        users = self.db.query(Event.user_id).filter(
            Event.site_id == site_id,
            Event.timestamp >= start_date
        ).distinct().all()
        
        retained = 0
        for user in users:
            sessions = self.db.query(Event.timestamp).filter(
                Event.user_id == user[0],
                Event.site_id == site_id,
                Event.timestamp >= start_date
            ).order_by(Event.timestamp).all()
            
            if len(sessions) < 2:
                continue
                
            first = sessions[0][0]
            for session_time in sessions[1:]:
                if session_time[0] - first > timedelta(days=1):
                    retained += 1
                    break
                    
        return round(retained / len(users) * 100, 2) if users else 0.0
