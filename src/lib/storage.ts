/**
 * SSR-safe localStorage wrapper.
 *
 * Next.js renders "use client" components on the server too (for SSR/hydration).
 * Some environments polyfill `window` but not `localStorage.getItem`, so
 * `typeof window !== 'undefined'` is NOT a reliable guard.
 *
 * Using try/catch is the only bulletproof approach.
 */

const storage = {
  getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // silently ignore — SSR or private-mode restrictions
    }
  },

  removeItem(key: string): void {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // silently ignore
    }
  },
};

export default storage;
