import prisma from "../lib/prisma";
import { RequestStatus } from '../../generated/prisma/index'; 



const getAllCharactersService = async (userId: string) => {
    if (!userId) throw new Error('User ID is required');
    const characters = await prisma.character.findMany({
        where: { ownerId: userId },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            }
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return characters;
}

const getAllPublicCharactersService = async () => {
    const characters = await prisma.character.findMany({
        where: { isPublic: true },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                },
            }
        },
        orderBy: {
            updatedAt:'desc'
        },
    });
    return characters;
}

const getCharacterDetailsService = async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');
    console.log('Fetching character details for user:', userId, 'characterId:', characterId);
    const character = await prisma.character.findFirst({
        where: { id: characterId },
    });
    if (!character) {
        throw new Error('Character not found');
    }
    if (!character.isPublic&&character.ownerId != userId) {
        throw new Error('Not allowed to access this character');
    }
    
    // Ensure exampleDialogues is properly formatted
    if (character.exampleDialogues) {
        try {
            // If it's already a parsed object, leave it as is
            if (typeof character.exampleDialogues === 'object') {
                // No need to do anything
            } 
            // If it's a string for some reason, parse it (shouldn't happen with Prisma, but just in case)
            else if (typeof character.exampleDialogues === 'string') {
                character.exampleDialogues = JSON.parse(character.exampleDialogues);
            }
        } catch (error) {
            console.error('Error parsing exampleDialogues:', error);
            character.exampleDialogues = []; // Fallback to empty array if parsing fails
        }
    } else {
        character.exampleDialogues = []; // Set to empty array if null/undefined
    }
    
    return character;
}

const addCharacterService = async (
    userId: string, 
    characterName: string, 
    personality: string, 
    description: string,
    environment?: string, 
    additionalInfo?: string, 
    avatar?: string, 
    isPublic?: boolean,
    tags?: string[],
    backstory?: string,
    role?: string,
    goals?: string,
    quirks?: string,
    tone?: string,
    speechStyle?: string,
    exampleDialogues?: any
) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterName) throw new Error('Character name is required');
    if (!personality) throw new Error('Character type is required');

    const character = await prisma.character.create({
        data: {
            name: characterName,
            personality: personality,
            ownerId: userId,
            description: description,
            environment: environment,
            additionalInfo: additionalInfo,
            avatar: avatar,
            isPublic: isPublic,
            tags: tags,
            backstory: backstory,
            role: role,
            goals: goals,
            quirks: quirks,
            tone: tone,
            speechStyle: speechStyle,
            exampleDialogues: exampleDialogues,
        }
    });
    return character;
}

const updateCharacterService = async (
    userId: string, 
    characterId: string, 
    characterName?: string, 
    personality?: string, 
    description?: string,
    avatar?: string, 
    environment?: string, 
    tags?: string[],
    backstory?: string,
    role?: string,
    goals?: string,
    quirks?: string,
    tone?: string,
    speechStyle?: string,
    exampleDialogues?: any,
    additionalInfo?: string,
    isPublic?: boolean,
) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');

    const character = await prisma.character.findFirst({
        where: { id:characterId, ownerId: userId },
    });
    
    if (!character) {
        throw new Error('Not allowed to update this character');
    };
    
    const updated = await prisma.character.update({
        where: { id:characterId },
        data: { 
            name: characterName, 
            personality, 
            description: description, 
            avatar: avatar, 
            environment: environment, 
            isPublic: isPublic,
            tags: tags,
            backstory: backstory,
            role: role,
            goals: goals,
            quirks: quirks,
            tone: tone,
            speechStyle: speechStyle,
            exampleDialogues: exampleDialogues,
            additionalInfo: additionalInfo
        },
    });
    return updated;
}

const deleteCharacterService = async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');

    const character = await prisma.character.findFirst({
        where: { id:characterId, ownerId: userId },
    });
    
    if (!character) {
        throw new Error('Not allowed to delete this character');
    };
    
    const deleted = await prisma.character.delete({
        where: { id:characterId },
    });
    return deleted;
}

const addCharacterPublicRequestService = async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');
    const character = await prisma.character.findFirst({
        where: { id: characterId, ownerId: userId },
    });
    if (!character) {
        throw new Error('No character found with this ID');
    }
    if (character.isPublic) {
        return { success: false, message: 'Character is already public', data: null};
    }
    const existingRequest =await prisma.userRequest.findFirst({
        where: {
            userId: userId,
            characterId: characterId,
            status: RequestStatus.PENDING|| RequestStatus.APPROVED,
        }
    });
    if (existingRequest&& existingRequest.status === RequestStatus.PENDING) {
        return { success: false, message: 'You have already requested this character to be public and it is pending approval', data: existingRequest};
    }
    if (existingRequest && existingRequest.status === RequestStatus.APPROVED) {
        return { success: false, message: 'You have already requested this character to be public and it is approved', data: existingRequest };
    }
    const request = await prisma.userRequest.create({
        data: {
            userId: userId,
            characterId: characterId,
            status: RequestStatus.PENDING,
        }
    });
    if (!request) {
        throw new Error('Failed to create user request');
    }
    return {success:true, data:request, message: 'Request created successfully'};
}

const getUserCharacterPublicRequestsService = async (userId: string) => {
    if (!userId) throw new Error('User ID is required');
    const requests = await prisma.userRequest.findMany({
        where: { userId: userId},
        include: {
            character: {
                select: {
                    id: true,
                    name: true,
                    personality: true,
                    avatar: true,
                }
            },    
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return requests;
}


export { getCharacterDetailsService, getAllCharactersService, addCharacterService, updateCharacterService, deleteCharacterService, getAllPublicCharactersService, addCharacterPublicRequestService, getUserCharacterPublicRequestsService };