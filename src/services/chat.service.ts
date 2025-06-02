import prisma from "../lib/prisma";
import { MessageRole } from "../../generated/prisma";

const getChats = async (userId: string) => {
    if (!userId) throw new Error('User ID is required');
    const chats = await prisma.chatSession.findMany({
        where: { userId: userId },
        include: {
            character: true,
            userpersona: true, // Include the persona if there is one
        }
    });
    return chats;
}

const getChatsfromCharacter=async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');
    const chats = await prisma.chatSession.findMany({
        where: { userId: userId, characterId: characterId },
    });
    return chats;
}

const getChatDetails = async (userId: string, chatId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!chatId) throw new Error('Chat ID is required');
    const chat = await prisma.chatSession.findFirst({
        where: { id: chatId, userId: userId },
        include: {
            messages: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
            character: true,
            userpersona: true, // Include the persona if there is one
        }
    });
    if (!chat) {
        throw new Error('Not allowed to access this chat session');
    }
    return chat;
}

const startChat = async (userId: string, characterId: string, userPersonaId?: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');
    
    const chat = await prisma.chatSession.create({
        data: {
            userId: userId,
            characterId: characterId,
            // Only include userPersonaId if it's provided
            ...(userPersonaId ? { userpersonaId:userPersonaId } : {})
        }
    });
    return chat;
}

const addMessage=async (role: MessageRole, chatId: string, message: string) => {
    if (!role) throw new Error('Role is required');
    if (!chatId) throw new Error('Chat ID is required');
    if (!message) throw new Error('Message is required');
    const chat = await prisma.chatSession.findFirst({
        where: { id: chatId },
    });
    
    if (!chat) {
        throw new Error('Not allowed to add message to this chat session');
    }
    const updated = await prisma.chatMessage.create({
        data: {
            sessionId: chatId,
            role: role,
            content: message,    
        }
    });
    if (!updated) {
        throw new Error('Failed to add message to chat session');
    }
    return updated;
}

const deleteChatSession=async (userId: string, chatId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!chatId) throw new Error('Chat ID is required');
    const chat = await prisma.chatSession.findFirst({
        where: { id: chatId, userId: userId },
    });
    if (!chat) {
        throw new Error('Not allowed to delete this chat session');
    }
    const deleted = await prisma.chatSession.delete({
        where: { id: chatId },
    });
    return deleted;
}

const resetChatSession = async (userId: string, chatId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!chatId) throw new Error('Chat ID is required');
    const chat = await prisma.chatSession.findFirst({
        where: { id: chatId, userId: userId },
    });
    if (!chat) {
        throw new Error('Not allowed to reset this chat session');
    }
    const reset = await prisma.chatMessage.deleteMany({
        where: { sessionId: chatId },
    });
    if (!reset) {
        throw new Error('Failed to reset chat session');
    }
    return reset;
}

const updatePersonaInChat = async (chatId: string, userPersonaId: string) => {
    if (!chatId) throw new Error('Chat ID is required');
    if (!userPersonaId) throw new Error('User Persona ID is required');
    const chat = await prisma.chatSession.findFirst({
        where: { id: chatId },
    });
    if (!chat) {
        throw new Error('Not allowed to update persona in this chat session');
    }
    const updated = await prisma.chatSession.update({
        where: { id: chatId },
        data: {
            userpersonaId: userPersonaId,
        }
    });
    if (!updated) {
        throw new Error('Failed to update persona in chat session');
    }
    return updated;
}

export {getChats, getChatsfromCharacter, getChatDetails, startChat, addMessage, deleteChatSession, resetChatSession, updatePersonaInChat};