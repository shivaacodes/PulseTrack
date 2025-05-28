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
import Loader from "@/components/ui/loader";

interface BounceData {
  time: string;
  rate: number;
}

const BounceRateChart: React.FC = () => {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<BounceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get time in HH:MM format
  const getTimeString = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  // Function to generate mock data
  const generateMockData = () => {
    const now = new Date();
    const data = [];
    for (let i = 9; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // Subtract i minutes
      data.push({
        time: getTimeString(time),
        rate: Math.floor(Math.random() * 100) // Random bounce rate between 0-100
      });
    }
    return data;
  };

  useEffect(() => {
    // Initialize with mock data
    setData(generateMockData());
    setLoading(false);

    // Update data every minute
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData];
        const time = getTimeString(new Date());
        
        // Add new data point
        newData.push({
          time,
          rate: Math.floor(Math.random() * 100)
        });
        
        // Keep only last 10 data points
        return newData.slice(-10);
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="h-[500px]"><Loader /></div>;
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Bounce Rate Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorBounce" x1="0" y1="0" x2="0" y2="1">
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
            formatter={(value: number) => [`${value}%`, 'Bounce Rate']}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Area
            type="monotone"
            dataKey="rate"
            name="Bounce Rate"
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBounce)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BounceRateChart; 