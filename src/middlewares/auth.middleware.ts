import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

export const verifyJWT=async(req: Request, res: Response, next: NextFunction)=>{// we can write _ in place of res if res is not used 
    try {
        const token=req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer","");
        if(!token){
            throw new ApiError(401,"Unauthorized request");
        }
    
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!) as { userId: string };
        console.log("Decoded token:", decodedToken); // Log the decoded token for debugging
        if(!decodedToken){
            throw new ApiError(401,"Invalid Access token");
        }               
        const user=await prisma.user.findUnique({
            where:{
                id:decodedToken.userId
            },
            select:{
                id:true,
                email:true,
                username:true,
                firstName:true,
                lastName:true,
                avatar:true,
                isVerified:true
            }
        });

    
        if(!user){
            throw new ApiError(401,"Invalid Access token");
        }
    
        req.user=user;
        next();
    }catch(error: unknown) {
        const errorMessage = error instanceof Error 
            ? error.message 
            : "Invalid access Token";
        throw new ApiError(401, errorMessage);
    }

}