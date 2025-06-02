import prisma from "../lib/prisma";


const getAllCharactersService = async (userId: string) => {
    if (!userId) throw new Error('User ID is required');
    const characters = await prisma.character.findMany({
        where: { ownerId: userId },
    });
    return characters;
}

const getAllPublicCharactersService = async () => {
    const characters = await prisma.character.findMany({
        where: { isPublic: true },
    });
    return characters;
}

const getCharacterDetailsService = async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');
    const character = await prisma.character.findFirst({
        where: { id: characterId, ownerId: userId },
    });
    if (!character) {
        throw new Error('Not allowed to access this character');
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
    isPublic?: boolean,
    tags?: string[],
    backstory?: string,
    role?: string,
    goals?: string,
    quirks?: string,
    tone?: string,
    speechStyle?: string,
    exampleDialogues?: any,
    additionalInfo?: string
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


export { getCharacterDetailsService, getAllCharactersService, addCharacterService, updateCharacterService, deleteCharacterService, getAllPublicCharactersService };