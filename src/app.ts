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




app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.post('/api/auth/login', asyncHandler(async(req, res) => {
    const { email, password,username } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });

    }
    // console.log('lolo:',req.body);
    const response=await auth.api.signInUsername({
        body:{
            password,
            username,

        }
    })
    res.json({message:"Login successful!",data:response});
}));
app.post('/api/auth/signup', asyncHandler(async(req, res) => {
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



app.all('/api/auth/*path',toNodeHandler(auth));
app.get("/api/me", asyncHandler(async (req, res) => {
    console.log("headers:", req.headers); // Log the headers for debugging
    try{
        const session = await auth.api.getSession({   
        headers: fromNodeHeaders(req.headers),
        
    });
   return res.json(session);
    }catch(error){
        res.json(error)
    }
    
   
   
}));


import characterRouter from "./routes/character.routes";
import personaRouter from "./routes/persona.routes";
import chatSessionRouter from "./routes/chatsession.routes";

app.use("/api/character", characterRouter);
app.use("/api/persona", personaRouter);
app.use("/api/chatsession", chatSessionRouter);

export {app};