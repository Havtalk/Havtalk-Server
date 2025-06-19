import prisma from "../lib/prisma";
import { ApiError } from "../utils/ApiError";

const toggleFavoritesService = async (userId: string, characterId: string) => {
    if (!userId) throw new Error('User ID is required');
    if (!characterId) throw new Error('Character ID is required');

    const character = await prisma.character.findUnique({
        where: { id: characterId },
    });
    if (!character) {
        throw new ApiError(404,'Character not found');
    }
    const existingFavorite = await prisma.favorites.findFirst({
        where: {
            userId: userId,
            characterId: characterId,
        }
    });
    if (existingFavorite) {
        await prisma.favorites.delete({
            where: {
                id: existingFavorite.id,
            }
        });
        return { success:true,message: 'Favorite removed successfully',data: null };
    }
    

    const favorite = await prisma.favorites.create({
        data: {
            userId: userId,
            characterId: characterId,
        }
    });

    return { success:true,message: 'Favorite added successfully',data: favorite };
}

const getFavoritesService = async (userId: string) => {
    if (!userId) throw new ApiError(400,'User ID is required');

    const favorites = await prisma.favorites.findMany({
        where: { userId: userId },
        include: {
            character: true,
        },
    });
    if(!favorites){
        throw new ApiError(500,'Some error occurred while fetching favorites');
    }

    return { success:true,message: 'Favorites retrieved successfully',data: favorites };
}
const getUserDetailsService = async (userId: string) => {
    if (!userId) throw new ApiError(400,'User ID is required');
    const userDetails = await prisma.userDetails.findUnique({
        where: { userId: userId },
        select: {
            id: true,
            bio: true,
            personality: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    username: true,
                    avatar: true,
                    image: true,
                }
            },
            userPersona:{
                select: {
                    id: true,
                    name: true,
                    avatar: true,
                }
            }
        }
    });
    if (!userDetails) {
        throw new ApiError(404,'User details not found');
    }
    return { success:true,message: 'User details retrieved successfully',data: userDetails };
}

const addUserDetailsService = async (userId: string, bio?: string, personality?: string) => {
    if (!userId) throw new ApiError(400,'User ID is required');
    const existingDetails = await prisma.userDetails.findUnique({
        where: { userId: userId },
    });
    if (existingDetails) {
        throw new ApiError(400,'User details already exist');
    }
    const userDetails = await prisma.userDetails.create({
        data: {
            userId: userId,
            bio: bio || '',
            personality: personality || '',
        },
    });
    if (!userDetails) {
        throw new ApiError(500,'Some error occurred while adding user details');
    }
    return { success:true,message: 'User details added successfully',data: userDetails };
}

const addUserDetailServiceGoogle = async (userId: string, bio?: string, personality?: string) => {
    if (!userId) throw new ApiError(400,'User ID is required');
    
    // Check if user details already exist
    const existingDetails = await prisma.userDetails.findUnique({
        where: { userId: userId },
    });
    
    if (existingDetails) {
        return { success:true, message: 'User details already exist', data: existingDetails };
    }
    
    // Create new user details
    const userDetails = await prisma.userDetails.create({
        data: {
            userId: userId,
            bio: bio || '',
            personality: personality || '',
        },
    });
    
    if (!userDetails) {
        throw new ApiError(500,'Some error occurred while adding user details');
    }
    
    return { success:true, message: 'User details added successfully', data: userDetails };
}

const updateDetailsService = async (userId: string, bio?: string, personality?:string) => {
    if (!userId) throw new ApiError(400,'User ID is required');
    
    // Only include fields that are provided in the update
    const updateData: { bio?: string; personality?: string; } = {};
    
    if (bio !== undefined) {
        updateData.bio = bio;
    }
    
    if (personality !== undefined) {
        updateData.personality = personality;
    }
    
    const user = await prisma.userDetails.update({
        where: { userId: userId },
        data: updateData,
    });
    if (!user) {
        throw new ApiError(404,'User details not found');
    }
    
    return { success:true, message: 'User details updated successfully', data: user };
}

const updateUserAvatarService = async (userId: string, avatar: string) => {
    if (!userId) throw new ApiError(400,'User ID is required');
    const user = await prisma.user.update({
        where: { id: userId },
        data: { image: avatar },
    });
    if (!user) {
        throw new ApiError(404,'User not found');
    }
    return { success:true, message: 'User avatar updated successfully', data: user };
}

export {
    toggleFavoritesService, 
    getFavoritesService,
    getUserDetailsService,
    addUserDetailsService,
    addUserDetailServiceGoogle,
    updateDetailsService,
    updateUserAvatarService
};