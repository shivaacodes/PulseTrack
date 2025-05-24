'use client';

import React, { useEffect, useState } from 'react';
import { Card, Typography, CircularProgress } from '@mui/material';
import { Bar } from 'react-chartjs-2';

const RetentionChart: React.FC = () => {
  const [data, setData] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/analytics/overview?site_id=1&days=30');
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await response.json();
        setData(analyticsData.retention_rate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const chartData = {
    labels: ['Retention Rate'],
    datasets: [
      {
        label: 'Retention Rate (%)',
        data: [data],
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
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

export default RetentionChart; 