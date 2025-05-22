'use client';

import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { useTheme } from '@/contexts/ThemeContext';

const data = [
  {
    id: 'Bounce Rate',
    data: [
      {
        x: 'Bounce Rate',
        y: 35
      }
    ]
  }
];

export default function BounceRateChart() {
  const { currentTheme, getThemeColor } = useTheme();
  const themeColor = getThemeColor(currentTheme);

  return (
    <div className="h-[400px]">
      <h3 className="text-base font-semibold mb-4">Bounce Rate</h3>
      <ResponsiveRadialBar
        data={data}
        valueFormat=">-.0f"
        padding={0.4}
        cornerRadius={2}
        margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
        radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
        labelsSkipAngle={10}
        labelsTextColor="#ffffff"
        colors={[themeColor]}
        theme={{
          tooltip: {
            container: {
              background: '#333',
              color: '#fff',
              fontSize: '12px',
              borderRadius: '4px',
              padding: '8px'
            }
          }
        }}
      />
    </div>
  );
} 