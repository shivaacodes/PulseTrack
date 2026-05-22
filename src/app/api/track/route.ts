import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { EventEmitter } from 'events';

// Create a global event emitter for SSE streaming within the same Node process
// In Next.js dev mode, global variables can be re-instantiated, so we attach it to the global object
const globalForEvents = global as unknown as { liveEventEmitter: EventEmitter };
export const liveEventEmitter = globalForEvents.liveEventEmitter || new EventEmitter();
if (process.env.NODE_ENV !== 'production') globalForEvents.liveEventEmitter = liveEventEmitter;

// To handle preflight CORS if needed
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { site_id, name, visitor_id, path, details } = payload;

    if (!site_id || !name || !visitor_id || !path) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to database
    const stmt = db.prepare('INSERT INTO events (site_id, name, visitor_id, path, details) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(site_id, name, visitor_id, path, details || '');

    const newEvent = {
      id: info.lastInsertRowid,
      site_id,
      name,
      visitorId: visitor_id,
      path,
      details: details || '',
      timestamp: new Date().toISOString(),
    };

    // Emit the event so the SSE endpoint can instantly push it to connected clients
    liveEventEmitter.emit('new_event', newEvent);

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error tracking event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
