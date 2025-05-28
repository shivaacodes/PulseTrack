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
import { analyticsApi } from "@/lib/api";

interface PageVisits {
  time: string;
  visits: number;
  uniqueVisitors: number;
}

const PageVisitsChart: React.FC = () => {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<PageVisits[]>([]);
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
        visits: Math.floor(Math.random() * 50), // Random data for testing
        uniqueVisitors: Math.floor(Math.random() * 30)
      });
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pageData = await analyticsApi.getPageVisits(1);
        console.log("Received page visits data:", pageData);

        if (!pageData || !Array.isArray(pageData)) {
          console.error("Invalid data format:", pageData);
          throw new Error("Invalid data format received");
        }

        // For testing, use generated time data
        const formattedData = generateTimeData();
        console.log("Formatted data:", formattedData);

        setData(formattedData);
      } catch (err) {
        console.error("Error fetching page visits:", err);
        setError("Failed to load page visits data. Please try again later.");
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
        if (newData.type === 'page_visit') {
          setData(prevData => {
            const updatedData = [...prevData];
            const time = getTimeString(new Date());
            
            // Add new data point
            updatedData.push({
              time,
              visits: newData.visits,
              uniqueVisitors: newData.unique_visitors
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
  }, []);

  if (loading) {
    return (
      <div className="h-[500px] flex items-center justify-center">
        Loading...
      </div>
    );
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
        No page visit data available
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Page Visits Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorUniqueVisitors" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
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
            tickFormatter={(value) => `${value}`}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value}`,
              name === "visits" ? "Total Visits" : "Unique Visitors"
            ]}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="visits"
            name="Total Visits"
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorVisits)"
            animationDuration={300}
          />
          <Area
            type="monotone"
            dataKey="uniqueVisitors"
            name="Unique Visitors"
            stroke="#8884d8"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorUniqueVisitors)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PageVisitsChart;
