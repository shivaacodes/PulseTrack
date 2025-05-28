from typing import Dict, Set, List
from fastapi import WebSocket
from datetime import datetime, timedelta
import logging
import json
from ..analytics.service import AnalyticsService
from ..database import SessionLocal

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        # Dictionary to store active connections with their IDs
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Set to store all active connection IDs
        self.connection_ids: Set[str] = set()
        # Dictionary to store click data for each site
        self.click_counts: Dict[str, List[dict]] = {}
        self.analytics_data = {
            'clicks': 0,
            'bounce_rate': 0,
            'conversion_rate': 0,
            'retention_rate': 0
        }

    async def connect(self, websocket: WebSocket, site_id: str):
        """Connect a new client and store their connection"""
        await websocket.accept()
        if site_id not in self.active_connections:
            self.active_connections[site_id] = []
        self.active_connections[site_id].append(websocket)
        self.connection_ids.add(site_id)
        logger.info(f"Client {site_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket, site_id: str):
        """Remove a client's connection"""
        if site_id in self.active_connections:
            self.active_connections[site_id].remove(websocket)
            if not self.active_connections[site_id]:
                del self.active_connections[site_id]
            self.connection_ids.remove(site_id)
            logger.info(f"Client {site_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, client_id: str):
        """Send a message to a specific client"""
        if client_id in self.active_connections:
            for connection in self.active_connections[client_id]:
                try:
                    await connection.send_text(message)
                except:
                    continue
            logger.info(f"Sent message to client {client_id}: {message[:100]}...")

    async def broadcast(self, message: str):
        """Send a message to all connected clients"""
        for site_connections in self.active_connections.values():
            for connection in site_connections:
                try:
                    await connection.send_text(message)
                except:
                    continue
        logger.info(f"Broadcasted message to {len(self.active_connections)} clients: {message[:100]}...")

    async def broadcast_except(self, message: str, exclude_client_id: str):
        """Send a message to all clients except the specified one"""
        for client_id, site_connections in self.active_connections.items():
            if client_id != exclude_client_id:
                for connection in site_connections:
                    try:
                        await connection.send_text(message)
                    except:
                        continue
        logger.info(f"Broadcasted message to {len(self.active_connections)-1} clients (excluding {exclude_client_id}): {message[:100]}...")

    def record_click(self, site_id: str) -> dict:
        """Record a click and return updated analytics data."""
        self.analytics_data['clicks'] += 1
        return self.analytics_data

    def get_analytics_data(self, site_id: str) -> dict:
        """Get current analytics data for a site."""
        db = SessionLocal()
        try:
            analytics_service = AnalyticsService(db)
            
            # Get rates for the last 30 days
            bounce_rate = analytics_service.get_bounce_rate(site_id, 30)
            conversion_rate = analytics_service.get_conversion_rate(site_id, 30)
            retention_rate = analytics_service.get_retention_rate(site_id, 30)

            return {
                'bounce_rate': bounce_rate,
                'conversion_rate': conversion_rate,
                'retention_rate': retention_rate,
                'timestamp': datetime.utcnow().isoformat()
            }
        finally:
            db.close()

    async def broadcast_analytics_update(self, site_id: str):
        """Broadcast analytics update to all connected clients for a site."""
        if site_id in self.active_connections:
            data = self.get_analytics_data(site_id)
            message = json.dumps({
                'type': 'analytics_update',
                'data': data
            })
            await self.broadcast(message)

# Create a global instance of the connection manager
manager = ConnectionManager() 