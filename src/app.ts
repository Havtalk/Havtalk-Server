import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { asyncHandler } from "./utils/asyncHandler";

const app=express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.get('/health-check', (req, res) => {
    res.json({message:"Server is running smoothly!"});
});


app.all('/api/auth/*path',toNodeHandler(auth));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//cant use /api/auth/*path because of the way better-auth works
app.post('/api/login', asyncHandler(async(req, res) => {
    const { email, password,username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });

    }
    // console.log('lolo:',req.body);
    const response=await auth.api.signInEmail({
        body:{
            password,
            email,

        }
    })
    res.json({message:"Login successful!",data:response});
}));
app.post('/api/signup', asyncHandler(async(req, res) => {
    const { email, password, name, username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }
    console.log("Received signup request:", req.body); // Log the request body for debugging
    try{
        const response=await auth.api.signUpEmail({
            body:{
                email,
                password,
                name,
                username,
                // isVerified:true,
                
            }
        })
        res.json({message:"Signup successful!",data:response});
    }catch(error){
        console.log("Error in signup:",error);
        return res.status(500).json({ error: "Internal server error" });
    }
    
    
}));




app.get("/api/me", asyncHandler(async (req, res) => {
    console.log("headers:", req.headers); // Log the headers for debugging
    try{
        const session = await auth.api.getSession({   
        headers: fromNodeHeaders(req.headers),
        
    });
   return res.status(200).json(session);
    }catch(error){
        res.status(500).json(error)
    }
    
   
   
}));


import characterRouter from "./routes/character.routes";
import personaRouter from "./routes/persona.routes";
import chatSessionRouter from "./routes/chatsession.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import avatarGenerateRouter from "./routes/avatar-generate.routes";


app.use("/api/character", characterRouter);
app.use("/api/persona", personaRouter);
app.use("/api/chatsession", chatSessionRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/avatar", avatarGenerateRouter);


export {app};