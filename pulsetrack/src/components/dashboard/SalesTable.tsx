import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    { month: 'Jan', sales: 1200, growth: '+12%' },
    { month: 'Feb', sales: 3900, growth: '+8%' },
    { month: 'Mar', sales: 2100, growth: '-5%' },
    { month: 'Apr', sales: 5200, growth: '+15%' },
    { month: 'May', sales: 3000, growth: '+3%' },
    { month: 'Jun', sales: 4700, growth: '+9%' },
    { month: 'Jul', sales: 4300, growth: '-4%' },
    { month: 'Aug', sales: 5000, growth: '+6%' },
    { month: 'Sep', sales: 4800, growth: '-2%' },
    { month: 'Oct', sales: 6100, growth: '+12%' },
    { month: 'Nov', sales: 5700, growth: '-3%' },
    { month: 'Dec', sales: 6500, growth: '+14%' }
];

export default function SalesTable() {
  const [currentTheme, setCurrentTheme] = React.useState<ThemeColor>('green');

  React.useEffect(() => {
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
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900">Monthly Overview</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-xs">Month</TableHead>
            <TableHead className="text-xs">Sales</TableHead>
            <TableHead className="text-xs">Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.month}>
              <TableCell className="font-medium text-xs">{row.month}</TableCell>
              <TableCell className="text-xs">${row.sales.toLocaleString()}</TableCell>
              <TableCell 
                className="text-xs"
                style={{ 
                  color: row.growth.startsWith('+') ? themeColor : '#ef4444'
                }}
              >
                {row.growth}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 