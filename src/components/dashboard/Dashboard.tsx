'use client';

import React, { useState, useEffect, useCallback } from "react";
import ChartSelector from "./ChartSelector";
import LogoutButton from "./LogoutButton";
import LivePulseStream from "./LivePulseStream";
import DevSetupPanel from "./DevSetupPanel";
import PerformanceAuditor from "./PerformanceAuditor";
import DemoGuide from "./DemoGuide";
import { analyticsService, Site } from "@/services/analytics";
import { Activity, Radio, Terminal, BookOpen } from "lucide-react";

type TabType = 'analytics' | 'live' | 'setup' | 'guide';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('analytics');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedSite, setSelectedSite] = useState<string>('1');
  const [loadingSites, setLoadingSites] = useState(true);

  const fetchSites = useCallback(async () => {
    try {
      setLoadingSites(true);
      const data = await analyticsService.getSites();
      setSites(data);
      if (data.length > 0) {
        const exists = data.some(s => s.id.toString() === selectedSite);
        if (!exists) {
          setSelectedSite(data[0].id.toString());
        }
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
    } finally {
      setLoadingSites(false);
    }
  }, [selectedSite]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab') as TabType;
      if (tab) {
        setActiveTab(tab);
        // Optional: clean up the URL so it doesn't persist forever
        window.history.replaceState({}, '', '/dashboard');
      }
    }
  }, []);

  const handleSiteCreated = () => {
    fetchSites();
  };

  const renderContent = () => {
    if (activeTab === 'guide') {
      return <DemoGuide />;
    }
    if (activeTab === 'live') {
      return <LivePulseStream selectedSite={selectedSite} />;
    }
    if (activeTab === 'setup') {
      return <DevSetupPanel selectedSite={selectedSite} onSiteCreated={handleSiteCreated} />;
    }
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSelector selectedSite={selectedSite} />
          </div>
          <div className="lg:col-span-1">
            <PerformanceAuditor selectedSite={selectedSite} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-50 dark:bg-black text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-none bg-black dark:bg-white flex items-center justify-center">
                <span className="text-[10px] font-bold text-white dark:text-black">A</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white font-mono uppercase">
                Apex Insights
              </h1>
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <a 
              href="/demo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-mono px-3 py-1 rounded-none bg-black text-white dark:bg-white dark:text-black font-bold uppercase hover:opacity-80 transition-opacity flex items-center gap-1 cursor-pointer"
            >
              Open Demo Site
            </a>
            <LogoutButton />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 md:px-8 flex gap-6 overflow-x-auto scrollbar-none border-t border-neutral-200 dark:border-neutral-800/50 pt-3 pb-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'guide'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Quickstart Guide
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Activity className="h-4 w-4" />
            Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'live'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Radio className="h-4 w-4" />
            Live Pulse
            {activeTab !== 'live' && (
              <span className="ml-1 h-1.5 w-1.5 rounded-none bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'setup'
                ? 'border-black dark:border-white text-black dark:text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            Dev Setup
          </button>
        </div>
      </header>

      {/* Main Dashboard Panel Body */}
      <main className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto bg-transparent">
        {renderContent()}
      </main>
    </div>
  );
}
