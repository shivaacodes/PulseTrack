'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data = [
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
  },
  {
    id: 7,
    page: 'About Us',
    visitors: 2800,
    bounceRate: '42%',
    conversion: '1.5%'
  },
  {
    id: 8,
    page: 'Contact',
    visitors: 1500,
    bounceRate: '35%',
    conversion: '2.1%'
  },
  {
    id: 9,
    page: 'FAQ',
    visitors: 3200,
    bounceRate: '25%',
    conversion: '1.8%'
  },
  {
    id: 10,
    page: 'Support',
    visitors: 2100,
    bounceRate: '30%',
    conversion: '2.3%'
  }
];

export default function SalesTable() {
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
          {data.map((row) => (
            <TableRow key={row.id} className="h-14">
              <TableCell className="font-medium">{row.page}</TableCell>
              <TableCell className="text-right tabular-nums">{row.visitors.toLocaleString()}</TableCell>
              <TableCell className="text-right tabular-nums">{row.bounceRate}</TableCell>
              <TableCell className="text-right tabular-nums">{row.conversion}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 