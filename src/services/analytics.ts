export interface Site {
  id: number;
  name: string;
  domain: string;
  created_at: string;
}

export const analyticsService = {
  getSites: async (): Promise<Site[]> => {
    const res = await fetch('/api/sites');
    if (!res.ok) throw new Error('Failed to fetch sites');
    return res.json();
  },

  createSite: async (name: string, domain: string): Promise<Site> => {
    const res = await fetch('/api/sites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, domain })
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create site');
    }
    
    return res.json();
  }
};