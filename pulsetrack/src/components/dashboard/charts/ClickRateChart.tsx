'use client';

import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface ClickData {
  time: string;
  clicks: number;
}

export default function ClickRateChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);
  const [data, setData] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);

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
        clicks: Math.floor(Math.random() * 50) // Random data for testing
      });
    }
    return data;
  };

  useEffect(() => {
    // Set up WebSocket connection
    const wsUrl = `ws://localhost:8000/ws/${user?.id || 'anonymous'}`;
    console.log('Attempting to connect to WebSocket:', wsUrl);
    
    try {
      const wsClient = new WebSocket(wsUrl);
      
      wsClient.onopen = () => {
        console.log('WebSocket Connected Successfully');
        setLoading(false);
        setError(null);
        // Initialize with test data
        setData(generateTimeData());
      };

      wsClient.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'analytics_update' && message.data) {
            setData(prevData => {
              const updatedData = [...prevData];
              const time = getTimeString(new Date());
              
              // Add new data point
              updatedData.push({
                time,
                clicks: message.data.clicks || 0
              });
              
              // Keep only last 10 data points
              return updatedData.slice(-10);
            });
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      wsClient.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Failed to connect to analytics server. Please check if the server is running on port 8000.');
        setLoading(false);
      };

      wsClient.onclose = (event) => {
        console.log('WebSocket Disconnected:', event.code, event.reason);
        if (event.code === 1006) {
          setError('Connection lost. Please check if the FastAPI server is running on port 8000.');
        }
      };

      setWs(wsClient);

      // Cleanup on unmount
      return () => {
        console.log('Cleaning up WebSocket connection');
        if (wsClient.readyState === WebSocket.OPEN) {
          wsClient.close();
        }
      };
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create WebSocket connection');
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div className="h-[500px] flex items-center justify-center">Connecting to analytics server...</div>;
  }

  if (error) {
    return (
      <div className="h-[500px] flex flex-col items-center justify-center text-red-500">
        <div>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!data.length) {
    return <div className="h-[500px] flex items-center justify-center">No click data available</div>;
  }

  return (
    <div className="h-[500px] w-full">
      <h3 className="text-base font-semibold mb-4">Clicks Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColor} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={themeColor} stopOpacity={0}/>
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
            formatter={(value: number) => [`${value} clicks`, 'Clicks']}
            labelStyle={{ fontSize: 12 }}
            contentStyle={{ fontSize: 12 }}
          />
          <Area 
            type="monotone" 
            dataKey="clicks" 
            stroke={themeColor}
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorClicks)" 
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
} 