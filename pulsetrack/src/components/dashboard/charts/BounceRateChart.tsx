'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const BounceRateChart: React.FC = () => {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await analyticsApi.getOverview(user?.id || 1);
        setData(analyticsData.bounce_rate);
      } catch (err) {
        console.error('Error fetching bounce rate:', err);
        setError('Failed to load bounce rate data');
        // Fallback to default data
        setData(35);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const chartData = {
    labels: ['Bounce Rate'],
    datasets: [
      {
        label: 'Bounce Rate (%)',
        data: [data],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Bounce Rate
      </Typography>
      <Bar data={chartData} />
    </Card>
  );
};

export default BounceRateChart; 