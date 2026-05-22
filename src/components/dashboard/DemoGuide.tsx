'use client';

import React from 'react';
import { CheckCircle2, Code2, PlayCircle, Radio, TerminalSquare } from 'lucide-react';

export default function DemoGuide() {
  const steps = [
    {
      icon: <TerminalSquare className="w-5 h-5 text-blue-500" />,
      title: "1. Register a Target Site",
      description: "Navigate to the Dev Setup tab. Enter a recognizable name and domain (e.g., 'localhost' or 'my-test-site.com') to generate a unique site ID.",
      color: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
      accent: "text-blue-500"
    },
    {
      icon: <Code2 className="w-5 h-5 text-indigo-500" />,
      title: "2. Inject the Telemetry Snippet",
      description: "Copy the generated <script> tag from the Dev Setup panel. Paste this into the <head> of any local HTML file, OR simply use the built-in Sandbox Demo Site.",
      color: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900",
      accent: "text-indigo-500"
    },
    {
      icon: <PlayCircle className="w-5 h-5 text-amber-500" />,
      title: "3. Simulate Traffic",
      description: "Open the Sandbox Demo Site (or your custom site) in a separate browser window. Click buttons, scroll down the page, and navigate between routes to generate real telemetry events.",
      color: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900",
      accent: "text-amber-500"
    },
    {
      icon: <Radio className="w-5 h-5 text-emerald-500" />,
      title: "4. Watch the Live Pulse",
      description: "Return to the Apex Insights dashboard and open the Live Pulse tab. You will see your real-time telemetry streaming in with zero-latency via Server-Sent Events.",
      color: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900",
      accent: "text-emerald-500"
    }
  ];

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto bg-transparent animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Block */}
      <div className="p-6 md:p-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white font-mono uppercase">
              Platform Demo Guide
            </h2>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-mono leading-relaxed max-w-3xl">
              Follow this timeline to test the end-to-end telemetry pipeline. The backend is fully wired up with a zero-cost local SQLite database and an ultra-fast Server-Sent Events (SSE) stream.
            </p>
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold font-mono uppercase tracking-tight text-neutral-900 dark:text-neutral-100 px-2">
          Execution Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-10 translate-y-[-50%]" />
          
          {steps.map((step, idx) => (
            <div 
              key={idx}
              className={`p-6 border transition-all hover:shadow-md ${step.color} relative bg-opacity-50 backdrop-blur-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-white dark:bg-neutral-950 border shadow-sm ${step.color.split(' ')[0]} ${step.color.split(' ')[2]}`}>
                  {step.icon}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className={`text-sm md:text-base font-bold font-mono tracking-tight ${step.accent}`}>
                    {step.title}
                  </h4>
                  <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
