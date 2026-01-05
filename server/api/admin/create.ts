// server/api/admin/create.post.ts
import { auth } from '../../utils/auth'
import { requireAdmin } from '../../utils/guard'
import { db } from '../../utils/db'
import { user } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
    // 1. Security: Only the FOUNDER can add people
    const sessionUser = await requireAdmin(event)

    if (sessionUser.role !== 'founder') {
        throw createError({ statusCode: 403, message: "Only the Founder can add new users." })
    }

    const body = await readBody(event)

    // 2. Safety: Prevent creating another Founder
    if (body.role === 'founder') {
        throw createError({ statusCode: 400, message: "You cannot create another Founder." })
    }

    // 3. Create the user in Auth System
    // We use a transaction or just sequential awaits
    try {
        const newUserResponse = await auth.api.signUpEmail({
            body: {
                email: body.email,
                password: body.password,
                name: body.name
            }
        })

        if (!newUserResponse?.user) {
            throw createError({ statusCode: 400, message: "Failed to create user." })
        }

        // 4. FORCE UPDATE the role
        // BetterAuth might default to 'admin' or null, so we explicitly overwrite it
        await db.update(user)
            .set({ role: body.role })
            .where(eq(user.id, newUserResponse.user.id))

        return { success: true, user: newUserResponse.user }
    } catch (error) {
        throw createError({ statusCode: 400, message: error.body?.message || "Failed to create user" })
    }
})