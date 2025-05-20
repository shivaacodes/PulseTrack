import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

export default function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card className="bg-white border-gray-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between px-4 ">
        <CardTitle className="text-sm font-semibold text-gray-700">{title}</CardTitle>
        <div className="text-gray-600 bg-gray-50 p-1.5 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent className="px-4 pb-1">
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-black">{value}</div>
          {trend && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              trend.positive ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}