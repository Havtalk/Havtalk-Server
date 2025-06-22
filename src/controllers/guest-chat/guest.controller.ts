import { Request, Response } from "express";
import { addGuestSession } from "../../services/guest.service";
import { asyncHandler } from "../../utils/asyncHandler";
import ms from "ms";
import { createSystemPrompt, generateStreamingResponse } from "../../services/llm.service";
import { MessageRole } from "../../../generated/prisma";
import { getCharacterDetailsService } from "../../services/character.service";

export const addGuestUser = asyncHandler(async (req: Request, res: Response) => {
    const guestSession = await addGuestSession();
    res.status(200).cookie("guestSessionToken",guestSession.token,{
        maxAge:ms(process.env.ACCESS_TOKEN_EXPIRY as ms.StringValue || "7d"),
        httpOnly: true,
    }).json({
        message: "Guest user created successfully",
        sessionId: guestSession.sessionId,
        token: guestSession.token,
    });
});

export const getPublicCharacterDetails = asyncHandler(async (req: Request, res: Response) => {
    try {
        console.log("Received request to get character details for ID:", req.params.id);
        const characterId = req.params.id;
        
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const character = await getCharacterDetailsService("guest", characterId);
        return res.status(200).json({ character });
    } catch (error: any) {
        console.error("Error getting character details:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const sendGuestMessageStream = asyncHandler(async (req: Request, res: Response) => {
    try {

        const characterId = req.params.characterId;
        
        const { message, role, history } = req.body;

        if (!characterId) {
            return res.status(400).json({ error: 'CharacterId is required' });
        }

        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        const character= await getCharacterDetailsService('guest',characterId);
        

        const systemPrompt = createSystemPrompt(character,"guest");

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        const origin = req.headers.origin;
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        let fullResponse = '';

        try {
            const stream = await generateStreamingResponse(message, history, systemPrompt);
            
            for await (const chunk of stream) {
                const chunkText = chunk.text();
                fullResponse += chunkText;
                
                res.write(`data: ${JSON.stringify({ 
                    type: 'chunk', 
                    content: chunkText,
                    timestamp: new Date().toISOString()
                })}\n\n`);
            }

            res.write(`data: ${JSON.stringify({ 
                type: 'complete', 
                fullResponse: fullResponse,
                timestamp: new Date().toISOString()
            })}\n\n`);

        } catch (streamError) {
            console.error("Streaming error:", streamError);
            res.write(`data: ${JSON.stringify({ 
                type: 'error', 
                content: 'Failed to generate AI response' 
            })}\n\n`);
        }

        res.end();

    } catch (error: any) {
        console.error("Error in streaming message:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message || 'Something went wrong' });
        }
    }
});