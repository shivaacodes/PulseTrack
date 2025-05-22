'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const data = [
  { name: 'Home', rate: 65 },
  { name: 'Products', rate: 45 },
  { name: 'About', rate: 30 },
  { name: 'Contact', rate: 25 },
  { name: 'Blog', rate: 40 },
];

export default function ClickRateChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="h-[500px]">
      <h3 className="text-base font-semibold mb-4 text-red-600">Click Rate by Page</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar 
            dataKey="rate" 
            fill={themeColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 