'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

const data = [
  { day: 'Day 1', rate: 100 },
  { day: 'Day 2', rate: 75 },
  { day: 'Day 3', rate: 60 },
  { day: 'Day 4', rate: 45 },
  { day: 'Day 5', rate: 35 },
  { day: 'Day 6', rate: 30 },
  { day: 'Day 7', rate: 25 },
];

const getColorClass = (value: number) => {
  if (value >= 80) return 'fill-green-500';
  if (value >= 60) return 'fill-blue-500';
  if (value >= 40) return 'fill-yellow-500';
  if (value >= 20) return 'fill-orange-500';
  return 'fill-red-500';
};

export default function RetentionChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="h-[500px]">
      <h3 className="text-base font-semibold mb-4 text-red-600">User Retention</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
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