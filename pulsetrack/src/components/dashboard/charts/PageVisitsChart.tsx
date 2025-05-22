'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const data = [
  { name: 'Mon', visits: 2400 },
  { name: 'Tue', visits: 1398 },
  { name: 'Wed', visits: 9800 },
  { name: 'Thu', visits: 3908 },
  { name: 'Fri', visits: 4800 },
  { name: 'Sat', visits: 3800 },
  { name: 'Sun', visits: 4300 },
];

export default function PageVisitsChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="h-[500px]">
      <h3 className="text-base font-semibold mb-4 text-red-600">Page Visits</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="visits" 
            stroke={themeColor}
            strokeWidth={2}
            dot={{ r: 4, fill: themeColor }}
            activeDot={{ r: 6, fill: themeColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 