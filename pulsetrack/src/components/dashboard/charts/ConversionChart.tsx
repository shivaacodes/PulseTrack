'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const data = [
  { name: 'Home', rate: 2.5 },
  { name: 'Products', rate: 4.2 },
  { name: 'About', rate: 1.8 },
  { name: 'Contact', rate: 3.1 },
  { name: 'Blog', rate: 2.9 },
];

export default function ConversionChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="h-[500px]">
      <h3 className="text-base font-semibold mb-4 text-red-600">Conversion Rate by Page</h3>
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