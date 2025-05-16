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

        const { name, personality, description, environment, additionalInfo, avatar, isPublic } = req.body;

        if (!name || !personality || !description) {
            return res.status(400).json({ error: 'Name, personality, and description are required' });
        }

        const character = await addCharacterService(
            session.user.id, 
            name, 
            personality, 
            description, 
            environment, 
            additionalInfo, 
            avatar,
            isPublic
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

        const { name, personality, description, avatar, environment, isPublic } = req.body;

        const character = await updateCharacterService(
            session.user.id, 
            characterId, 
            name, 
            personality, 
            description,
            avatar,
            environment,
            isPublic
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

