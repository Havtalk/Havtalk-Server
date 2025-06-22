import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth";
import { ApiError } from "../utils/ApiError";
import { asyncHandler} from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { addGuestSession, getGuestSession, incrementGuestSessionCount } from "../services/guest.service";
import ms from "ms";

export const validateGuestUser=asyncHandler(async(req,res,next)=>{
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        if (session?.user?.id) {
            return next();
        }
        const token=req.cookies?.guestSessionToken|| req.header("Authorization")?.replace("Bearer","").trim();
        if(!token){
            console.log("No");
            const session=await addGuestSession();
            res.cookie("guestSessionToken",session.token,{
                maxAge:ms(process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue || "7d"),
                httpOnly: true,
            })
            return next();
        }
    
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        } catch (error) {
            console.error("Invalid guest session token:", error);
            const session=await addGuestSession();
            res.cookie("guestSessionToken",session.token,{
                maxAge:ms(process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue || "7d"),
                httpOnly: true,
            })
            return next();
        }
        const sessionId = typeof decodedToken === "object" && decodedToken !== null && "sessionId" in decodedToken
            ? (decodedToken as jwt.JwtPayload).sessionId
            : undefined;
        if (!sessionId) {
            console.log("No sessionId found in decoded token");
            const session=await addGuestSession();
            res.cookie("guestSessionToken",session.token,{
                maxAge:ms(process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue || "7d"),
                httpOnly: true,
            })
            return next();
        }
        const guestSession = await getGuestSession(sessionId as string);
        if (!guestSession) {
            console.log("No guest session found for sessionId:", sessionId);
            const session=await addGuestSession();
            res.cookie("guestSessionToken",session.token,{
                maxAge:ms(process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue || "7d"),
                httpOnly: true,
            })
            return next();
        }
        await incrementGuestSessionCount(sessionId as string);
        if(guestSession.messageCount >= parseInt(process.env.GUEST_SESSION_MAX_MESSAGES || "5")){
            throw new ApiError(403, "Guest session message limit reached");
        }
        
        next();
    }
);