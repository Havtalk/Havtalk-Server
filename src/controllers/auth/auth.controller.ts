import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { ApiError } from "../../utils/ApiError";

//cant use /api/auth/*path because of the way better-auth works
export const login=asyncHandler(async(req, res) => {
    const { email, password,username } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");

    }
    const response=await auth.api.signInEmail({
        body:{
            password,
            email,

        }
    })
    res.json({message:"Login successful!",data:response});
});
export const register=asyncHandler(async(req, res) => {
    const { email, password, name, username } = req.body;
    if (!email || !password||!name || !username) {
        throw new ApiError(400, "Email and password are required");
    }
    
    const response=await auth.api.signUpEmail({
        body:{
            email,
            password,
            name,
            username,
        }
    })
    res.json({message:"Signup successful!",data:response});
    
});

export const usersession=asyncHandler(async (req, res) => {
    try{
        const session = await auth.api.getSession({   
        headers: fromNodeHeaders(req.headers),
        
    });
   return res.status(200).json(session);
    }catch(error){
        res.status(500).json(error)
    }
       
});



