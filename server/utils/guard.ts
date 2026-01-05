// server/utils/guard.ts
import { auth } from './auth'

export const requireAdmin = async (event: any) => {
    const session = await auth.api.getSession({
        headers: event.headers
    })

    if (!session) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Unauthorized: You must be logged in.'
        })
    }

    return session.user
}