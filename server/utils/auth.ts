// server/utils/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import * as schema from "../db/schema";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...schema }
    }),
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