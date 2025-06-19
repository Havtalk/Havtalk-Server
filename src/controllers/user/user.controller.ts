import {getFavoritesService,toggleFavoritesService, updateDetailsService,getUserDetailsService,addUserDetailsService, updateUserAvatarService} from '../../services/user.service';
import { Request, Response } from 'express';
import { ApiError } from '../../utils/ApiError';
import { asyncHandler } from '../../utils/asyncHandler';
import { auth } from '../../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { uploadOnCloudinary } from '../../lib/cloudinary';

export const toggleFavourite=asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
        
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    const { characterId } = req.body;
    if (!characterId) {
        throw new ApiError(400, 'Character ID is required');
    }
    const result = await toggleFavoritesService(session.user.id, characterId);
    return res.status(200).json(result);
});

export const getFavorites = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
        
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    const result = await getFavoritesService(session.user.id);
    return res.status(200).json(result);
});

export const getUserDetails = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
        
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    const result = await getUserDetailsService(session.user.id);
    return res.status(200).json(result);
});

export const addUserDetails= asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    const { bio, personality } = req.body;

    const userDetails = await addUserDetailsService(session.user.id, bio, personality);
    return res.status(201).json(userDetails);
});

export const updateDetails = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
        
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    const { bio, personality } = req.body;
    
    // Check if at least one field is provided
    if (bio === undefined && personality === undefined) {
        throw new ApiError(400, 'At least one of Bio or Personality is required');
    }
    
    const result = await updateDetailsService(session.user.id, bio, personality);
    return res.status(200).json(result);
});

export const updateUserAvatar = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
    if(!session){
        throw new ApiError(401, 'Unauthorized');
    }
        
    if (!session?.user?.id) {
        throw new ApiError(401, 'Unauthorized');
    }
    if (!req.file) {
        throw new ApiError(400, 'Avatar file is required');
    }

    const file = req.file.path;
    if (!file) {
        throw new ApiError(400, 'File path is required');
    }
    const avatarUrl = await uploadOnCloudinary(file, session.user.id, "avatar");
    if (!avatarUrl) {
        throw new ApiError(500, 'Failed to upload avatar');
    }
    const result = await updateUserAvatarService(session.user.id, avatarUrl.secure_url);
    if (!result) {
        throw new ApiError(500, 'Failed to update user avatar');
    }
    return res.status(200).json(result);
});