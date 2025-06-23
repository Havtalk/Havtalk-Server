import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";

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

import characterRouter from "./routes/character.routes";
import personaRouter from "./routes/persona.routes";
import chatSessionRouter from "./routes/chatsession.routes";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";
import avatarGenerateRouter from "./routes/avatar-generate.routes";
import guestRouter from "./routes/guest.routes";
import customAuthRouter from "./routes/custom-auth.routes";

app.use("/custom-auth", customAuthRouter); // Custom auth routes
app.use("/api/character", characterRouter);
app.use("/api/persona", personaRouter);
app.use("/api/chatsession", chatSessionRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/avatar", avatarGenerateRouter);
app.use("/api/guest", guestRouter);


export {app};