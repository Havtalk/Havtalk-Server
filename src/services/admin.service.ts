import prisma from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { uploadOnCloudinary } from '../lib/cloudinary';
import type { RequestStatus } from '../../generated/prisma/index'; 

const addToCharacterShowcaseService = async (userId: string, characterId: string) => {
    if (!userId) throw new ApiError(400, 'User ID is required');
    if (!characterId) throw new ApiError(400, 'Character ID is required');

    const character = await prisma.character.findUnique({
        where: { id: characterId },
    });
    if (!character) {
        throw new ApiError(404, 'Character not found');
    }

    const existingShowcase = await prisma.characterShowcase.findFirst({
        where: {
            addedBy: userId,
            characterId: characterId,
        }
    });

    if (existingShowcase) {
        return { success: true, message: 'Character already in showcase', data: existingShowcase };
    }

    const showcase = await prisma.characterShowcase.create({
        data: {
            addedBy: userId,
            characterId: characterId,
        }
    });

    return { success: true, message: 'Character added to showcase successfully', data: showcase };
}

const getCharacterShowcaseService = async () => {
    const showcase = await prisma.characterShowcase.findMany({
        include: {
            character: {
                include: {
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            username: true,
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    if (!showcase) {
        throw new ApiError(500, 'Some error occurred while fetching character showcase');
    }

    return { success: true, message: 'Character showcase retrieved successfully', data: showcase };
}

const setStatusToCharacterShowcaseService = async (showcaseId: string, status: string) => {
    if (!showcaseId) throw new ApiError(400, 'Showcase ID is required');
    const showcase = await prisma.characterShowcase.findUnique({
        where: { id: showcaseId },
    });
    if (!showcase) {
        throw new ApiError(404, 'Showcase not found');
    }
    const updatedShowcase = await prisma.characterShowcase.update({
        where: { id: showcaseId },
        data: {
            isActive:Boolean(status),
        }
    });
    if (!updatedShowcase) {
        throw new ApiError(500, 'Some error occurred while updating showcase status');
    }

    return { success: true, message: `Showcase ${Boolean(status)?'activated':'deactivated'} successfully`, data: updatedShowcase };
    
}

const deleteFromCharacterShowcaseService = async (userId: string, showcaseId: string) => {
    if (!userId) throw new ApiError(400, 'User ID is required');
    if (!showcaseId) throw new ApiError(400, 'Showcase ID is required');

    const showcase = await prisma.characterShowcase.findFirst({
        where: { id: showcaseId, addedBy: userId },
    });

    if (!showcase) {
        throw new ApiError(404, 'Showcase not found or not allowed to delete');
    }

    await prisma.characterShowcase.delete({
        where: { id: showcaseId },
    });

    return { success: true, message: 'Character removed from showcase successfully', data: null };
}

const allUserRequestsService = async () => {
    const requests = await prisma.userRequest.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                    email: true,
                    username: true
                }
            },
            character: true
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    if (!requests) {
        throw new ApiError(500, 'Some error occurred while fetching user requests');
    }

    return { success: true, message: 'User requests retrieved successfully', data: requests };
}



const updateUserRequestService = async (requestId: string, status: string, adminNote:string) => {

    if (!requestId) throw new ApiError(400, 'Request ID is required');

    const request = await prisma.userRequest.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        throw new ApiError(404, 'Request not found');
    }

    const character = await prisma.character.findUnique({
        where: { id: request.characterId },
    });

    if (!character) {
        throw new ApiError(404, 'Character not found');
    }
    if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
        throw new ApiError(400, 'Invalid status value');
    }

    const updatedRequest = await prisma.userRequest.update({
        where: { id: requestId },
        data: {
            status: status as RequestStatus,
            adminNote: adminNote || request.adminNote,
        }
    });
    if (!updatedRequest) {
        throw new ApiError(500, 'Some error occurred while updating user request');
    }
    if (status === 'APPROVED') {
        await prisma.character.update({
            where: { id: character.id },
            data: { isPublic: true }
        });
    }

    return { success: true, message: `User request ${status.toLowerCase()}  successfully`, data: updatedRequest };
}

export {
    addToCharacterShowcaseService,
    getCharacterShowcaseService,
    deleteFromCharacterShowcaseService,
    allUserRequestsService,
    updateUserRequestService,
    setStatusToCharacterShowcaseService
}