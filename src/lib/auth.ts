import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, username ,bearer, admin} from "better-auth/plugins";
import prisma from "./prisma";
 
 
export const auth = betterAuth({
    
    database: prismaAdapter(prisma, {
        provider: "postgresql",

    }),
    emailAndPassword: {  
        enabled: true,
    },
    socialProviders: { 
        google: {
            clientId: process.env.GOOGLE_AUTH_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
            mapProfileToUser(profile) {
                return {
                    email: profile.email,
                    username: profile.email.split("@")[0],
                    name: profile.name,
                    image: profile.picture,
                };
            },
        },    
    }, 
    plugins: [
        username(),
        bearer(),
        admin()

    ],
    trustedOrigins:[
        process.env.CORS_ORIGIN || "http://localhost:3000",
        // process.env.CORS_ORIGIN || "http://localhost:8080",
    ] 
});

