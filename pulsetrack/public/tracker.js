// Tracker Script

(function () {
  // Get site-id from script tag
  const scriptTag = document.currentScript;
  const siteId = scriptTag.getAttribute("data-site-id");

  if (!siteId) {
    console.error("PulseTrack: Missing data-site-id attribute");
    return;
  }

  // Base URL for PulseTrack API
  const API_URL = "http://localhost:8000/api/v1/events";

  // Track session start time
  const sessionStartTime = new Date();

  // Function to send events to backend
  function trackEvent(type, data = {}) {
    const payload = {
      site_id: siteId,
      name: type,
      user_id: null, // Will be set by the backend based on session
      properties: {
        ...data,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    };

    // Use sendBeacon for better reliability, especially during page unload
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(API_URL, blob);
    } else {
      // Fallback to fetch if sendBeacon is not available
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        mode: "cors",
        credentials: "include", // Include cookies for session tracking
        keepalive: true, // Ensure request is sent even on page unload
      }).catch((error) => {
        console.error("PulseTrack: Error sending event", error);
      });
    }
  }

  // Track page view on load
  window.addEventListener("load", () => {
    trackEvent("page_view", {
      title: document.title,
      path: window.location.pathname,
      is_bounce: true, // Will be set to false if user interacts
    });
  });

  // Track clicks and interactions
  document.addEventListener("click", (event) => {
    const target = event.target;
    // Mark as not bounced if user interacts
    trackEvent("click", {
      element: target.tagName,
      id: target.id || null,
      class: target.className || null,
      text: target.textContent?.trim() || null,
      is_bounce: false,
    });
  });

  // Track page unload (for session duration)
  window.addEventListener("unload", () => {
    trackEvent("page_unload", {
      duration: performance.now() / 1000, // Convert to seconds
    });
  });
})(); 