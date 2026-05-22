'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ChartSelectorProps {
  selectedSite: string;
}

interface AnalyticsData {
  pageviews: number;
  visitors: number;
  avgLoadTime: number;
  avgTtfb: number;
  bounceRate: number;
  engagements: number;
}

export default function ChartSelector({ selectedSite }: ChartSelectorProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Poll for real data every 3 seconds to keep dashboard "live"
  useEffect(() => {
    if (!selectedSite) return;
    
    let isMounted = true;
    
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/analytics?siteId=${selectedSite}`);
        const json = await res.json();
        if (isMounted && !json.error) {
          setData(json);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 3000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedSite]);

  // Convert real ms load time to seconds for the chart (e.g. 1200ms -> 1.2s)
  const realLcp = (data?.avgLoadTime || 0) / 1000;
  
  // 3. Conversion cliff chart dataset (static visualization model)
  const conversionCurveData = [
    { lcp: '0.5s', conversion: 4.5, label: '0.5s (Excellent)' },
    { lcp: '1.0s', conversion: 4.3, label: '1.0s (Very Good)' },
    { lcp: '1.5s', conversion: 4.0, label: '1.5s (Good)' },
    { lcp: '2.0s', conversion: 3.5, label: '2.0s (Average)' },
    { lcp: '2.5s', conversion: 2.8, label: '2.5s (Delayed)' },
    { lcp: '3.0s', conversion: 1.9, label: '3.0s (Poor)' },
    { lcp: '3.5s', conversion: 1.2, label: '3.5s (Very Poor)' },
    { lcp: '4.0s', conversion: 0.5, label: '4.0s (Critical)' },
  ];

  // Find the closest point in the static dataset matching the user's actual LCP
  const closestLcpLabel = useMemo(() => {
    const lcpNum = Number(realLcp);
    const closestIndex = Math.max(0, Math.min(7, Math.round((lcpNum - 0.5) / 0.5)));
    return ['0.5s', '1.0s', '1.5s', '2.0s', '2.5s', '3.0s', '3.5s', '4.0s'][closestIndex];
  }, [realLcp]);

  // Determine chart theme color based on real load time (ideal is < 1500ms)
  const getChartColor = () => {
    if (!data || data.avgLoadTime === 0) return '#6b7280'; // gray-500 if no data
    if (data.avgLoadTime <= 1500) return '#10b981'; // emerald-500
    if (data.avgLoadTime <= 2500) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
  };

  const activeColor = getChartColor();

  return (
    <div className="space-y-6">
      {/* Real-time Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pageviews Card */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-none border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              TOTAL PAGEVIEWS
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {loading ? '...' : (data?.pageviews || 0).toLocaleString()}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-4 font-mono">
            Total number of full page loads tracked on this property.
          </p>
        </div>

        {/* Unique Visitors Card */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-none border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              UNIQUE SESSIONS
            </span>
            <div className="text-2xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {loading ? '...' : (data?.visitors || 0).toLocaleString()}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-4 font-mono">
            Distinct visitors based on persistent local storage identity generation.
          </p>
        </div>

        {/* Avg Load Time Card */}
        <div className="bg-white dark:bg-neutral-950 p-6 rounded-none border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between transition-colors duration-300">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500">
              AVG LOAD TIME
            </span>
            <div className="text-2xl font-black font-mono tracking-tight">
              {loading ? '...' : (
                <span className={
                  (data?.avgLoadTime || 0) <= 1500 ? 'text-emerald-500' :
                  (data?.avgLoadTime || 0) <= 2500 ? 'text-amber-500' : 'text-rose-500'
                }>
                  {data?.avgLoadTime || 0}<span className="text-sm font-normal opacity-70">ms</span>
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed mt-4 font-mono">
            Average absolute page load time captured dynamically via the browser window.performance API.
          </p>
        </div>
      </div>

      {/* Primary Chart Card Wrapper: Conversion Cliff visualizer */}
      <div className="bg-white dark:bg-neutral-950 p-6 md:p-8 rounded-none border border-neutral-200 dark:border-neutral-800 relative overflow-hidden transition-all shadow-none">
        <div className="mb-6 space-y-1.5">
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white font-mono uppercase tracking-wider">
            CONVERSION DROP-OFF CLIFF (CONVERSION RATE VS. LCP)
          </h3>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed">
            As loading times (Largest Contentful Paint) exceed 1.5 seconds, user bounce rates spike and conversion chances drop exponentially.
          </p>
        </div>

        <div className="h-[280px] w-full font-mono text-[10px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={conversionCurveData}
              margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="monoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={activeColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={activeColor} stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--border)" 
                vertical={false} 
              />
              <XAxis 
                dataKey="lcp" 
                stroke="var(--text-muted)" 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--text-muted)" 
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  borderRadius: '4px',
                  color: 'var(--foreground)',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number) => [`${value}%`, 'Conversion Rate']}
                labelFormatter={(label) => `LCP Time: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="conversion"
                stroke={activeColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#monoGrad)"
                animationDuration={1500}
              />
              {/* Dynamic vertical reference line representing their actual setup LCP position */}
              {(data?.avgLoadTime || 0) > 0 && (
                <ReferenceLine 
                  x={closestLcpLabel} 
                  stroke={activeColor} 
                  strokeWidth={2}
                  strokeDasharray="4 4" 
                  label={{ 
                    value: `REAL AVG (${realLcp.toFixed(2)}s)`, 
                    fill: activeColor, 
                    position: 'top',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                  }} 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}