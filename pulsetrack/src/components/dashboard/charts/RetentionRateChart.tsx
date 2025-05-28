"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import Loader from "@/components/ui/loader";

interface RetentionData {
  time: string;
  rate: number;
}

const RetentionRateChart: React.FC = () => {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<RetentionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to get time in HH:MM format
  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Function to generate last 10 minutes data
  const generateTimeData = () => {
    const now = new Date();
    const data = [];
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Subtract i minutes
      data.push({
        time: getTimeString(time),
        rate: Math.floor(Math.random() * 100) // Random retention rate between 0-100
      });
    }
    return data;
  };

  const handleWebSocketError = useCallback(() => {
    setError('Failed to connect to analytics server. Please check if the server is running on port 8000.');
    setLoading(false);
  }, []);

  const handleWebSocketClose = useCallback((event: CloseEvent) => {
    console.log('WebSocket Disconnected:', event.code, event.reason);
    if (event.code === 1006) {
      setError('Connection lost. Please check if the FastAPI server is running on port 8000.');
    }
  }, []);

  useEffect(() => {
    // Initialize with test data
    setData(generateTimeData());
    setLoading(false);

    // WebSocket connection for real-time updates
    const ws = new WebSocket('ws://localhost:8000/ws/analytics');

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        if (newData.type === 'analytics_update') {
          setData(prevData => {
            const updatedData = [...prevData];
            const time = getTimeString(new Date());
            
            // Add new data point
            updatedData.push({
              time,
              rate: newData.data.retention_rate
            });
            
            // Keep only last 10 data points
            return updatedData.slice(-10);
          });
        }
      } catch (err) {
        console.error('Error processing WebSocket message:', err);
      }
    };

    ws.onerror = handleWebSocketError;
    ws.onclose = handleWebSocketClose;

    return () => {
      ws.close();
    };
  }, [handleWebSocketError, handleWebSocketClose]);

  if (loading) {
    return <div className="h-[500px]"><Loader /></div>;
  }

  if (error) {
    return (
      <div className="h-[500px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        No retention rate data available
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Retention Rate Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
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
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => [`${value}%`, 'Retention Rate']}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="Retention Rate"
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorRetention)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionRateChart; 