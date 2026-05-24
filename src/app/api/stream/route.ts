import { NextRequest } from 'next/server';
import { liveEventEmitter } from '../track/route';

// Mark this route as dynamic so it doesn't get statically compiled
export const dynamic = 'force-dynamic';

/**
 * Server-Sent Events (SSE) Stream Endpoint
 * 
 * Architectural Decision:
 * We use SSE instead of WebSockets for the Live Pulse dashboard because our 
 * data flow is strictly unidirectional (Server -> Client) for live tracking events.
 * SSE leverages standard HTTP, which works seamlessly through corporate firewalls,
 * proxies, and standard load balancers without requiring protocol upgrades (HTTP/1.1 -> WS).
 * It also natively supports automatic reconnection in the browser.
 */
export async function GET(req: NextRequest) {
  // Extract site_id from URL query params
  const { searchParams } = new URL(req.url);
  const siteId = searchParams.get('site_id');

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send an initial connected message
      controller.enqueue(encoder.encode('data: ' + JSON.stringify({ type: 'connected' }) + '\n\n'));

      // The listener function for new events
      const onNewEvent = (eventData: any) => {
        // If site_id is provided, only forward events for that site
        if (siteId && eventData.site_id.toString() !== siteId) {
          return;
        }

        const payload = {
          type: 'live_event',
          event: eventData
        };

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      // Subscribe to the global event emitter
      liveEventEmitter.on('new_event', onNewEvent);

      // Keep the connection alive with a heartbeat ping every 15 seconds
      const pingInterval = setInterval(() => {
        controller.enqueue(encoder.encode(': ping\n\n'));
      }, 15000);

      // Clean up when the client disconnects
      req.signal.addEventListener('abort', () => {
        liveEventEmitter.off('new_event', onNewEvent);
        clearInterval(pingInterval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
