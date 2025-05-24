'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const RetentionRateChart: React.FC = () => {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await analyticsApi.getOverview(user?.id || 1);
        setData(analyticsData.retention_rate);
      } catch (err) {
        console.error('Error fetching retention rate:', err);
        setError('Failed to load retention rate data');
        // Fallback to default data
        setData(65);
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
    labels: ['Retention Rate'],
    datasets: [
      {
        label: 'Retention Rate (%)',
        data: [data],
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Retention Rate
      </Typography>
      <Bar data={chartData} />
    </Card>
  );
};

export default RetentionRateChart; 