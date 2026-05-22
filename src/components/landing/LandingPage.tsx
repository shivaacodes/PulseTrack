"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Activity, 
  TerminalSquare,
  Database,
  BrainCircuit,
  Lock
} from "lucide-react";

// --- Framer Motion Variants ---

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -150 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } },
};

const slideInRight = {
  hidden: { opacity: 0, x: 150 },
  show: { opacity: 1, x: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } },
};

const slideInTop = {
  hidden: { opacity: 0, y: -100 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } },
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const
    }
  }
};

export default function LandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  // Marquee scroll effect
  const { scrollYProgress } = useScroll();
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Interactive Revenue Loss Calculator states (Keeping this as a marketing widget)
  const [calcSessions, setCalcSessions] = useState(50000);
  const [calcAov, setCalcAov] = useState(2500);
  const [calcSpeed, setCalcSpeed] = useState(3.0);

  const handleDemoAccess = async () => {
    setIsLoading(true);
    router.push("/dashboard?tab=guide");
  };

  const calcRevenueLost = () => {
    if (calcSpeed <= 1.0) return 0;
    const delay = calcSpeed - 1.0;
    const baseConversionRate = 0.025; 
    const baselineRevenue = calcSessions * calcAov * baseConversionRate;
    const lostRevenue = baselineRevenue * 0.07 * delay;
    return Math.round(lostRevenue);
  };

  const revenueLost = calcRevenueLost();

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans text-black dark:text-white">
      {/* Clean Solid Background */}
      <div className="fixed inset-0 -z-10 bg-white dark:bg-neutral-950 pointer-events-none" aria-hidden="true" />

      {/* Empty Header area to maintain some spacing if needed, but the user requested removing the logo */}

      {/* Asymmetric Hero Section */}
      <section className="flex flex-col lg:flex-row items-center justify-between px-6 pt-20 md:pt-32 pb-24 max-w-[1400px] mx-auto z-10 w-full gap-16 overflow-hidden">
        
        {/* Left Side: Massive Typography */}
        <motion.div 
          variants={slideInLeft}
          initial="hidden"
          animate="show"
          className="flex-1 text-left w-full"
        >
          <h1 className="text-[12vw] sm:text-[9vw] lg:text-[7vw] font-oswald uppercase tracking-tighter leading-[0.9] mb-8 text-black dark:text-white relative mt-8">
            Stop <br/> Guessing. <br/>
            <span className="text-emerald-500 whitespace-nowrap">
              {"Measure.".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.8 + index * 0.12,
                    ease: [0.2, 0.65, 0.3, 0.9]
                  }}
                  className="inline-block"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: 1.8 }}
                className="inline-block font-light ml-1"
              >
                _
              </motion.span>
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-lg leading-relaxed mb-10 font-medium border-l-4 border-emerald-500 pl-4">
            A lightweight telemetry layer that captures Web Vitals, user actions, and performance bottlenecks in real time. Stream it live. Analyze instantly. Fix what actually affects conversions.
          </p>

          <Button
            onClick={handleDemoAccess}
            disabled={isLoading}
            size="lg"
            className="h-16 px-12 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-none transition-all duration-300 text-lg flex items-center gap-3 cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-2 border-black dark:border-white active:translate-y-2 active:translate-x-2 active:shadow-none uppercase tracking-widest font-mono"
          >
            {isLoading ? "Connecting..." : "Access Demo"}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Right Side: Mock Terminal */}
        <motion.div 
          variants={slideInRight}
          initial="hidden"
          animate="show"
          className="flex-1 w-full max-w-2xl bg-neutral-950 border-2 border-black dark:border-neutral-800 rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,0.05)] text-left font-mono relative z-20"
        >
          <div className="flex items-center px-4 py-3 border-b border-neutral-800 bg-neutral-900/50">
            <div className="flex gap-2">
               <div className="w-3 h-3 rounded-none bg-rose-500/50" />
               <div className="w-3 h-3 rounded-none bg-amber-500/50" />
               <div className="w-3 h-3 rounded-none bg-emerald-500/50" />
            </div>
            <div className="flex-1 text-center text-[10px] text-neutral-500 tracking-widest font-bold uppercase">
              Live Server-Sent Events Stream
            </div>
          </div>
          <div className="p-6 text-xs sm:text-sm text-neutral-400 space-y-3">
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-blue-400 font-bold border border-blue-500/30 px-1 bg-blue-500/10">PAGEVIEW</span> <span className="text-neutral-300">/products/shoes</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-purple-400 font-bold border border-purple-500/30 px-1 bg-purple-500/10">SCROLL</span> <span className="text-neutral-300">/pricing (52%)</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.4 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-emerald-400 font-bold border border-emerald-500/30 px-1 bg-emerald-500/10">PERFORMANCE</span> <span className="text-neutral-300">checkout load 0.82s</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.7 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-amber-400 font-bold border border-amber-500/30 px-1 bg-amber-500/10">CLICK</span> <span className="text-neutral-300">add_to_cart</span></motion.div>
             
             {/* Extended examples to make box taller */}
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.0 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-blue-400 font-bold border border-blue-500/30 px-1 bg-blue-500/10">PAGEVIEW</span> <span className="text-neutral-300">/checkout</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.3 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-rose-400 font-bold border border-rose-500/30 px-1 bg-rose-500/10">ERROR</span> <span className="text-neutral-300">stripe_js_timeout</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.6 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-emerald-400 font-bold border border-emerald-500/30 px-1 bg-emerald-500/10">PERFORMANCE</span> <span className="text-neutral-300">FID 12ms</span></motion.div>
             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.9 }} className="flex items-center gap-3"><span className="text-emerald-500">→</span> <span className="text-amber-400 font-bold border border-amber-500/30 px-1 bg-amber-500/10">CLICK</span> <span className="text-neutral-300">retry_payment</span></motion.div>
             
             <div className="flex items-center gap-3"><span className="text-emerald-500 animate-pulse">_</span></div>
          </div>
        </motion.div>
      </section>

      {/* Infinite Marquee Addition */}
      <div className="w-full overflow-hidden border-y-2 border-black dark:border-neutral-800 py-6 bg-neutral-100 dark:bg-neutral-900 z-10 relative">
        <motion.div 
          style={{ x: marqueeX, WebkitTextStroke: '1px currentColor', color: 'inherit' }} 
          className="whitespace-nowrap flex font-oswald text-5xl sm:text-7xl font-black uppercase tracking-tighter text-transparent"
        >
          <span className="mr-8">REAL-TIME TELEMETRY // ZERO LATENCY // </span>
          <span className="mr-8">NO FAKE DATA // ACTUAL USER ACTIONS // </span>
          <span className="mr-8">REAL-TIME TELEMETRY // ZERO LATENCY // </span>
          <span className="mr-8">NO FAKE DATA // ACTUAL USER ACTIONS // </span>
          <span className="mr-8">REAL-TIME TELEMETRY // ZERO LATENCY // </span>
          <span className="mr-8">NO FAKE DATA // ACTUAL USER ACTIONS // </span>
        </motion.div>
      </div>

      {/* Section 2: Real Architecture */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full py-28 px-6 max-w-5xl mx-auto border-t border-neutral-100 dark:border-neutral-900"
      >
        <div className="flex flex-col items-center mb-20 z-20 relative">
          <motion.div variants={fadeInUp} className="inline-block bg-emerald-500 border-4 border-black dark:border-white px-8 py-3 mb-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <h2 className="text-4xl sm:text-6xl font-black font-oswald uppercase tracking-tighter text-black">
              Built for engineering teams
            </h2>
          </motion.div>
          <motion.div variants={fadeInUp} className="bg-white dark:bg-neutral-950 border-l-8 border-emerald-500 p-6 max-w-3xl border-y-2 border-r-2 border-black dark:border-neutral-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-left">
            <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed font-mono">
              Unlike traditional analytics tools that batch data or hide latency issues, we capture Real User Web Vitals (LCP, FID, TTFB), session-level interaction flows, page-level performance degradation, and conversion-impacting delays.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-12 md:gap-8 relative max-w-4xl mx-auto mt-20">
          {/* Connecting Line behind the staircase */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-200 dark:bg-neutral-800 -z-10" />

          <motion.div variants={slideInTop} whileHover={{ scale: 1.05 }} className="self-start w-full md:w-[60%] bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-800 rounded-none p-8 transition-transform z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="h-12 w-12 rounded-none bg-emerald-500 flex items-center justify-center mb-6 border-2 border-black dark:border-white">
              <TerminalSquare className="h-6 w-6 text-black" />
            </div>
            <h4 className="font-black font-oswald text-2xl uppercase tracking-tight text-black dark:text-white mb-2">
              1. Browser Collector
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Uses native `window.performance` APIs to capture real load metrics with minimal overhead.
            </p>
          </motion.div>

          <motion.div variants={slideInLeft} whileHover={{ scale: 1.05 }} className="self-center w-full md:w-[60%] bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-800 rounded-none p-8 transition-transform z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="h-12 w-12 rounded-none bg-emerald-500 flex items-center justify-center mb-6 border-2 border-black dark:border-white">
              <Database className="h-6 w-6 text-black" />
            </div>
            <h4 className="font-black font-oswald text-2xl uppercase tracking-tight text-black dark:text-white mb-2">
              2. Streaming Ingestion
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Events are written to a persistent store and streamed in real time.
            </p>
          </motion.div>

          <motion.div variants={slideInRight} whileHover={{ scale: 1.05 }} className="self-end w-full md:w-[60%] bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-800 rounded-none p-8 transition-transform z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
            <div className="h-12 w-12 rounded-none bg-emerald-500 flex items-center justify-center mb-6 border-2 border-black dark:border-white">
              <Activity className="h-6 w-6 text-black" />
            </div>
            <h4 className="font-black font-oswald text-2xl uppercase tracking-tight text-black dark:text-white mb-2">
              3. Live SSE Dashboard
            </h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              All events flow instantly into a live monitoring interface via Server-Sent Events.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 3: Revenue Loss Model (Marketing Widget) */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        id="revenue-calculator" 
        className="relative z-10 w-full bg-neutral-50/70 dark:bg-neutral-950/50 border-t border-neutral-100 dark:border-neutral-900 py-24 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-start md:items-center text-left md:text-center mb-16 relative z-20">
            <motion.div variants={fadeInUp} className="inline-block bg-rose-500 border-4 border-black dark:border-white px-6 py-2 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
              <span className="text-xs font-black uppercase tracking-widest text-black font-mono block">
                Performance Impact Simulator
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-5xl font-oswald uppercase tracking-tight mb-4 text-black dark:text-white max-w-3xl">
              Even small delays <span className="text-rose-500">reduce conversions significantly</span>
            </motion.h2>
            <motion.div variants={fadeInUp} className="bg-white dark:bg-neutral-950 border-l-8 border-rose-500 p-4 border-y-2 border-r-2 border-black dark:border-neutral-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] text-left inline-block mt-4">
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-bold font-mono">
                Slow websites don’t just feel bad. They lose money.
              </p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ scale: 0.8, rotate: -4, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-800 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)]"
          >
            <div className="lg:col-span-5 p-6 md:p-10 flex flex-col justify-between space-y-6 border-b-4 lg:border-b-0 lg:border-r-4 border-black dark:border-neutral-800 bg-white dark:bg-neutral-950">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                Interactive Modeler
              </span>

              <div className="space-y-2.5">
                <div className="flex justify-between font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                  <span>MONTHLY SESSIONS</span>
                  <span className="text-black dark:text-white font-extrabold">{calcSessions.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={calcSessions}
                  onChange={(e) => setCalcSessions(parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-black dark:accent-white focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                  <span>AVERAGE ORDER VALUE (AOV)</span>
                  <span className="text-black dark:text-white font-extrabold">₹{calcAov.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={calcAov}
                  onChange={(e) => setCalcAov(parseInt(e.target.value))}
                  className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-black dark:accent-white focus:outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between font-mono text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                  <span>YOUR CURRENT LOAD TIME</span>
                  <span className="text-rose-500 dark:text-rose-455 font-extrabold font-mono">{calcSpeed.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="6.0"
                  step="0.1"
                  value={calcSpeed}
                  onChange={(e) => setCalcSpeed(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded appearance-none cursor-pointer accent-rose-500 dark:accent-rose-455 focus:outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-7 bg-neutral-900 border-neutral-800 rounded-none p-6 md:p-12 flex flex-col justify-center text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.03),transparent_60%)] pointer-events-none group-hover:bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_70%)] transition-colors duration-700" />
              <div className="my-6 z-10 text-center">
                <p className="text-xs uppercase font-extrabold tracking-widest text-neutral-500 font-mono mb-2">
                  Estimated Monthly Sales Leaking
                </p>
                {revenueLost > 0 ? (
                  <motion.div key="lost" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                    <h3 className="text-5xl sm:text-7xl font-black text-rose-400 tracking-tight leading-none font-mono">
                      ₹{revenueLost.toLocaleString("en-IN")}
                    </h3>
                    <p className="text-xs text-neutral-400 font-semibold pt-4">
                      You're bleeding <span className="text-white font-extrabold">₹{revenueLost.toLocaleString("en-IN")}</span> every month because your site is slow.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key="optimal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-1">
                    <h3 className="text-5xl sm:text-7xl font-black text-emerald-400 tracking-tight leading-none font-mono">
                      ₹0
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold pt-4">
                      Optimal load speed! You have achieved sub-second loading with 0% conversion leak.
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 4: AI Auditor Showcase */}
      <motion.section 
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 w-full py-24 px-6 max-w-5xl mx-auto border-t border-neutral-100 dark:border-neutral-900"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center justify-between">
          <motion.div variants={slideInLeft} className="max-w-md w-full flex flex-col items-start relative z-20">
            <motion.div variants={fadeInUp} className="inline-block bg-blue-500 border-4 border-black dark:border-white px-6 py-2 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
              <span className="text-xs font-black uppercase tracking-widest text-black font-mono block">
                Apex Auditor
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl sm:text-6xl font-black font-oswald uppercase tracking-tighter mb-4 text-black dark:text-white">
              AI Performance Analyst
            </motion.h2>

            <motion.div variants={fadeInUp} className="bg-white dark:bg-neutral-950 border-l-8 border-blue-500 p-6 border-y-2 border-r-2 border-black dark:border-neutral-800 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-left w-full mb-8">
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed font-mono">
                An AI system that analyzes your real performance data and generates engineering actions. Powered by LLM-based diagnostics trained on performance patterns.
              </p>
            </motion.div>
            
            <motion.div variants={staggerContainer} className="space-y-4 border-l-4 border-black dark:border-white pl-6">
              <motion.div variants={fadeInUp} className="flex gap-4 items-start">
                <BrainCircuit className="h-6 w-6 text-emerald-500 shrink-0 mt-1" />
                <div>
                  <h5 className="font-black text-lg uppercase tracking-tight font-oswald text-black dark:text-white mb-2">It identifies:</h5>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-mono">
                    <span className="text-rose-500">×</span> slow routes <br/>
                    <span className="text-rose-500">×</span> render bottlenecks <br/>
                    <span className="text-amber-500">!</span> network delays <br/>
                    <span className="text-amber-500">!</span> frontend inefficiencies
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <div 
            className="w-full lg:max-w-xl bg-neutral-950 dark:bg-black border-4 border-black dark:border-neutral-800 p-8 rounded-none text-left shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] dark:shadow-[16px_16px_0px_0px_rgba(255,255,255,1)] transition-transform duration-300 relative overflow-hidden"
          >
            <div className="flex items-center justify-between border-b-2 border-neutral-800 pb-4 mb-6">
              <span className="text-xs font-black font-mono text-emerald-500 tracking-widest uppercase flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Live AI Diagnostic Stream
              </span>
            </div>
            
            <div className="font-mono text-sm text-emerald-400 leading-loose space-y-3">
              <div>
                <span className="text-neutral-500 mr-2">{'>'}</span> Analyzing path <span className="text-white">/checkout</span>...
              </div>
              <div>
                <span className="text-rose-500 font-bold mr-2">[WARN]</span> JS payload exceeded budget (1.2MB).
              </div>
              <div className="pl-4 border-l-2 border-neutral-800 mt-2 text-neutral-300">
                Action: <span className="text-white bg-black px-1 border border-neutral-700">Enable edge caching.</span>
              </div>
              <div className="pl-4 border-l-2 border-neutral-800 text-neutral-300">
                Action: <span className="text-white bg-black px-1 border border-neutral-700">Reduce JS bundle size via code splitting.</span>
              </div>
              <div className="pl-4 border-l-2 border-neutral-800 text-neutral-300">
                Action: <span className="text-white bg-black px-1 border border-neutral-700">Compress assets using Brotli.</span>
              </div>
              <div className="text-emerald-500 mt-4 flex items-center">
                System awaiting input <span className="w-2 h-4 bg-emerald-500 ml-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer / Positioning */}
      <footer className="w-full py-12 text-center text-[10px] text-neutral-400 dark:text-neutral-600 font-mono uppercase tracking-widest border-t border-neutral-100 dark:border-neutral-900 z-10 bg-white dark:bg-black">
        Apex Insights is not analytics. It is real-time engineering intelligence.
      </footer>
    </div>
  );
}
