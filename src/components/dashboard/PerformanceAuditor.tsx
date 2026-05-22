'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  isActionable?: boolean;
}

interface PerformanceAuditorProps {
  selectedSite?: string;
}

export default function PerformanceAuditor({ selectedSite }: PerformanceAuditorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Auditor initialized. Ready to run diagnostics on live analytics stream.',
      timestamp: ''
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial timestamp on mount to prevent hydration mismatch
    setMessages((prev) => [
      { ...prev[0], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev.slice(1)
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender: 'ai' | 'user', text: string, isActionable = false) => {
    setMessages((prev) => [
      ...prev,
      {
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isActionable
      }
    ]);
  };

  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addMessage('user', text);
    setInputValue('');
    setIsTyping(true);

    try {
      // 1. Fetch real analytics data to give to the AI context
      let realContext = {};
      if (selectedSite) {
        const statsRes = await fetch(`/api/analytics?siteId=${selectedSite}`);
        const statsData = await statsRes.json();
        
        // Calculate a mock perfScore based on real average load time just to feed the prompt
        let computedScore = 100;
        if (statsData.avgLoadTime > 0) {
           computedScore = Math.max(10, Math.min(100, Math.round(100 - ((statsData.avgLoadTime - 800) / 20))));
        }

        realContext = {
          perfScore: computedScore,
          pageWeight: 'Dynamic',
          estimatedLatency: statsData.avgLoadTime || 0,
          cdnEnabled: statsData.avgLoadTime < 1500,
          deferJs: statsData.avgLoadTime < 2000,
        };
      }

      // 2. Fetch generative AI response
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: realContext
        })
      });

      const data = await res.json();
      
      if (data.text) {
        addMessage('ai', data.text);
      } else {
        addMessage('ai', "Error parsing AI response.");
      }
    } catch (err) {
      addMessage('ai', "[SYSTEM ERROR]: Could not reach inference API.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleChipClick = (cmd: string) => {
    handleSend(cmd);
  };

  // Helper to dynamically highlight keywords in AI text
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(100\/100|System Optimal|Audit completed|Score:|Recommendation:|Optimization complete)/g);
    
    return parts.map((part, i) => {
      if (['100/100', 'System Optimal', 'Optimization complete'].includes(part)) {
        return <span key={i} className="text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-none mx-0.5">{part}</span>;
      }
      if (['Audit completed', 'Score:', 'Recommendation:'].includes(part)) {
        return <span key={i} className="font-bold">{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-none p-6 flex flex-col h-[550px] lg:h-[600px] relative overflow-hidden transition-colors shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-none bg-emerald-500 animate-pulse" />
          <h3 className="text-xs font-bold text-neutral-900 dark:text-white font-mono tracking-widest uppercase">
            Apex Auditor
          </h3>
        </div>
        <span className="text-[9px] font-mono px-2 py-0.5 rounded-none bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-500/20">
          UX AGENT ONLINE
        </span>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-5 mb-4 scrollbar-thin text-xs md:text-sm font-sans scrollbar-track-transparent">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col max-w-[88%] ${
              m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
                {m.sender === 'user' ? 'You' : 'Apex Auditor'}
              </span>
              <span className="text-[9px] text-neutral-300 dark:text-neutral-600">
                {m.timestamp}
              </span>
            </div>
            <div
              className={`p-3.5 leading-relaxed whitespace-pre-wrap shadow-sm text-sm ${
                m.sender === 'user'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 rounded-none rounded-none font-medium'
                  : 'bg-neutral-50 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-800 rounded-none rounded-none'
              }`}
            >
              {m.sender === 'ai' ? renderFormattedText(m.text) : m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col max-w-[88%] mr-auto items-start animate-pulse">
             <div className="flex items-center gap-2 mb-1.5 px-1">
              <span className="text-[10px] text-neutral-400 font-medium tracking-wide">Apex Auditor</span>
            </div>
            <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-800 rounded-none rounded-none text-xs font-mono font-bold tracking-widest">
              [ANALYZING...]
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Audit suggestion chips */}
      <div className="flex flex-wrap gap-2 mb-4 font-mono">
        <button
          onClick={() => handleChipClick('Run AI Health Diagnosis')}
          className="text-[10px] font-semibold px-3 py-1.5 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-200 transition-colors cursor-pointer"
        >
          Run Diagnosis
        </button>
        <button
          onClick={() => handleChipClick('Identify primary bottlenecks')}
          className="text-[10px] font-bold px-3 py-1.5 rounded-none bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors cursor-pointer border border-emerald-200 dark:border-emerald-500/20"
        >
          Find Bottlenecks
        </button>
        <button
          onClick={() => handleChipClick('Explain Core Web Vitals')}
          className="text-[10px] font-semibold px-3 py-1.5 rounded-none bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
        >
          Explain Vitals
        </button>
      </div>

      {/* Chat input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="flex gap-2 relative"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI to audit setup or optimize payload..."
          className="flex-1 pl-4 pr-12 py-3 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-none text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors focus:bg-white dark:focus:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-neutral-900 dark:bg-white hover:bg-emerald-500 dark:hover:bg-emerald-500 text-white dark:text-neutral-950 hover:text-white rounded-none flex items-center justify-center p-0 border-0 flex-shrink-0 cursor-pointer font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </form>
    </div>
  );
}
