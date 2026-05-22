'use client';

import React, { useState, useEffect, useRef } from 'react';

interface LiveEvent {
  id: string;
  name: string;
  visitorId: string;
  path: string;
  details: string;
  timestamp: string;
}

interface LivePulseStreamProps {
  selectedSite: string;
}

export default function LivePulseStream({ selectedSite }: LivePulseStreamProps) {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Server-Sent Events (SSE) Connection
  useEffect(() => {
    if (!selectedSite) return;

    const sseUrl = `/api/stream?site_id=${selectedSite}`;
    console.log('LivePulseStream: Connecting SSE to', sseUrl);

    let eventSource: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      try {
        eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => {
          console.log('LivePulseStream: SSE Connected');
        };

        eventSource.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);

            if (payload.type === 'connected') {
              console.log('LivePulseStream: Handshake successful');
              return;
            }

            if (payload.type === 'live_event') {
              const newEvt: LiveEvent = {
                id: payload.event.id.toString(),
                name: payload.event.name,
                visitorId: payload.event.visitorId || 'anonymous',
                path: payload.event.path || '/',
                details: payload.event.details || '',
                timestamp: new Date(payload.event.timestamp).toLocaleTimeString()
              };

              setEvents(prev => [...prev.slice(-30), newEvt]);
            }
          } catch (err) {
            console.error('Error parsing live SSE event:', err);
          }
        };

        eventSource.onerror = (err) => {
          console.warn('LivePulseStream: SSE offline or dropped.', err);
          eventSource?.close();
          // Attempt reconnect
          reconnectTimeout = setTimeout(connect, 5000);
        };
      } catch (err) {
        console.warn('SSE connection error:', err);
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [selectedSite]);

  // Scroll to bottom on new log items
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const getEventBadgeClass = (name: string) => {
    switch (name) {
      case 'pageview':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-300';
      case 'click':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 dark:bg-indigo-500/20 dark:text-indigo-300';
      case 'scroll':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20 dark:bg-purple-500/20 dark:text-purple-300';
      case 'conversion':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400 font-extrabold';
      case 'threat':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400 font-bold border-dashed';
      default:
        return 'bg-neutral-950 text-neutral-400 border-neutral-850';
    }
  };

  return (
    <div className="space-y-6 w-full bg-transparent">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden transition-colors">
        <div className="relative z-10 flex items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono uppercase">
              Live Insights Stream
            </h2>
          </div>
        </div>
      </div>

      {/* Cyberpunk Activity Log Terminal */}
      <div className="rounded-none border border-neutral-200 dark:border-neutral-800 bg-neutral-950 overflow-hidden shadow-none flex flex-col h-[600px]">
        {/* Terminal Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-neutral-900 bg-neutral-900/40 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">[SHELL] apex-analytics@stream-monitor: ~</span>
          </div>
          <span className="text-neutral-300 font-bold tracking-wider">LIVE MONITORING ACTIVE</span>
        </div>

        {/* Terminal Body Logs */}
        <div className="flex-1 p-6 overflow-y-auto font-mono text-xs md:text-sm space-y-4 scrollbar-thin bg-neutral-950">
          {events.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-2">
              <span className="font-mono text-xs uppercase tracking-widest">[Waiting for connection / event actions]</span>
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                className="flex items-start md:items-center gap-3 py-2 border-b border-neutral-900 hover:bg-neutral-900/30 rounded-none px-2 transition-all animate-slide-in"
              >
                {/* Time */}
                <span className="text-neutral-500 font-mono select-none w-20 flex-shrink-0">
                  [{evt.timestamp}]
                </span>

                {/* Event Name Badge */}
                <span className={`px-2.5 py-0.5 rounded-none border text-[10px] uppercase font-bold tracking-wider flex-shrink-0 ${getEventBadgeClass(evt.name)}`}>
                  {evt.name}
                </span>

                {/* Visitor ID */}
                <span className="text-neutral-400 font-semibold flex-shrink-0 w-24 hidden md:inline truncate">
                  {evt.visitorId}
                </span>

                {/* Details */}
                <span className="text-neutral-100 font-medium flex-1">
                  {evt.details}
                </span>

                {/* Path */}
                <span className="text-neutral-400 font-mono hidden md:inline max-w-40 truncate">
                  {evt.path}
                </span>
              </div>
            ))
          )}
          <div ref={logEndRef} />
        </div>
      </div>
    </div>
  );
}
