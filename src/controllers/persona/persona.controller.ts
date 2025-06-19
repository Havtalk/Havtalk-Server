import {createPersonaService,deletePersonaService,getAllPersonasService,updatePersonaService,setCurrentPersonaService} from '../../services/persona.service';
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { auth } from '../../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';
import { uploadOnCloudinary } from '../../lib/cloudinary';

export const getAllPersonas = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const personas = await getAllPersonasService(session.user.id);
        return res.status(200).json({ message: 'Personas retrieved successfully', personas });
    } catch (error: any) {
        console.error("Error getting personas:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const createPersona = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, description, personality, avatarUrl } = req.body;

        if (!name || !description || !personality) {
            return res.status(400).json({ error: 'Name, description, and personality are required' });
        }

        let finalAvatarUrl = null;

        // Handle file upload
        if (req.file) {
            const file = req.file.path;
            if (file) {
                const uploadResult = await uploadOnCloudinary(file, session.user.id, "personas");
                if (uploadResult) {
                    finalAvatarUrl = uploadResult.secure_url;
                }
            }
        } 
        // Handle avatar URL provided directly
        else if (avatarUrl) {
            finalAvatarUrl = avatarUrl;
        }

        const persona = await createPersonaService(
            session.user.id,
            name,
            description,
            personality,
            finalAvatarUrl
        );

        return res.status(201).json({ message: 'Persona created successfully', persona });
    } catch (error: any) {
        console.error("Error creating persona:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const updatePersona = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const personaId = req.params.id;
        
        if (!personaId) {
            return res.status(400).json({ error: 'Persona ID is required' });
        }
        console.log(req.body,personaId);

        const { name, description, personality, avatar } = req.body;
        let finalAvatarUrl = null;

        // Handle file upload
        if (req.file) {
            const file = req.file.path;
            if (file) {
                const uploadResult = await uploadOnCloudinary(file, session.user.id, "personas");
                if (uploadResult) {
                    finalAvatarUrl = uploadResult.secure_url;
                }
            }
        } 
        // Handle avatar URL provided directly
        else if (avatar) {
            finalAvatarUrl = avatar;
        }

        const persona = await updatePersonaService(
            session.user.id,
            personaId,
            name,
            description,
            personality,
            finalAvatarUrl
        );

        return res.status(200).json({ message: 'Persona updated successfully', persona });
    } catch (error: any) {
        console.error("Error updating persona:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const deletePersona = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const personaId = req.params.id;
        
        if (!personaId) {
            return res.status(400).json({ error: 'Persona ID is required' });
        }

        await deletePersonaService(session.user.id, personaId);
        return res.status(200).json({ message: 'Persona deleted successfully' });
    } catch (error: any) {
        console.error("Error deleting persona:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

export const setCurrentPersona = asyncHandler(async (req: Request, res: Response) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        
        if (!session?.user?.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const personaId = req.body.personaId;
        
        // if (!personaId) {
        //     return res.status(400).json({ error: 'Persona ID is required' });
        // }

        const updatedPersona = await setCurrentPersonaService(session.user.id, personaId);
        return res.status(200).json({ message: 'Current persona set successfully', updatedPersona });
    } catch (error: any) {
        console.error("Error setting current persona:", error);
        return res.status(500).json({ error: error.message || 'Something went wrong' });
    }
});

