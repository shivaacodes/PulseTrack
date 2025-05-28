'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AnalyticsChart from "./charts/AnalyticsChart";
import PageVisitsChart from "./charts/PageVisitsChart";
import ClickRateChart from "./charts/ClickRateChart";
import BounceRateChart from "./charts/BounceRateChart";
import ConversionChart from "./charts/ConversionChart";
import RetentionChart from "./charts/RetentionChart";

type ChartType = 'analytics' | 'visits' | 'clicks' | 'bounce' | 'conversion' | 'retention';

export default function ChartSelector() {
  const [selectedChart, setSelectedChart] = useState<ChartType>('analytics');

  const renderChart = () => {
    switch (selectedChart) {
      case 'analytics':
        return <AnalyticsChart />;
      case 'visits':
        return <PageVisitsChart />;
      case 'clicks':
        return <ClickRateChart />;
      case 'bounce':
        return <BounceRateChart />;
      case 'conversion':
        return <ConversionChart />;
      case 'retention':
        return <RetentionChart />;
      default:
        return <AnalyticsChart />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedChart === 'analytics' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('analytics')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Analytics
        </Button>
        <Button
          variant={selectedChart === 'visits' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('visits')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Page Visits
        </Button>
        <Button
          variant={selectedChart === 'clicks' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('clicks')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Click Rate
        </Button>
        <Button
          variant={selectedChart === 'bounce' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('bounce')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Bounce Rate
        </Button>
        <Button
          variant={selectedChart === 'conversion' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('conversion')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Conversion
        </Button>
        <Button
          variant={selectedChart === 'retention' ? 'default' : 'outline'}
          onClick={() => setSelectedChart('retention')}
          className="text-sm md:text-base h-8 md:h-10"
        >
          Retention
        </Button>
      </div>
      {renderChart()}
    </div>
  );
} 