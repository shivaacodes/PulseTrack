import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface AnalyticsOverview {
  total_pageviews: number;
  unique_users: number;
  total_events: number;
  average_session_duration: number;
  period_days: number;
  start_date: string;
  end_date: string;
  click_rate: number;
}

export interface PagePerformance {
  date: string;
  pageviews: number;
  clicks: number;
  bounce_rate: number;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const analyticsService = {
  async getOverview(siteId: string, days: number = 30): Promise<AnalyticsOverview> {
    const response = await api.get('/analytics/overview', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getPagePerformance(siteId: string, days: number = 30): Promise<PagePerformance[]> {
    const response = await api.get('/analytics/pages', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getPageVisits(siteId: string, days: number = 30): Promise<number> {
    const response = await api.get('/analytics/page-visits', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getClickRate(siteId: string, days: number = 30): Promise<number> {
    const response = await api.get('/analytics/click-rate', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getBounceRate(siteId: string, days: number = 30): Promise<number> {
    const response = await api.get('/analytics/bounce-rate', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getConversionRate(siteId: string, days: number = 30): Promise<number> {
    const response = await api.get('/analytics/conversion-rate', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  },

  async getRetentionRate(siteId: string, days: number = 30): Promise<number> {
    const response = await api.get('/analytics/retention-rate', {
      params: {
        site_id: siteId,
        days
      }
    });
    return response.data;
  }
}; 