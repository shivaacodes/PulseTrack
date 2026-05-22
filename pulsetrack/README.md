# Apex Insights

Apex Insights is a high-performance, real-time analytics and telemetry tracking dashboard built for absolute minimal bloat and zero-cost local execution. 

Designed with a premium "square boxed" brutalist UI, it allows developers to track and monitor user telemetry across web properties instantly using Server-Sent Events (SSE).

## 🚀 Key Features

*   **Zero-Cost Architecture:** Uses a local file-based `better-sqlite3` database (`local.db`) for tracking all sites and events. No cloud dependencies, no setup, no database hosting fees.
*   **Real-time Telemetry (SSE):** The Live Pulse dashboard consumes a native Next.js Server-Sent Events stream (`/api/stream`) to render incoming traffic and user events instantly.
*   **Drop-in Tracker:** A tiny, zero-dependency `tracker.js` script allows immediate ingestion of `pageview`, `click`, and `scroll` events from any target site.
*   **Zero Bloat:** Stripped of unnecessary authentication wrappers, heavy dependencies, dummy simulator intervals, and over-engineered UI components.
*   **Dark Mode Native:** Tailwind-powered responsive, square-boxed aesthetic optimized for maximum data density.

## 🛠 Tech Stack

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Database:** `better-sqlite3` (Local file storage)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Toast Notifications:** [Sonner](https://sonner.emilkowal.ski/)

## 🏎 Quickstart Guide

1.  **Install Dependencies**
    ```bash
    npm install
    ```
    
2.  **Add your Groq API Key**
    To enable the AI Performance Auditor, create a `.env.local` file in the root directory:
    ```env
    GROQ_API_KEY=your_groq_api_key_here
    ```
    *(You can get a free key from [console.groq.com](https://console.groq.com/))*

3.  **Run the Application**
    ```bash
    npm run dev
    ```
    
4.  **Test the Pipeline**
    *   Navigate to the **Dev Setup** tab in the dashboard.
    *   Register a target site (e.g., `localhost`) to generate a snippet.
    *   Inject the snippet into your target HTML.
    *   Navigate to the **Live Pulse** tab and watch your interactions stream in via SSE in real-time.

## 📂 Project Structure

*   `/src/app`: Next.js App Router endpoints (Dashboard, Landing Page)
*   `/src/app/api`: SQLite-backed REST ingestion (`/track`, `/sites`) and SSE (`/stream`)
*   `/src/components`: Clean UI and Dashboard components
*   `/src/lib`: Database schema execution (`db.ts`)
*   `/public/tracker.js`: The lightweight telemetry client script

---
*Built for e-commerce conversion validation and high-performance telemetry.*
