import api from './api';

export interface PagePerformance {
  date: string;
  pageviews: number;
  clicks: number;
  bounce_rate: number;
}

export interface AnalyticsOverview {
  total_pageviews: number;
  unique_users: number;
  total_events: number;
  average_session_duration: number;
  period_days: number;
  start_date: string;
  end_date: string;
}

class AnalyticsService {
  async getPagePerformance(siteId: string, days: number = 30): Promise<PagePerformance[]> {
    const response = await api.get('/analytics/pages', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  }

  async getAnalyticsOverview(siteId: string, days: number = 30): Promise<AnalyticsOverview> {
    const response = await api.get('/analytics/overview', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  }

  async getEventCounts(siteId: string, days: number = 30): Promise<Record<string, number>> {
    const response = await api.get('/analytics/events/counts', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();