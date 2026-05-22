# Apex Insights

Apex Insights is a high-performance, real-time analytics and telemetry tracking dashboard built for minimal bloat and zero-cost local execution. It enables engineers to track and monitor user telemetry across web properties instantly using Server-Sent Events (SSE).

## Core Architecture

- **Zero-Cost Infrastructure**: Utilizes a local file-based `better-sqlite3` database (`local.db`) for tracking sites and events. Eliminates cloud dependencies, complex setup, and database hosting fees.
- **Real-Time Telemetry (SSE)**: The dashboard consumes a native Next.js Server-Sent Events stream (`/api/stream`) to render incoming traffic and user interactions with zero latency.
- **Drop-In Tracker**: A lightweight, zero-dependency `tracker.js` script allows immediate ingestion of pageviews, clicks, scroll events, and true Core Web Vitals (LCP, FID, TTFB) from any target site.
- **AI Diagnostics**: Integrates Llama-3 via Groq to analyze performance bottlenecks and provide actionable engineering recommendations dynamically.
- **Minimalist UI**: Designed with a high-density, brutalist interface optimized for technical utility and data visibility.

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Database**: better-sqlite3 (Local file storage)
- **AI Integration**: Groq SDK (Llama-3.1-8b)
- **Deployment**: Docker (Multi-stage standalone build)

## Quickstart Guide

### Prerequisites
To enable the AI Performance Auditor, create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### Option 1: Docker Deployment (Recommended)
The application is fully containerized for production deployment. The database persists automatically via a local Docker volume.
```bash
docker-compose up --build -d
```

### Option 2: Local Development
```bash
npm install
npm run dev
```

## Testing the Pipeline

1. Navigate to the **Dev Setup** tab in the dashboard (`http://localhost:3000/dashboard`).
2. Register a target site (e.g., `localhost`) to generate a tracking snippet.
3. Inject the snippet into your target HTML.
4. Navigate to the **Live Pulse** tab to watch interactions stream via SSE in real-time.

## Project Structure

- `/src/app`: Next.js App Router endpoints (Dashboard, Landing Page)
- `/src/app/api`: SQLite-backed REST ingestion (`/track`, `/sites`), SSE (`/stream`), and AI Inference (`/ai`)
- `/src/components`: UI and Dashboard components
- `/src/lib`: Database connection and schema definitions (`db.ts`)
- `/public/tracker.js`: Lightweight telemetry client script
