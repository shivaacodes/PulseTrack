(function() {
  const endpoint = '/api/track';
  const scriptTag = document.currentScript || document.querySelector('script[data-site-id]');
  const siteId = scriptTag ? scriptTag.getAttribute('data-site-id') : null;

  if (!siteId) {
    console.warn('Apex Tracker: Missing data-site-id attribute.');
    return;
  }

  // Generate or retrieve a persistent visitor ID for the session
  let visitorId = localStorage.getItem('apex_visitor_id');
  if (!visitorId) {
    visitorId = 'vis_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('apex_visitor_id', visitorId);
  }

  // Helper to send data via sendBeacon (non-blocking) or fallback to fetch
  function sendEvent(name, details) {
    const payload = {
      site_id: siteId,
      name: name,
      visitor_id: visitorId,
      path: window.location.pathname,
      details: details || ''
    };

    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: blob,
        keepalive: true
      }).catch(() => {});
    }
  }

  // Track initial pageview
  sendEvent('pageview', 'Loaded page ' + window.location.pathname);

  // Track global click events on buttons/links
  document.addEventListener('click', function(e) {
    const target = e.target;
    // Find the closest clickable element
    const clickable = target.closest('a, button, [role="button"], input[type="submit"]');
    if (clickable) {
      const text = clickable.innerText || clickable.value || clickable.getAttribute('aria-label') || 'element';
      // Truncate to keep payload small
      const cleanText = text.trim().substring(0, 30).replace(/\s+/g, ' ');
      if (cleanText) {
        sendEvent('click', `Clicked "${cleanText}"`);
      }
    }
  });

  // Track scroll depth milestones (25%, 50%, 75%, 100%)
  let scrollMilestones = new Set();
  document.addEventListener('scroll', function() {
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (docHeight <= 0) return;
    
    const scrolled = (window.scrollY / docHeight) * 100;
    
    [25, 50, 75, 100].forEach(milestone => {
      if (scrolled >= milestone && !scrollMilestones.has(milestone)) {
        scrollMilestones.add(milestone);
        sendEvent('scroll', `Scrolled down to ${milestone}%`);
      }
    });
  }, { passive: true });

  // Track Real Web Vitals (LCP, FID, TTFB)
  let vitals = { lcp: 0, fid: 0, ttfb: 0, loadTime: 0 };
  let performanceSent = false;

  const flushPerformance = () => {
    if (performanceSent) return;
    performanceSent = true;
    
    // Capture TTFB and total Load Time
    if (window.performance && window.performance.getEntriesByType) {
      const navEntries = window.performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        vitals.loadTime = Math.round(nav.loadEventEnd - nav.startTime);
        vitals.ttfb = Math.round(nav.responseStart - nav.startTime);
      }
    }

    if (vitals.loadTime > 0 || vitals.lcp > 0) {
      sendEvent('performance', JSON.stringify(vitals));
    }
  };

  if ('PerformanceObserver' in window) {
    // 1. Largest Contentful Paint (LCP)
    try {
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.lcp = Math.round(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {}

    // 2. First Input Delay (FID)
    try {
      new PerformanceObserver((entryList) => {
        const firstInput = entryList.getEntries()[0];
        if (firstInput) {
          vitals.fid = Math.round(firstInput.processingStart - firstInput.startTime);
        }
      }).observe({ type: 'first-input', buffered: true });
    } catch (e) {}
  }

  // Send performance data when the page is fully loaded
  window.addEventListener('load', function() {
    setTimeout(flushPerformance, 100);
  });
  
  // Fallback for capturing data if user leaves before load completes
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
      flushPerformance();
    }
  });

})();
