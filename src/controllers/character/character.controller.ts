import { Request, Response } from "express";
import { 
    getAllCharactersService,
    getAllPublicCharactersService,
    getCharacterDetailsService,
    addCharacterService,
    updateCharacterService,
    deleteCharacterService
} from "../../services/character.service";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../lib/cloudinary";

export const getAllCharacters = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        if(!session){
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const characters = await getAllCharactersService(session.user.id);
        return res.status(200).json({ characters });
    } catch (error: any) {
        console.error("Error getting characters:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const getAllPublicCharacters = asyncHandler(async (req: Request, res: Response) => {
    try {
        const characters = await getAllPublicCharactersService();
        return res.status(200).json({ characters });
    } catch (error: any) {
        console.error("Error getting public characters:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const getCharacterDetails = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const characterId = req.params.id;
        
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const character = await getCharacterDetailsService(session.user.id, characterId);
        return res.status(200).json({ character });
    } catch (error: any) {
        console.error("Error getting character details:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const addCharacter = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log("Received request to add character:", req.body); 

        const { 
            name, 
            personality, 
            description, 
            environment, 
            additionalInfo, 
            avatar, 
            isPublic,
            tags,
            backstory,
            role,
            goals,
            quirks,
            tone,
            speechStyle,
            exampleDialogues
        } = req.body;

        if (!name || !personality || !description) {
            return res.status(400).json({ error: 'Name, personality, and description are required' });
        }
        if (avatar && !req.file) {
            return res.status(400).json({ error: 'Avatar file is required' });
        }
        let avatarUrl;
        if (req.file) {
            const file = req.file.path;
            if (!file) {
                return res.status(400).json({ error: 'Avatar file is required' });
            }
            avatarUrl = await uploadOnCloudinary(file, session.user.id, "characters");
            if (!avatarUrl) {
                return res.status(500).json({ error: 'Failed to upload avatar' });
            }
        } else {
            avatarUrl = null;
        }

        const character = await addCharacterService(
            session.user.id, 
            name, 
            personality, 
            description, 
            environment, 
            additionalInfo, 
            avatarUrl?.secure_url,
            Boolean(isPublic),
            tags,
            backstory,
            role,
            goals,
            quirks,
            tone,
            speechStyle,
            exampleDialogues
        );

        return res.status(201).json({ message:'Character created succesfully',character });
    } catch (error: any) {
        console.error("Error adding character:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const updateCharacter = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const characterId = req.params.id;
        
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const { 
            name, 
            personality, 
            description, 
            avatar, 
            environment, 
            isPublic,
            tags,
            backstory,
            role,
            goals,
            quirks,
            tone,
            speechStyle,
            exampleDialogues,
            additionalInfo
        } = req.body;

        let avatarUrl = avatar; // Keep existing avatar if no new file uploaded
        
        // Handle new avatar upload
        if (req.file) {
            const file = req.file.path;
            const uploadResult = await uploadOnCloudinary(file, session.user.id, "characters");
            if (!uploadResult) {
                return res.status(500).json({ error: 'Failed to upload avatar' });
            }
            avatarUrl = uploadResult.secure_url;
        }

        const character = await updateCharacterService(
            session.user.id, 
            characterId, 
            name, 
            personality, 
            description,
            avatarUrl,
            environment,
            Boolean(isPublic),
            tags,
            backstory,
            role,
            goals,
            quirks,
            tone,
            speechStyle,
            exampleDialogues,
            additionalInfo
        );

        return res.status(200).json({ character });
    } catch (error: any) {
        console.error("Error updating character:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const deleteCharacter = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const characterId = req.params.id;
        
        if (!characterId) {
            return res.status(400).json({ error: 'Character ID is required' });
        }

        const character = await deleteCharacterService(session.user.id, characterId);
        return res.status(200).json({ message: 'Character deleted successfully', character });
    } catch (error: any) {
        console.error("Error deleting character:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

