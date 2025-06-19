import { Router } from "express";
import { generateAvatar } from "../controllers/avatar-generation/avatar-generation.controller";

const router = Router();

router.post("/generate", generateAvatar);

export default router;