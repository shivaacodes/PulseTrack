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

    try {
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
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(errorData)}`);
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
    trackEvent("click", {
      element: target.tagName.toLowerCase(),
      id: target.id || null,
      class: target.className || null,
      text: target.textContent?.trim().substring(0, 50) || null,
      x: event.clientX,
      y: event.clientY
    });
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
