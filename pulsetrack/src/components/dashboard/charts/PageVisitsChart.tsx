'use client';

import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface PageVisits {
  date: string;
  visits: number;
}

const PageVisitsChart: React.FC = () => {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<PageVisits[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Use site_id=1 for now since we don't have site management yet
        const pageData = await analyticsApi.getPageVisits(1);
        console.log('Received page visits data:', pageData);
        
        if (!pageData || !Array.isArray(pageData)) {
          console.error('Invalid data format:', pageData);
          throw new Error('Invalid data format received');
        }

        // Ensure data is in correct format
        const formattedData = pageData.map(item => ({
          date: item.date,
          visits: Number(item.visits)
        }));
        console.log('Formatted data:', formattedData);
        
        setData(formattedData);
      } catch (err) {
        console.error('Error fetching page visits:', err);
        setError('Failed to load page visits data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Debug render
  console.log('Current data state:', data);
  console.log('Loading state:', loading);
  console.log('Error state:', error);

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="h-[500px] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!data.length) {
    return <div className="h-[500px] flex items-center justify-center">No page visit data available</div>;
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Page Visits Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
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
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip 
            formatter={(value: number) => [value.toLocaleString(), 'Visits']}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Area 
            type="monotone" 
            dataKey="visits" 
            stroke={themeColor}
            fillOpacity={1} 
            fill="url(#colorVisits)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PageVisitsChart;