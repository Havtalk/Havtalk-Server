// import prisma  from '../lib/prisma';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { uploadOnCloudinary } from '../utils/cloudinary';
// import { ApiError } from '../utils/ApiError';


// const registerUserService = async (password: string,firstName: string, email: string, username: string,lastName?:string,avatar?:string ) => { 
//     if(
//         [firstName,email,username,password].some((field)=>field?.trim()==="")
//     ){
//         throw new Error("All fields are required");
//     }
//     if (password.length < 6) throw new Error('Password must be at least 6 characters long');
    
//     // Changed from findUnique to findFirst to allow using OR condition
//     const existing = await prisma.user.findFirst({
//         where: {
//             OR: [
//                 { email },
//                 { username },
//             ]
//         },
//         select: { id: true, email: true, username: true },
//     });
//     if (existing) throw new Error('User already exists');

//     const hashed = await bcrypt.hash(password, 10);
    

//     const user = await prisma.user.create({
//         data: { 
//             email, 
//             username: username || '', 
//             password: hashed, 
//             firstName: firstName || '', 
//             lastName: lastName || '',
//             isVerified: false,
//         },
//     });
//     const { accessToken, refreshToken } = createJwt(user.id);
//     if (!refreshToken) throw new Error('Failed to create refresh token');
//     if (!accessToken) throw new Error('Failed to create access token');

//     if(avatar){
//         const uploadResponse = await uploadOnCloudinary(avatar, 'avatars', user.id);
//         if(!uploadResponse) throw new Error("Avatar upload failed");
//         avatar=uploadResponse.secure_url;
//         await prisma.user.update({
//             where:{
//                 id:user.id
//             },
//             data:{
//                 avatar:avatar,
//                 refreshToken:refreshToken
//             }
//         })
//     }else{
//         await prisma.user.update({
//             where:{
//                 id:user.id
//             },
//             data:{
//                 refreshToken:refreshToken
//             }
//         })
//     }

//   return { accessToken, refreshToken }
// }

// const loginUserService = async (identifier: string, password: string) => {
//   if (!identifier) throw new Error('Email or username is required');
//   if (!password) throw new Error('Password is required');
  
//   const user = await prisma.user.findFirst({
//     where: {
//         OR: [
//             { email: identifier || undefined },
//             { username: identifier || undefined },
//         ]
//     },
//     select: { id: true, password: true },
//   });
  
//   if (!user || !user.password) throw new Error('Invalid credentials')

//   const isMatch = await bcrypt.compare(password, user.password)
//   if (!isMatch) throw new Error('Invalid credentials');
//   const { accessToken, refreshToken } = createJwt(user.id);
    
//     if (!refreshToken) throw new Error('Failed to create refresh token')
//     if (!accessToken) throw new Error('Failed to create access token')
//         await prisma.user.update({
//             where: { id: user.id },
//             data: { refreshToken },
//         })

//   return { accessToken, refreshToken }
// }

// const logOutUserService = async (userId: string) => {
//   if (!userId) throw new Error('User ID is required')
//     const user = await prisma.user.findUnique({
//         where: { id: userId },
//         select: { id: true },
//     })
//     if (!user) throw new Error('User not found')
//     await prisma.user.update({
//         where: { id: userId },
//         data: { refreshToken: null },
//     })
//     return true
// }

// const refreshAccessTokenService = async (refreshToken: string) => {
//     if (!refreshToken) throw new ApiError(401,'Refresh token is required')
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { userId: string }
//     if (!decoded) throw new ApiError(401,'Invalid refresh token')
//     const user = await prisma.user.findUnique({
//         where: { id: decoded.userId },
//         select: { id: true, refreshToken: true },
//     })
//     if (!user || user.refreshToken !== refreshToken) throw new ApiError(401,'Refresh token is expired or used')
//     const accessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
//     return accessToken
// }



// const createJwt = (userId: string) => {
//     const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' })
//     const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' })
//   return { accessToken, refreshToken }
// }

// export { registerUserService, loginUserService, createJwt, logOutUserService, refreshAccessTokenService };
