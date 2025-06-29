import { Request, Response } from "express";
import { 
    getAllCharactersService,
    getAllPublicCharactersService,
    getCharacterDetailsService,
    addCharacterService,
    updateCharacterService,
    deleteCharacterService,
    addCharacterPublicRequestService,
    getUserCharacterPublicRequestsService
} from "../../services/character.service";
import { auth } from "../../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadOnCloudinary } from "../../lib/cloudinary";
import { getCharacterShowcaseService } from "../../services/admin.service";

export const getPublicCharacterShowcase = asyncHandler(async (req: Request, res: Response) => {
    try {
        console.log("Received request to get character showcase");
        // const session = await auth.api.getSession({
        //     headers:fromNodeHeaders(req.headers),
        // });
        // if (!session) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        // if (!session?.user?.id) {
        //     return res.status(401).json({ error: 'Unauthorized' });
        // }
        const result = await getCharacterShowcaseService();
        if (!result) {
            return res.status(500).json({ error: 'Failed to fetch character showcase' });
        }
        return res.status(200).json(result);
    } catch (error: any) {
        console.error("Error getting character showcase:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });    
    }
});

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
        console.log("Received request to get character details for ID:", req.params.id);
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
        const isAdmin = session.user.role === 'admin';
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

        let tagsArray: string[] = [];
        if (typeof tags === "string") {
            tagsArray = tags
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0);
        } else if (Array.isArray(tags)) {
            tagsArray = tags;
        }

        let exampleDialoguesValue: any = undefined;
        if (typeof exampleDialogues === "string" && exampleDialogues.trim() !== "") {
            try {
                const parsed = JSON.parse(exampleDialogues);
                if (Array.isArray(parsed)) {
                    exampleDialoguesValue = parsed;
                }
            } catch {
                // ignore, keep undefined
            }
        } else if (Array.isArray(exampleDialogues)) {
            exampleDialoguesValue = exampleDialogues;
        }

        if(!isAdmin) {
            const character = await addCharacterService(
                session.user.id, 
                name, 
                personality, 
                description, 
                environment, 
                additionalInfo, 
                avatarUrl?.secure_url,
                false,
                tagsArray,
                backstory,
                role,
                goals,
                quirks,
                tone,
                speechStyle,
                exampleDialoguesValue
            );
            if (!character) {
                return res.status(500).json({ error: 'Failed to create character' });
            }
            const publicRequest = await addCharacterPublicRequestService(
                session.user.id,
                character.id,
            );
            if (!publicRequest) {
                return res.status(500).json({ error: 'Failed to create public request' });
            }
            return res.status(201).json({ message:'Character created succesfully and character public request ',character,approvalRequest: publicRequest });
        }else{
            const character = await addCharacterService(
                session.user.id, 
                name, 
                personality, 
                description, 
                environment, 
                additionalInfo, 
                avatarUrl?.secure_url,
                Boolean(isPublic),
                tagsArray,
                backstory,
                role,
                goals,
                quirks,
                tone,
                speechStyle,
                exampleDialoguesValue
            );
            if (!character) {
                return res.status(500).json({ error: 'Failed to create character' });
            }
            return res.status(201).json({ message:'Character created succesfully',character });
        }
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
        
        const isAdmin = session.user.role === 'admin';

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
        let tagsArray: string[] = [];
        if (typeof tags === "string") {
            tagsArray = tags
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0);
        } else if (Array.isArray(tags)) {
            tagsArray = tags;
        }

        let exampleDialoguesValue: any = undefined;
        if (typeof exampleDialogues === "string" && exampleDialogues.trim() !== "") {
            try {
                const parsed = JSON.parse(exampleDialogues);
                if (Array.isArray(parsed)) {
                    exampleDialoguesValue = parsed;
                }
            } catch {
                // ignore, keep undefined
            }
        } else if (Array.isArray(exampleDialogues)) {
            exampleDialoguesValue = exampleDialogues;
        }

        let avatarUrl = avatar; 
        
        if (req.file) {
            const file = req.file.path;
            const uploadResult = await uploadOnCloudinary(file, session.user.id, "characters");
            if (!uploadResult) {
                return res.status(500).json({ error: 'Failed to upload avatar' });
            }
            avatarUrl = uploadResult.secure_url;
        }

        if(!isAdmin) {
            // If user is trying to make character public, create a public request
            if (isPublic) {
                const character = await updateCharacterService(
                    session.user.id, 
                    characterId, 
                    name, 
                    personality, 
                    description,
                    avatarUrl,
                    environment,
                    tagsArray,
                    backstory,
                    role,
                    goals,
                    quirks,
                    tone,
                    speechStyle,
                    exampleDialoguesValue,
                    additionalInfo
                );
                const publicRequest = await addCharacterPublicRequestService(
                    session.user.id,
                    characterId,
                );
                if (!publicRequest) {
                    return res.status(500).json({ error: 'Failed to create public request' });
                }
                if(!publicRequest.success){
                    return res.status(200).json({ message:`Character updated successfully but ${publicRequest.message}`,error: publicRequest.message || 'Failed to create public request' });
                }
                return res.status(200).json({ 
                    message: 'Character updated successfully and approval request created',
                    character 
                });
            }
            const character = await updateCharacterService(
                session.user.id, 
                characterId, 
                name, 
                personality, 
                description,
                avatarUrl,
                environment,
                
                tagsArray,
                backstory,
                role,
                goals,
                quirks,
                tone,
                speechStyle,
                exampleDialoguesValue,
                additionalInfo,
                Boolean(isPublic),
            );
            
            return res.status(200).json({ character });
        } else {
            // Admin users can directly control public status
            const character = await updateCharacterService(
                session.user.id, 
                characterId, 
                name, 
                personality, 
                description,
                avatarUrl,
                environment,
                
                tagsArray,
                backstory,
                role,
                goals,
                quirks,
                tone,
                speechStyle,
                exampleDialoguesValue,
                additionalInfo,
                Boolean(isPublic),
            );

            return res.status(200).json({ character });
        }
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

export const getUserCharacterPublicRequests = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers:fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const requests = await getUserCharacterPublicRequestsService(session.user.id);
        return res.status(200).json({ requests });
    } catch (error: any) {
        console.error("Error getting user character public requests:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});