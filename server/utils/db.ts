// server/utils/db.ts
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// 1. Create a "Stateless" HTTP connection
// This sends one standard HTTPS request per query,
// which is much harder for the Firewall to block than a WebSocket.
const sql = neon(process.env.POSTGRES_URL!)

// 2. Initialize Drizzle
export const db = drizzle(sql)