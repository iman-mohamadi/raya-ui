// server/api/analytics/track.ts
import { db } from '../../utils/db'
import { componentStats } from '../../db/schema'
import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const name = body.name

    // Validation
    if (!name) throw createError({ statusCode: 400, message: 'Name is required' })

    // Cookie Logic (Optional - paste your cookie check here if you want it)

    // DATABASE OPERATION
    const result = await db.insert(componentStats)
        .values({
            name: name,
            downloads: 1,
            // 🟢 FIX 1: Explicitly set the date for new rows
            updatedAt: new Date()
        })
        .onConflictDoUpdate({
            target: componentStats.name,
            set: {
                downloads: sql`${componentStats.downloads} + 1`,
                updatedAt: new Date()
            }
        })
        .returning({
            count: componentStats.downloads
        })

    return { success: true, count: result[0].count }
})