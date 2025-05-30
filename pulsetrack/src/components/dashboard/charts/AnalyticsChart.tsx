'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService, AnalyticsOverview } from '@/services/analytics';
import { useAuth } from '@/contexts/AuthContext';
import Loader from '@/components/ui/loader';

export default function AnalyticsChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const overview = await analyticsService.getOverview(user.id.toString());
        setData(overview);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="h-[600px]"><Loader /></div>;
  }

  if (error) {
    return <div className="h-[600px] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="h-[600px] flex items-center justify-center">No data available</div>;
  }

  // Calculate click rate (clicks per pageview)
  const clickRate = data.total_pageviews > 0 
    ? Number(((data.total_events - data.total_pageviews) / data.total_pageviews * 100).toFixed(1))
    : 0;

  // Create chart data with proper formatting
  const chartData = [
    { name: 'Page Views', value: data.total_pageviews || 0 },
    { name: 'Unique Users', value: data.unique_users || 0 },
    { name: 'Total Events', value: data.total_events || 0 },
    { name: 'Click Rate (%)', value: clickRate },
    { name: 'Avg Session (min)', value: Math.round((data.average_session_duration || 0) / 60) },
  ];

  return (
    <div className="h-[600px] w-full">
      <h3 className="text-base font-semibold mb-4">Analytics Overview</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Value']}
            labelFormatter={(label) => `${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke={themeColor}
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}