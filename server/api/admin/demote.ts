// server/api/admin/demote.post.ts
import { auth } from '../../utils/auth'
import { requireAdmin } from '../../utils/guard'
import { db } from '../../utils/db'
import { user } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // 1. Security: Only Founder can demote people
    const sessionUser = await requireAdmin(event)

    if (sessionUser.role !== 'founder') {
        throw createError({ statusCode: 403, message: "Only the Founder can remove admins." })
    }

    const body = await readBody(event)
    const targetUserId = body.userId

    // 2. Fetch target to ensure we don't demote another Founder (if one existed)
    const targetUser = await db
        .select()
        .from(user)
        .where(eq(user.id, targetUserId))
        .limit(1)
        .then(rows => rows[0])

    if (!targetUser) {
        throw createError({ statusCode: 404, message: "User not found" })
    }

    if (targetUser.role === 'founder') {
        throw createError({ statusCode: 400, message: "You cannot remove the Founder." })
    }

    // 3. Downgrade them to 'user'
    await db.update(user)
        .set({ role: 'user' }) // 'user' = no special access
        .where(eq(user.id, targetUserId))

    return { success: true, message: "User demoted successfully" }
})