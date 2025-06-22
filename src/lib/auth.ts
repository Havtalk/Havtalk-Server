import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, username ,bearer, admin} from "better-auth/plugins";
import prisma from "./prisma";
import { addUserDetailsService,addUserDetailServiceGoogle } from "../services/user.service";
import { sendResetPasswordEmail } from "../utils/sendResetPasswordEmail";
 
 
export const auth = betterAuth({
    
    database: prismaAdapter(prisma, {
        provider: "postgresql",

    }),
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if(ctx.path.startsWith("/sign-up")){
                const newSession = ctx.context.newSession;
                if(newSession){
                    await addUserDetailsService(newSession.user.id);
                    console.log("New user details added for user:", newSession.user.id);
                }
            }
            if(ctx.path.startsWith("/callback")){
                const provider=ctx.params.id;
                const newSession = ctx.context.newSession;
                console.log(ctx.params);
                console.log("Provider:", provider);
                if(newSession && provider === "google"){
                    console.log("New Google user details added for user:", newSession.user.id);
                    const res=await addUserDetailServiceGoogle(newSession.user.id);
                    if(res.success){
                        console.log("User details added successfully for Google user:", newSession.user.id);
                    } else {
                        console.error("Error adding user details for Google user:", res.message);
                    }
                }
        }
        }),
        
    },
    emailAndPassword: {  
        enabled: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await sendResetPasswordEmail(user.email, url);
        },
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

