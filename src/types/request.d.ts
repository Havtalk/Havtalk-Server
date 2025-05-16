import { Request } from "express";
import { Multer } from "multer";

// Define a type for the file structure
export interface FileRequest extends Request {
    file?: Express.Multer.File;
    files?: {
        [fieldname: string]: Express.Multer.File[];
    };
}
