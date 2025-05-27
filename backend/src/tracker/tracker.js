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
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/${clientId}`;
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
      try {
        const data = JSON.parse(event.data);
        console.log('PulseTrack: WebSocket message received:', data);
      } catch (error) {
        console.error('PulseTrack: Error parsing WebSocket message:', error);
      }
    };
  }

  // Connect to WebSocket when script loads
  connectWebSocket();

  // Function to send events to backend
  async function trackEvent(name, properties = {}) {
    const visitorId = getVisitorId();
    const payload = {
      name: name,
      domain: window.location.hostname,
      properties: {
        ...properties,
        timestamp: new Date().toISOString(),
        visitor_id: visitorId,
        path: window.location.pathname
      }
    };

    try {
      // Send to REST API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
      }

      // Also send through WebSocket for real-time updates
      if (ws && ws.readyState === WebSocket.OPEN) {
        const wsMessage = {
          type: "analytics_update",
          site_id: parsedSiteId,
          name: name,
          data: [{
            time: new Date().toLocaleTimeString(),
            clicks: name === 'click' ? 1 : 0
          }]
        };
        ws.send(JSON.stringify(wsMessage));
      }
    } catch (error) {
      console.error("PulseTrack: Error sending event", error);
    }
  }

  // Track page view on load
  window.addEventListener("load", () => {
    trackPageView();
  });

  // Track clicks
  document.addEventListener("click", (event) => {
    const target = event.target;
    console.log('PulseTrack: Click detected on element:', target);
    
    // Only track clicks on buttons and interactive elements
    if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.tagName === 'INPUT') {
      trackClick(event);
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

  // Track click events
  function trackClick(e) {
    const target = e.target;
    const properties = {
      element: target.tagName.toLowerCase(),
      id: target.id || null,
      class: target.className || null,
      text: target.textContent?.trim() || null,
      timestamp: new Date().toISOString()
    };

    trackEvent('click', properties);
  }

  // Track page views
  function trackPageView() {
    const properties = {
      path: window.location.pathname,
      timestamp: new Date().toISOString()
    };

    trackEvent('pageview', properties);
  }

  // Track form submissions
  function trackFormSubmit(e) {
    const form = e.target;
    const properties = {
      form_id: form.id || null,
      form_action: form.action || null,
      timestamp: new Date().toISOString()
    };

    trackEvent('form_submit', properties);
  }
})();
