import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { analyticsService } from '../../../services/analytics';
import { useAuth } from '../../../contexts/AuthContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PagePerformance {
  date: string;
  pageviews: number;
  clicks: number;
  bounce_rate: number;
}

export const ClickRateChart: React.FC = () => {
  const [data, setData] = useState<PagePerformance[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsService.getPagePerformance(user.id.toString());
        setData(response);
      } catch (error) {
        console.error('Error fetching page performance data:', error);
      }
    };

    fetchData();
  }, [user.id]);

  const chartData = {
    labels: data.map(item => item.date),
    datasets: [
      {
        label: 'Click Rate (%)',
        data: data.map(item => (item.clicks / (item.pageviews || 1)) * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Bounce Rate (%)',
        data: data.map(item => item.bounce_rate),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Page Views',
        data: data.map(item => item.pageviews),
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Page Performance Metrics'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}; 