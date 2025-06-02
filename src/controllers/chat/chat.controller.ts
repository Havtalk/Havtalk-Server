import { Request, Response } from "express";
import { getChats, getChatsfromCharacter, getChatDetails, startChat, addMessage, deleteChatSession, resetChatSession , updatePersonaInChat} from "../../services/chat.service";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { asyncHandler } from "../../utils/asyncHandler";
import { MessageRole } from "../../../generated/prisma";
import { createSystemPrompt, generateResponse, generateStreamingResponse } from "../../services/llm.service";
import { Content, Part } from "@google/generative-ai";

export const getAllUserChats = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chats = await getChats(session.user.id);
        return res.status(200).json({ message: 'Chat sessions retrieved successfully', chats });
    } catch (error: any) {
        console.error("Error getting chat sessions:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const getChatsWithCharacter = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const characterId = req.params.characterId;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const chats = await getChatsfromCharacter(session.user.id, characterId);
        return res.status(200).json({ message: 'Character chat sessions retrieved successfully', chats });
    } catch (error: any) {
        console.error("Error getting character chat sessions:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const getSingleChatDetails = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        
        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        const chat = await getChatDetails(session.user.id, chatId);
        return res.status(200).json({ message: 'Chat details retrieved successfully', chat });
    } catch (error: any) {
        console.error("Error getting chat details:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const createChatSession = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { characterId ,userpersonaId } = req.body;

        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const chat = await startChat(session.user.id, characterId, userpersonaId);
        if (!chat) {
            return res.status(500).json({ error: 'Failed to create chat session' });
        }
        return res.status(201).json({ message: 'Chat session created successfully', chat });
    } catch (error: any) {
        console.error("Error creating chat session:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const updatePersonaInChatSession = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        const { userpersonaId } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }
        if (!userpersonaId) {
            return res.status(400).json({ error: 'User persona ID is required' });
        }
        const updatedChat = await updatePersonaInChat(chatId, userpersonaId);
        if (!updatedChat) {
            return res.status(500).json({ error: 'Failed to update persona in chat session' });
        }
    } catch (error: any) {
        console.error("Error updating persona in chat session:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        const { message, role } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        if (!role || !Object.values(MessageRole).includes(role as MessageRole)) {
            return res.status(400).json({ error: 'Valid role is required' });
        }
        const messageResponse = await addMessage(role as MessageRole, chatId, message);
        if (!messageResponse) {
            return res.status(500).json({ error: 'Failed to add message to chat session' });
        }
        const chatDetails=await getChatDetails(session.user.id, chatId);
        const history= chatDetails.messages.map((message) => {
            return {
                role: message.role=== MessageRole.USER ? MessageRole.USER.toLowerCase() : 'model',
                parts: [{text:message.content}]
            };
        });
        const systemPrompt=createSystemPrompt(chatDetails.character,session.user.name,chatDetails.userpersona,chatDetails.environment!);
        const aiResponse = await generateResponse(message, history, systemPrompt);
        
        if (!aiResponse) {
            return res.status(500).json({ error: 'Failed to generate AI response' });
        }
        const aiMessageResponse = await addMessage(MessageRole.AI, chatId, aiResponse);
        if (!aiMessageResponse) {
            return res.status(500).json({ error: 'Failed to add AI message to chat session' });
        }

        
        return res.status(201).json({ message: 'Message sent successfully and Response generated succesfully', aiResponse });
    } catch (error: any) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const sendMessageStream = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        
        // Always use body for POST requests
        const { message, role } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        if (!message) {
            return res.status(400).json({ error: 'Message content is required' });
        }

        if (!role || !Object.values(MessageRole).includes(role as MessageRole)) {
            return res.status(400).json({ error: 'Valid role is required' });
        }

        // Add user message to database
        const messageResponse = await addMessage(role as MessageRole, chatId, message);
        if (!messageResponse) {
            return res.status(500).json({ error: 'Failed to add message to chat session' });
        }

        // Get chat details and prepare for streaming
        const chatDetails = await getChatDetails(session.user.id, chatId);
        const history = chatDetails.messages.map((message) => {
            return {
                role: message.role === MessageRole.USER ? MessageRole.USER.toLowerCase() : 'model',
                parts: [{text: message.content}]
            };
        });
        const systemPrompt = createSystemPrompt(chatDetails.character, session.user.name, chatDetails.userpersona, chatDetails.environment!);

        // Set up SSE headers with proper CORS settings
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // Allow credentials (cookies)
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
                
                // Send chunk to client
                res.write(`data: ${JSON.stringify({ 
                    type: 'chunk', 
                    content: chunkText,
                    timestamp: new Date().toISOString()
                })}\n\n`);
            }

            // Save complete AI response to database
            const aiMessageResponse = await addMessage(MessageRole.AI, chatId, fullResponse);
            if (!aiMessageResponse) {
                res.write(`data: ${JSON.stringify({ 
                    type: 'error', 
                    content: 'Failed to save AI message' 
                })}\n\n`);
            }

            // Send completion signal
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

export const deleteChat = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        
        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        await deleteChatSession(session.user.id, chatId);
        return res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting chat session:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const resetChat = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        
        if (!chatId) {
            return res.status(400).json({ error: 'Chat ID is required' });
        }

        await resetChatSession(session.user.id, chatId);
        return res.status(200).json({ message: 'Chat session reset successfully' });
    }
    catch (error: any) {
        console.error("Error resetting chat session:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});


export const streamConnection = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chatId = req.params.id;
        
        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        
        // CORS headers
        const origin = req.headers.origin;
        if (origin) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        } else {
            res.setHeader('Access-Control-Allow-Origin', '*');
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        // Keep connection open
        req.on('close', () => {
            res.end();
        });
    } catch (error: any) {
        console.error("Error in stream connection:", error);
        if (!res.headersSent) {
            return res.status(500).json({ error: error.message || 'Something went wrong' });
        }
    }
});
