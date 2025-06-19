import prisma from "../lib/prisma";

const getAllPersonasService = async (userId: string) => {
    if (!userId) throw new Error('User ID is required');
    const personas = await prisma.userPersona.findMany({
        where: { userId: userId },
    });
    return personas;
}

const createPersonaService = async (userId: string, personaName: string, description:string, personality:string, avatar?:string) => {
    if (!userId) throw new Error('User ID is required');
    if (!personaName) throw new Error('Persona name is required');
    if (!description) throw new Error('Persona description is required');

    const persona = await prisma.userPersona.create({
        data: {
            name: personaName,
            description: description,
            userId: userId,
            avatar: avatar,  
            personality:personality,   
        }
    });
    return persona;
}

const updatePersonaService = async (userId: string, personaId: string, personaName?: string, description?:string, personality?:string, avatar?:string) => {
    if (!userId) throw new Error('User ID is required');
    if (!personaId) throw new Error('Persona ID is required');

    const persona = await prisma.userPersona.findFirst({
        where: { id:personaId, userId: userId },
    });
    
    if (!persona) {
        throw new Error('Not allowed to update this persona');
    }

    const updatedPersona = await prisma.userPersona.update({
        where: { id: personaId },
        data: {
            name: personaName || persona.name,
            description: description || persona.description,
            personality: personality || persona.personality,
            avatar: avatar || persona.avatar,
        }
    });

    return updatedPersona;
}

const deletePersonaService = async (userId: string, personaId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!personaId) throw new Error('Persona ID is required');

    const persona = await prisma.userPersona.findFirst({
        where: { id:personaId, userId: userId },
    });
    
    if (!persona) {
        throw new Error('Not allowed to delete this persona');
    }

    await prisma.userPersona.delete({
        where: { id: personaId },
    });

    return true;
}

const setCurrentPersonaService = async (userId: string, personaId: string) => {
    if (!userId) throw new Error('User ID is required');
    // if (!personaId) throw new Error('Persona ID is required');
    const persona= await prisma.userDetails.update({
        where: { userId: userId },
        data: {
            currentPersonaId: personaId,
        }
    });
    if (!persona) {
        throw new Error('Some error occurred while setting current persona');
    }
    return persona;
}

export {
    getAllPersonasService,
    createPersonaService,
    updatePersonaService,
    deletePersonaService,
    setCurrentPersonaService
};



