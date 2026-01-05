import { db } from '../../utils/db'
import { user } from '../../db/schema'
import { desc, sql } from 'drizzle-orm'
import { requireAdmin } from '../../utils/guard'

export default defineEventHandler(async (event) => {
    await requireAdmin(event)

    const users = await db
        .select()
        .from(user)
        .orderBy(
            sql`CASE 
                WHEN ${user.role} = 'founder' THEN 1 
                WHEN ${user.role} = 'admin' THEN 2 
                WHEN ${user.role} = 'moderator' THEN 3 
                ELSE 4 
            END ASC`,
            desc(user.createdAt)
        )

    return users
})