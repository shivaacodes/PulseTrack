"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { analyticsService } from "@/services/analytics";
import Loader from "@/components/ui/loader";

interface ConversionData {
  time: string;
  rate: number;
}

const ConversionRateChart: React.FC = () => {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<ConversionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Function to get time in HH:MM format
  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;
        setLoading(true);
        
        // Get initial conversion rate
        const conversionRate = await analyticsService.getConversionRate(user.id.toString());
        const initialData = [{
          time: getTimeString(new Date()),
          rate: conversionRate
        }];
        setData(initialData);
      } catch (err) {
        console.error('Error fetching conversion rate:', err);
        setError('Failed to load conversion rate data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws/analytics');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        if (newData.type === 'analytics_update' && newData.data.conversion_rate !== undefined) {
          setData(prevData => {
            const updatedData = [...prevData];
            const time = getTimeString(new Date());
            
            // Add new data point
            updatedData.push({
              time,
              rate: newData.data.conversion_rate
            });
            
            // Keep only last 10 data points
            return updatedData.slice(-10);
          });
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, [user]);

  if (loading) {
    return <div className="h-[600px]"><Loader /></div>;
  }

  if (error) {
    return <div className="h-[600px] flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-[600px] flex items-center justify-center">No conversion rate data available</div>;
  }

  return (
    <div className="h-[600px] w-full">
      <h3 className="text-base font-semibold mb-4">Conversion Rate Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorConversion" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 30]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="Conversion Rate"
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorConversion)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ConversionRateChart; 