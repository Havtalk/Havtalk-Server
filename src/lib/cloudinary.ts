import {v2 as cloudinary} from "cloudinary";
import { log } from "console";
import fs from "fs";
        
cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

/**
 * Uploads a file to Cloudinary in a specified folder
 * @param localFilePath Path to the local file
 * @param folder Cloudinary folder to upload to (e.g., "avatars", "characters", etc.)
 * @param folderOwner Optional owner of the folder (e.g., user ID)
 * @returns Cloudinary response or null if upload fails
 */
const uploadOnCloudinary = async(localFilePath: string, folder?: string, folderOwner?:string) => {
    try {
        if(!localFilePath) return null;
        //upload file on cloudinary
        const uploadOptions: any = {
            resource_type: "auto"
        };
        
        // Add folder option if specified
        if (folder) {
            if(folderOwner) {
                uploadOptions.folder = `havtalk/${folder}/${folderOwner}`;
            } else {
                uploadOptions.folder = `havtalk/${folder}`;
            }
        } else {
            uploadOptions.folder = "havtalk"; // Default folder
        }
        
        const response = await cloudinary.uploader.upload(localFilePath, uploadOptions);
        
        //After the file is uploaded
        fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        fs.unlink(localFilePath, (err) => {
            if (err) log("Error deleting file:", err); // delete the temporary file
        });
        return null;
    }
}

export {uploadOnCloudinary};