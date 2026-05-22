'use client';

import React, { useState, useEffect } from 'react';
import { analyticsService, Site } from '@/services/analytics';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';

interface DevSetupPanelProps {
  selectedSite: string;
  onSiteCreated?: () => void;
}

export default function DevSetupPanel({ selectedSite, onSiteCreated }: DevSetupPanelProps) {
  const [sites, setSites] = useState<Site[]>([]);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteDomain, setNewSiteDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSites = async () => {
    try {
      const data = await analyticsService.getSites();
      setSites(data);
    } catch (err) {
      console.error('Error fetching sites:', err);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const activeSite = sites.find(s => s.id.toString() === selectedSite) || sites[0];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName || !newSiteDomain) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const cleanDomain = newSiteDomain
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .split('/')[0];

      await analyticsService.createSite(newSiteName, cleanDomain);
      setNewSiteName('');
      setNewSiteDomain('');
      setSuccess('Site registered successfully!');
      fetchSites();
      if (onSiteCreated) onSiteCreated();
    } catch (err: unknown) {
      console.error('Error creating site:', err);
      const apiError = err as { response?: { data?: { detail?: string } } };
      setError(apiError.response?.data?.detail || 'Failed to register site. The domain might already exist.');
    } finally {
      setLoading(false);
    }
  };

  const renderScriptTag = () => {
    if (!activeSite) return <span className="text-neutral-500">&lt;!-- Register a site to generate tracking script --&gt;</span>;
    return (
      <>
        <span className="text-pink-500">&lt;script</span>
        <span className="text-emerald-400"> defer</span>
        <span className="text-emerald-400"> src=</span>
        <span className="text-amber-300">&quot;http://localhost:3000/tracker.js&quot;</span>
        <span className="text-emerald-400"> data-site-id=</span>
        <span className="text-amber-300">&quot;{activeSite.id}&quot;</span>
        <span className="text-pink-500">&gt;&lt;/script&gt;</span>
      </>
    );
  };

  const scriptTag = activeSite
    ? `<script defer src="http://localhost:3000/tracker.js" data-site-id="${activeSite.id}"></script>`
    : '<!-- Register a site to generate tracking script -->';

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 w-full bg-transparent">
      {/* Overview Block */}
      <div className="p-6 md:p-8 rounded-none bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-none relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono uppercase">
                Developer Integration Portal
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
                Quickly integrate the Apex Insights tracker onto your websites.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Form */}
        <div className="p-6 md:p-8 rounded-none bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-none">
          <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono uppercase">Register New Site</h3>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="site-name" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                Site Name
              </label>
              <Input
                id="site-name"
                type="text"
                placeholder="e.g. My SaaS Portal"
                value={newSiteName}
                onChange={(e) => setNewSiteName(e.target.value)}
                className="bg-white dark:bg-neutral-950 border-neutral-250 dark:border-neutral-800 focus:border-neutral-450 dark:focus:border-white text-neutral-900 dark:text-white rounded-none font-mono"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="site-domain" className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                Target Domain
              </label>
              <Input
                id="site-domain"
                type="text"
                placeholder="e.g. mysite.com or localhost"
                value={newSiteDomain}
                onChange={(e) => setNewSiteDomain(e.target.value)}
                className="bg-white dark:bg-neutral-950 border-neutral-250 dark:border-neutral-800 focus:border-neutral-450 dark:focus:border-white text-neutral-900 dark:text-white rounded-none font-mono"
              />
            </div>

            {error && (
              <div className="p-3 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 rounded-none text-xs font-mono text-rose-700 dark:text-rose-400 font-bold">
                [ERROR] {error}
              </div>
            )}

            {success && (
              <div className="p-3 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 rounded-none text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                [SUCCESS] {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-none h-11 flex items-center justify-center gap-2 transition-all border-0 cursor-pointer text-xs font-mono uppercase shadow-sm disabled:opacity-50"
            >
              {loading ? 'Registering...' : 'Register Site'}
            </button>
            
            <div className="pt-4 mt-4 border-t border-neutral-200 dark:border-neutral-800">
              <a 
                href="/demo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity font-bold uppercase text-xs font-mono h-11 rounded-none border-0"
              >
                Launch Sandbox Site
              </a>
              <p className="mt-2 text-xs text-neutral-500 font-mono text-center">
                Launch a pre-configured dummy e-commerce site to test telemetry streams.
              </p>
            </div>
          </form>
        </div>

        {/* Snippet Generator */}
        <div className="p-6 md:p-8 rounded-none bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-none">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono uppercase">Apex Tracker Snippet</h3>
            </div>
            {activeSite && (
              <span className="text-xs px-2.5 py-1 bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-850 rounded-none font-mono">
                Active: {activeSite.domain}
              </span>
            )}
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono">
            Copy and paste this script tag into the <code className="bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded-none text-neutral-900 dark:text-neutral-100 font-mono text-xs font-semibold">&lt;head&gt;</code> of your HTML template.
          </p>

          <div className="relative rounded-none overflow-hidden bg-neutral-950 border border-neutral-900">
            <div className="flex justify-between items-center px-4 py-2.5 border-b border-neutral-900 bg-neutral-900/40 text-xs text-neutral-400 font-mono">
              <span>HTML integration</span>
              <button
                onClick={handleCopy}
                disabled={!activeSite}
                className="hover:text-white flex items-center gap-1 transition-all cursor-pointer bg-transparent border-0"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-white" />
                    <span className="text-white font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 overflow-x-auto text-xs md:text-sm font-mono text-neutral-200 whitespace-pre scrollbar-thin">
              {renderScriptTag()}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              Setup Instructions
            </h4>
            <ul className="space-y-3 font-mono">
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 text-neutral-900 dark:text-white text-xs font-bold font-mono">
                  [1]
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Copy the script above to your website templates.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 text-neutral-900 dark:text-white text-xs font-bold font-mono">
                  [2]
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Visits from external domains will register immediately under your sites lists.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex-shrink-0 text-neutral-900 dark:text-white text-xs font-bold font-mono">
                  [3]
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Click the <b>Live Insights Stream</b> tab to monitor user interactions instantly!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
