import prisma from "../lib/prisma";
import { MessageRole } from "../../generated/prisma";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import ms from "ms";


const addGuestSession = async () => {
   try {
    const guestSession=await prisma.guestSession.create({
        data: {}
    });
    if (!guestSession) {
        throw new ApiError(500,'Failed to create guest session');
    }
    
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const expiry = process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue;
    
    if (!secretKey) {
        throw new ApiError(500, 'ACCESS_TOKEN_SECRET is not defined');
    }
    
    const token = jwt.sign(
        { sessionId: guestSession.id },
        secretKey,
        {expiresIn: expiry || '7d'}
    );
    
    return { token, sessionId: guestSession.id };

   } catch (error) {
        console.error('Error adding guest user:', error);
        throw new Error('Failed to add guest user');
    }
}

const getGuestSession = async (sessionId: string) => {
    try {
        const guestSession = await prisma.guestSession.findUnique({
            where: { id: sessionId },
        });

        if (!guestSession) {
            throw new ApiError(404, 'Guest session not found');
        }

        return guestSession;
    } catch (error) {
        console.error('Error retrieving guest session:', error);
        throw new Error('Failed to retrieve guest session');
    }
}

const incrementGuestSessionCount = async (sessionId: string) => {
    try {
        const updatedSession = await prisma.guestSession.update({
            where: { id: sessionId },
            data: {
                messageCount: {
                    increment: 1,
                },
            },
        });

        return updatedSession;
    } catch (error) {
        console.error('Error incrementing guest session count:', error);
        throw new Error('Failed to increment guest session count');
    }
}



export {addGuestSession, getGuestSession, incrementGuestSessionCount};