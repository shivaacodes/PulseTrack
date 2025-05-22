// Tracker Script

(function () {
  // Get site-id from script tag
  const scriptTag = document.currentScript;
  const siteId = scriptTag.getAttribute("data-site-id");

  if (!siteId) {
    console.error("PulseTrack: Missing data-site-id attribute");
    return;
  }

  // Base URL for PulseTrack API - Update this to your production API URL
  const API_URL = "https://api.pulsetrack.com/api/v1/events"; // Update this to your actual API endpoint

  // Function to send events to backend
  function trackEvent(type, data = {}) {
    const payload = {
      site_id: siteId,
      type: type,
      data: {
        ...data,
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      },
    };

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Site-ID": siteId, // For authentication
      },
      body: JSON.stringify(payload),
      mode: "cors", // Enable CORS
      keepalive: true, // Ensure request is sent even on page unload
    }).catch((error) => {
      console.error("PulseTrack: Error sending event", error);
    });
  }

  // Track page view on load
  window.addEventListener("load", () => {
    trackEvent("page_view");
  });

  // Track clicks
  document.addEventListener("click", (event) => {
    const target = event.target;
    trackEvent("click", {
      element: target.tagName,
      id: target.id || null,
      class: target.className || null,
    });
  });

  // Track page unload (for session duration)
  window.addEventListener("unload", () => {
    trackEvent("page_unload");
  });
})(); 