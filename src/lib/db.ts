import Database from 'better-sqlite3';
import path from 'path';

// Define the database path (use a local file in the project root or from env)
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'local.db');

/**
 * Initialize the database connection.
 * Note: better-sqlite3 is fully synchronous. Since Node.js is single-threaded,
 * this actually provides incredible performance for local reads/writes without
 * the overhead of connection pooling or async serialization.
 */
const db = new Database(dbPath, { verbose: console.log });

/**
 * Enable Write-Ahead Logging (WAL) mode.
 * Architectural Decision: WAL mode allows concurrent readers and writers, 
 * which is absolutely critical for our telemetry ingestion pipeline to prevent 
 * database locking during high-throughput tracking events.
 */
db.pragma('journal_mode = WAL');

// Initialize the schema
const initDb = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      site_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      visitor_id TEXT NOT NULL,
      path TEXT NOT NULL,
      details TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(site_id) REFERENCES sites(id)
    );

    CREATE INDEX IF NOT EXISTS idx_events_site_id ON events(site_id);
    CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
  `);
};

// Run schema initialization
initDb();

export default db;
