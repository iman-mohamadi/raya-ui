// server/api/analytics/stats.ts
import { db } from '../../utils/db'
import { componentStats } from '../../db/schema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
    const stats = await db
        .select()
        .from(componentStats)
        .orderBy(desc(componentStats.downloads))

    return stats
})