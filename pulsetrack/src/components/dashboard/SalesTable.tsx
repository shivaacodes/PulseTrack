'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { analyticsApi, PagePerformance } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function SalesTable() {
  const [data, setData] = useState<PagePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await analyticsApi.getPagePerformance(user?.id || 1);
        setData(pageData);
      } catch (err) {
        console.error('Error fetching page performance:', err);
        setError('Failed to load page performance data');
        // Fallback to default data if API fails
        setData(defaultPageData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="h-[calc(100vh-240px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-240px)] flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-240px)]">
      <h3 className="text-base font-semibold mb-4 text-red-600">Page Performance</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[140px]">Page</TableHead>
            <TableHead className="text-right">Visitors</TableHead>
            <TableHead className="text-right">Bounce</TableHead>
            <TableHead className="text-right">Conv.</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(0, 9).map((row) => (
            <TableRow key={row.id} className="h-14">
              <TableCell className="font-medium">{row.page}</TableCell>
              <TableCell className="text-right tabular-nums">{(row.visitors || 0).toLocaleString()}</TableCell>
              <TableCell className="text-right tabular-nums">{row.bounceRate}</TableCell>
              <TableCell className="text-right tabular-nums">{row.conversion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}// Default data to show while loading or if API fails
const defaultPageData: PagePerformance[] = [
  {
    id: 1,
    page: 'Homepage',
    visitors: 12500,
    bounceRate: '32%',
    conversion: '4.2%'
  },
  {
    id: 2,
    page: 'Product List',
    visitors: 8500,
    bounceRate: '45%',
    conversion: '3.8%'
  },
  {
    id: 3,
    page: 'Product Detail',
    visitors: 6200,
    bounceRate: '28%',
    conversion: '5.5%'
  },
  {
    id: 4,
    page: 'Cart',
    visitors: 3100,
    bounceRate: '15%',
    conversion: '8.2%'
  },
  {
    id: 5,
    page: 'Checkout',
    visitors: 1800,
    bounceRate: '12%',
    conversion: '12.5%'
  },
  {
    id: 6,
    page: 'Blog',
    visitors: 4200,
    bounceRate: '38%',
    conversion: '2.8%'
  }
]; 

