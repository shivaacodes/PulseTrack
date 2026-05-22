import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const siteId = searchParams.get('siteId');

    // Build WHERE clause depending on if siteId is passed
    const siteFilter = siteId ? `WHERE site_id = ?` : ``;
    const params = siteId ? [siteId] : [];

    // 1. Total Pageviews
    const pageviewsRow = db.prepare(`SELECT COUNT(*) as count FROM events WHERE name = 'pageview' ${siteId ? 'AND site_id = ?' : ''}`).get(...params) as { count: number };
    const pageviews = pageviewsRow?.count || 0;

    // 2. Total Unique Visitors (based on visitor_id)
    const visitorsRow = db.prepare(`SELECT COUNT(DISTINCT visitor_id) as count FROM events ${siteFilter}`).get(...params) as { count: number };
    const visitors = visitorsRow?.count || 0;

    // 3. Average Performance Metrics
    const perfEvents = db.prepare(`SELECT details FROM events WHERE name = 'performance' ${siteId ? 'AND site_id = ?' : ''}`).all(...params) as { details: string }[];
    
    let totalLoad = 0;
    let totalTtfb = 0;
    let validCount = 0;

    perfEvents.forEach(evt => {
      try {
        const data = JSON.parse(evt.details);
        if (data.loadTime) {
          totalLoad += data.loadTime;
          totalTtfb += data.ttfb || 0;
          validCount++;
        }
      } catch (e) {
        // ignore malformed JSON
      }
    });

    const avgLoadTime = validCount > 0 ? Math.round(totalLoad / validCount) : 0;
    const avgTtfb = validCount > 0 ? Math.round(totalTtfb / validCount) : 0;

    // Calculate bounce rate (visitors who only have exactly 1 pageview and no other events)
    // For simplicity in a SQLite query, we can just estimate bounce rate or do a complex query.
    // Simple estimation: (visitors - (clicks + scrolls)) / visitors (if negative, 0)
    const engagementRow = db.prepare(`SELECT COUNT(*) as count FROM events WHERE name IN ('click', 'scroll') ${siteId ? 'AND site_id = ?' : ''}`).get(...params) as { count: number };
    const engagements = engagementRow?.count || 0;
    
    let bounceRate = 0;
    if (visitors > 0) {
      const activeVisitors = Math.min(visitors, engagements);
      bounceRate = Math.round(((visitors - activeVisitors) / visitors) * 100);
    }

    return NextResponse.json({
      pageviews,
      visitors,
      avgLoadTime,
      avgTtfb,
      bounceRate,
      engagements
    });

  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
