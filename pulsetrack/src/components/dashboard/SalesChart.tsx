import React from 'react';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

type ThemeColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange';

const getThemeColor = (theme: ThemeColor) => {
  switch (theme) {
    case 'green':
      return '#22c55e';
    case 'red':
      return '#ef4444';
    case 'yellow':
      return '#eab308';
    case 'blue':
      return '#3b82f6';
    case 'orange':
      return '#f97316';
    default:
      return '#22c55e';
  }
};

const data = [
  { month: 'Jan', sales: 1200 },
  { month: 'Feb', sales: 3900 },
  { month: 'Mar', sales: 2100 },
  { month: 'Apr', sales: 5200 },
  { month: 'May', sales: 3000 },
  { month: 'Jun', sales: 4700 },
  { month: 'Jul', sales: 1500 },
  { month: 'Aug', sales: 6000 },
  { month: 'Sep', sales: 3200 },
  { month: 'Oct', sales: 7000 },
  { month: 'Nov', sales: 4100 },
  { month: 'Dec', sales: 5400 },
];

export default function SalesChart() {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeColor>('green');

  React.useEffect(() => {
    // Listen for theme changes from ThemeSelector
    const handleThemeChange = (event: CustomEvent<ThemeColor>) => {
      setCurrentTheme(event.detail);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="col-span-3 bg-white">
      <div className="flex flex-row items-center justify-between pb-4 px-32 pt-8">
        <div>
          <h3 className="text-2xl font-bold text-black">Retention Rates</h3>
          <p className="text-base text-gray-500 mt-2">User retention overview</p>
        </div>
      </div>
      <div className="px-12 pb-8 pt-2">
        <div className="h-[400px] max-w-[90%] mx-auto">
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                theme: {
                  light: themeColor,
                  dark: themeColor,
                },
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 30,
                  right: 50,
                  left: 50,
                  bottom: 30,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={15}
                  tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 500 }}
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col">
                              <span className="text-sm uppercase text-gray-500 font-medium">
                                {payload[0].payload.month}
                              </span>
                              <span className="font-bold text-lg text-black">
                                ${payload[0].value?.toLocaleString() ?? '0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke={themeColor}
                  strokeWidth={3}
                  dot={{ fill: themeColor, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8, fill: themeColor, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}