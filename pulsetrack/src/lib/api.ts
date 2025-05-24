import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AnalyticsOverview {
  total_pageviews: number;
  unique_users: number;
  total_events: number;
  average_session_duration: number;
  period_days: number;
  start_date: string;
  end_date: string;
}

export interface PagePerformance {
  date: string;
  pageviews: number;
  clicks: number;
  bounce_rate: number;
  page?: string;
  visitors?: number;
  bounceRate?: string;
  conversion?: string;
}

export interface PageVisits {
  date: string;
  visits: number;
}

export const analyticsApi = {
  getOverview: async (siteId: number = 1, days: number = 30): Promise<AnalyticsOverview> => {
    const response = await api.get<AnalyticsOverview>(`/api/v1/analytics/overview?site_id=${siteId}&days=${days}`);
    return response.data;
  },

  getPagePerformance: async (siteId: number = 1, days: number = 30): Promise<PagePerformance[]> => {
    const response = await api.get<PagePerformance[]>(`/api/v1/analytics/pages?site_id=${siteId}&days=${days}`);
    return response.data;
  },

  getPageVisits: async (siteId: number = 1, days: number = 30): Promise<PageVisits[]> => {
    const response = await api.get<PageVisits[]>(`/api/v1/analytics/page-visits?site_id=${String(siteId)}&days=${days}`);
    return response.data;
  }
};