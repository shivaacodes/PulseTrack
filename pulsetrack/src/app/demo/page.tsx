import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acme Corp Demo Site',
  description: 'A sandbox testing site for Apex Insights tracker.',
};

export default function DemoSite() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-sans">
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-black tracking-tight uppercase font-mono">Acme Corp Shop</h1>
        <nav className="space-x-4 text-sm font-semibold">
          <a href="#" className="hover:text-emerald-500">Products</a>
          <a href="#" className="hover:text-emerald-500">Pricing</a>
          <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-none font-bold uppercase text-xs">
            Sign In
          </button>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-12">
        <section className="text-center py-20 space-y-6">
          <h2 className="text-5xl font-black tracking-tighter">The Future of Everything.</h2>
          <p className="text-lg text-neutral-500 max-w-xl mx-auto">
            This is a dummy sandbox site designed to test the Apex Insights tracker. 
            Click the buttons below or scroll down to trigger real-time telemetry events!
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm">
              Buy Now - $99
            </button>
            <button className="border-2 border-black dark:border-white px-8 py-4 font-bold uppercase tracking-wider text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Read Documentation
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-neutral-200 dark:border-neutral-800 p-6 bg-white dark:bg-black space-y-4">
              <div className="aspect-video bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <span className="text-neutral-400 font-mono text-xs">Product Image {i}</span>
              </div>
              <h3 className="font-bold text-lg">Premium Widget {i}</h3>
              <p className="text-sm text-neutral-500">An incredible widget that does amazing things for your workflow.</p>
              <button className="w-full border border-neutral-300 dark:border-neutral-700 py-2 text-xs font-bold uppercase hover:bg-neutral-50 dark:hover:bg-neutral-800">
                Add to Cart
              </button>
            </div>
          ))}
        </section>

        {/* Padding to allow scrolling for scroll events */}
        <div className="h-[1000px] flex items-center justify-center text-neutral-300 dark:text-neutral-700 font-mono">
          Keep scrolling to trigger scroll depth events...
        </div>
      </main>

      {/* Embed the tracker script hardcoded to Site 1 (usually the default) */}
      <script defer src="/tracker.js" data-site-id="1"></script>
    </div>
  );
}
