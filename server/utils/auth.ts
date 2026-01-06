// server/utils/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";

// server/utils/auth.ts
export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema }
    }),

    baseURL: process.env.BETTER_AUTH_URL,

    trustedOrigins: [
        "https://raya-ui.com",
        "https://www.raya-ui.com",
        "http://localhost:3000"
    ],

    emailAndPassword: { enabled: true },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "admin",
                input: false
            }
        }
    }
});