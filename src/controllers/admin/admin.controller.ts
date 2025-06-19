import {addToCharacterShowcaseService,allUserRequestsService,deleteFromCharacterShowcaseService,getCharacterShowcaseService,updateUserRequestService,setStatusToCharacterShowcaseService} from '../../services/admin.service';
import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { auth } from '../../lib/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const registerAdmin= asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name, username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    console.log("Received signup request:", req.body); 
   
        const response=await auth.api.createUser({
            body: {
                email,
                password,
                name,
                data:{
                   username 
                },
                role: 'admin',
                
            }
        })
        if (!response) {
            return res.status(500).json({ error: "Internal server error" });
        }
        res.json({message:"Signup successful!",data:response});
});

export const addToCharacterShowcase = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { characterId} = req.body;

    if (!characterId || !session.user.id) {
        return res.status(400).json({ error: 'Character ID and User ID are required' });
    }

    const result = await addToCharacterShowcaseService( session.user.id, characterId);
    if (!result) {
        return res.status(500).json({ error: 'Failed to add character to showcase' });
    }
    return res.status(200).json(result);
});

export const getCharacterShowcase = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    
    const result = await getCharacterShowcaseService();
    if (!result) {
        return res.status(500).json({ error: 'Failed to fetch character showcase' });
    }
    return res.status(200).json(result);
});

export const deleteFromCharacterShowcase = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    const { characterId } = req.body;

    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (!characterId) {
        return res.status(400).json({ error: 'Character ID is required' });
    }

    const result = await deleteFromCharacterShowcaseService(session.user.id,characterId);
    if (!result) {
        return res.status(500).json({ error: 'Failed to delete character from showcase' });
    };
    return res.status(200).json(result);
});

export const updateStatusFromCharacterShowcase = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const { showcaseId, status } = req.body;
    console.log("Received update request:", req.body); // Log the request body for debugging
    
    // Fix the validation to properly handle boolean values
    if (!showcaseId || status === undefined) {
        return res.status(400).json({ error: 'Showcase ID and status are required' });
    }
    
    const result = await setStatusToCharacterShowcaseService(showcaseId, status);
    if (!result) {
        return res.status(500).json({ error: 'Failed to update character showcase status' });
    }
    return res.status(200).json(result);
});

export const allUserRequests = asyncHandler(async (req: Request, res: Response) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const result = await allUserRequestsService();
    if (!result) {
        return res.status(500).json({ error: 'Failed to fetch user requests' });
    }
    return res.status(200).json(result);
});

export const updateUserRequest = asyncHandler(async (req: Request, res: Response) => {
    const { status, adminNote } = req.body;
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if(session.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    const requestId = req.params.id;

    if (!requestId || !status) {
        return res.status(400).json({ error: 'Request ID and status are required' });
    }
    console.log("Received update request:", req.body); // Log the request body for debugging
    const result = await updateUserRequestService(requestId, status, adminNote);
    if (!result) {
        return res.status(500).json({ error: 'Failed to update user request' });
    }
    return res.status(200).json(result);
});



