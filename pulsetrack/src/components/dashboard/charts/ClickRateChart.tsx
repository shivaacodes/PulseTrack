'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsService, PagePerformance } from '@/services/analytics';
import { useAuth } from '@/contexts/AuthContext';

interface ClickRateData {
  date: string;
  click_rate: number;
}

export default function ClickRateChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<ClickRateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        const response = await analyticsService.getPagePerformance(user.id.toString());
        // Transform the data to calculate click rate
        const clickRateData = response.map((page: PagePerformance) => ({
          date: page.date,
          click_rate: page.clicks / (page.pageviews || 1) * 100 // Avoid division by zero
        }));
        setData(clickRateData);
      } catch (err) {
        console.error('Error fetching click rate data:', err);
        setError('Failed to load click rate data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-[500px] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!data.length) {
    return <div className="h-[500px] flex items-center justify-center">No click rate data available</div>;
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Click Rate Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClickRate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis 
            tickFormatter={(value) => `${value.toFixed(1)}%`}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Click Rate']}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Area 
            type="monotone" 
            dataKey="click_rate" 
            stroke={themeColor}
            fillOpacity={1} 
            fill="url(#colorClickRate)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 