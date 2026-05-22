'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { Providers } from '@/providers';
import type { ReactNode } from 'react';

/**
 * All client-side providers in one boundary.
 * This file has "use client" so Next.js correctly isolates
 * all browser-only code (localStorage, window, etc.) from SSR.
 */
export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Providers>
        {children}
      </Providers>
    </ThemeProvider>
  );
}
