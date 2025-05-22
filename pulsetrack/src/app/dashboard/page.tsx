'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const userId = searchParams.get('user_id');

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.replace('/');
      return;
    }

    // Verify that the user_id in URL matches the authenticated user
    if (userId && user && userId !== user.id.toString()) {
      router.replace(`/dashboard?user_id=${user.id}`);
    }
  }, [isAuthenticated, userId, user, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return null;
  }

  return <Dashboard />;
} 