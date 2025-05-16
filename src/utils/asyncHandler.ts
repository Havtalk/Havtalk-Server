import { Request, Response, NextFunction } from 'express';
import { FileRequest } from '../types/request.js';

type AsyncFunction = (req: Request | FileRequest, res: Response, next: NextFunction) => Promise<any>;

const asyncHandler = (fnc: AsyncFunction) => async (req: Request | FileRequest, res: Response, next: NextFunction) => {
    try {
        await fnc(req, res, next);

    } catch (err: any) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
        
    }
}
export { asyncHandler };
