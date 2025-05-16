// import {loginUserService,logOutUserService,registerUserService,refreshAccessTokenService} from '../../services/auth.service';
// import { NextFunction, Request, Response } from 'express'
// import { FileRequest } from '../../types/request';
// import { ApiError } from '../../utils/ApiError';
// import { asyncHandler } from '../../utils/asyncHandler';

// // Using a more generic approach for this specific handler
// export const registeruser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     const { email, password, username, firstName, lastName } = req.body;
//     if(!email || !password || !username || !firstName){
//         return res.status(400).json({error:"All fields are required"})
//     }
//     try {
//         let avatarLocalPath;
//         // Safely cast req to FileRequest for files access
//         const fileReq = req as FileRequest;
//         if(fileReq.files && 'avatar' in fileReq.files && fileReq.files.avatar.length > 0){
//             avatarLocalPath = fileReq.files.avatar[0]?.path;
//         }
//         const {accessToken} = await registerUserService(password, firstName, email, username, lastName, avatarLocalPath);
//         return res.status(201).json({ status:201, accessToken, message:"User registered successfully" })
//     }
//     catch (error) { 
//         return res.status(400).json({ error: (error as Error).message })
//     }
// })

// export const login = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
//     const { identifier, password } = req.body;
//     if(!identifier || !password){
//         return res.status(400).json({error:"All fields are required"})
//     }
//     try {
//         const {accessToken,refreshToken} = await loginUserService(identifier,password);
//         const options={
//             httpOnly:true,//cookies can be modified from frontend so to avoid that we use this
//             secure:true
//         }
//         return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({ status:200,accessToken,message:"User logged in successfully" })
//     }
//     catch (error) { 
//         return res.status(400).json({ error: (error as Error).message })
//     }
// })

// export const healthCheck = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
//     try {
//         // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
//         // if (!token) {
//         //     return res.status(401).json({ status:401,error: "Unauthorized request" });
//         // }
//         // const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
//         // if (!decodedToken) {
//         //     return res.status(401).json({ status:401,error: "Invalid Access token" });
//         // }
//         return res.status(200).json({status:200,message:"User is authenticated"})
//     }
//     catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "Invalid access Token";
//         return res.status(401).json({ status:401,error: errorMessage });
//     }
// })

// export const logout = asyncHandler(async (req:Request, res:Response, next: NextFunction) => {
//     if (!req.user) {
//         return res.status(401).json({ error: "Unauthorized: User not authenticated" });
//     }
    
//     const logoutUser = logOutUserService(req.user.id);
//     if(!logoutUser) return res.status(400).json({error:"Logout failed"});
//     const options={
//             httpOnly:true,
//             secure:true
//     }
    
//     return res.status(200).clearCookie("accessToken",options)
//                     .clearCookie("refreshToken",options).json({status:200,message:"User logged out successfully"})
// }
// )
// export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const refreshToken = req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer", "");
//         if (!refreshToken) {
//             return res.status(401).json({ status:401,error: "Unauthorized request" });
//         }
//         const newaccessToken = await refreshAccessTokenService(refreshToken);
//         return res.status(200).cookie("accessToken", newaccessToken, { httpOnly: true, secure: true }).json({ status: 200, accessToken: newaccessToken, message: "Access token refreshed successfully" });
//     }
//     catch (error) {
//         const errorMessage = error instanceof Error ? error.message : "Invalid refresh token";
//         return res.status(401).json({ error: errorMessage });
//     }
// }
// )
