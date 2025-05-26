// PulseTrack Analytics Tracker
// This script tracks user interactions and sends them to the PulseTrack backend

(function () {
  // Get site-id from script tag
  const scriptTag = document.currentScript;
  const siteId = scriptTag.getAttribute("data-site-id");

  if (!siteId) {
    console.error("PulseTrack: Missing data-site-id attribute");
    return;
  }

  // Validate site ID
  const parsedSiteId = parseInt(siteId);
  if (isNaN(parsedSiteId)) {
    console.error("PulseTrack: Invalid site-id. Must be a number.");
    return;
  }

  // Generate a unique visitor ID if not exists
  function getVisitorId() {
    let visitorId = localStorage.getItem('pulsetrack_visitor_id');
    if (!visitorId) {
      visitorId = 'vis_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('pulsetrack_visitor_id', visitorId);
    }
    return visitorId;
  }

  // Base URL for PulseTrack API
  const API_URL = "/api/v1/analytics/events";
  
  // WebSocket connection
  let ws = null;
  const clientId = 'tracker_' + Math.random().toString(36).substring(2, 15);

  function connectWebSocket() {
    const wsUrl = `ws://localhost:8000/ws/${clientId}`;
    console.log('PulseTrack: Connecting to WebSocket:', wsUrl);
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('PulseTrack: WebSocket Connected');
    };

    ws.onclose = () => {
      console.log('PulseTrack: WebSocket Disconnected');
      // Try to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('PulseTrack: WebSocket Error', error);
    };

    ws.onmessage = (event) => {
      console.log('PulseTrack: WebSocket message received:', event.data);
    };
  }

  // Connect to WebSocket when script loads
  connectWebSocket();

  // Function to send events to backend
  async function trackEvent(name, properties = {}) {
    const visitorId = getVisitorId();
    const payload = {
      name: name,
      site_id: parsedSiteId,
      properties: {
        ...properties,
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        timestamp: new Date().toISOString(),
        visitor_id: visitorId
      }
    };

    console.log('PulseTrack: Tracking event:', name, payload);

    try {
      // Send to REST API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
        mode: "cors",
        keepalive: true
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = JSON.stringify(errorData);
        } catch (e) {
          errorMessage = await response.text();
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      // Also send through WebSocket for real-time updates
      if (ws && ws.readyState === WebSocket.OPEN) {
        const wsMessage = {
          type: "analytics_event",
          site_id: parsedSiteId,
          name: name,
          properties: payload.properties
        };
        console.log('PulseTrack: Sending WebSocket message:', wsMessage);
        ws.send(JSON.stringify(wsMessage));
      } else {
        console.warn('PulseTrack: WebSocket not connected, cannot send real-time update');
      }
    } catch (error) {
      console.error("PulseTrack: Error sending event", error);
    }
  }

  // Track page view on load
  window.addEventListener("load", () => {
    trackEvent("pageview", {
      title: document.title
    });
  });

  // Track clicks
  document.addEventListener("click", (event) => {
    const target = event.target;
    console.log('PulseTrack: Click detected on element:', target);
    
    // Only track clicks on buttons and interactive elements
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT') {
      trackEvent("click", {
        element: target.tagName.toLowerCase(),
        id: target.id || null,
        class: target.className || null,
        text: target.textContent?.trim().substring(0, 50) || null,
        x: event.clientX,
        y: event.clientY
      });
    }
  });

  // Track page unload (for session duration)
  window.addEventListener("beforeunload", () => {
    trackEvent("page_unload", {
      duration: performance.now() / 1000 // Convert to seconds
    });
  });

  // Track scroll depth
  let maxScroll = 0;
  window.addEventListener("scroll", () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackEvent("scroll", {
          depth: Math.round(maxScroll)
        });
      }
    }
  });
})();
