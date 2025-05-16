import { Router } from "express";
import { createChatSession,getAllUserChats,getChatsWithCharacter,getSingleChatDetails,sendMessage,deleteChat } from "../controllers/chat/chat.controller";

const router = Router();

router.get("/", getAllUserChats);
router.post("/", createChatSession);
router.get("/character/:characterId", getChatsWithCharacter);
router.get("/:id", getSingleChatDetails);
router.post("/:id/message", sendMessage);
router.delete("/:id", deleteChat);

export default router;