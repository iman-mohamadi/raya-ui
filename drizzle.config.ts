// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './server/db/schema.ts',
    out: './server/db/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.POSTGRES_URL,
    },
})