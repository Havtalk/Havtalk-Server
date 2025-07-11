import { Router } from "express";
import { createChatSession,getAllUserChats,getChatsWithCharacter,getSingleChatDetails,sendMessage,sendMessageStream,deleteChat,streamConnection,resetChat,updatePersonaInChatSession } from "../controllers/chat/chat.controller";

const router = Router();

router.get("/", getAllUserChats);
router.post("/", createChatSession);
router.get("/character/:characterId", getChatsWithCharacter);
router.post("/:id/reset", resetChat);
router.put("/:id/persona", updatePersonaInChatSession); // Update persona in chat session
router.get("/:id", getSingleChatDetails);
// Use POST for message streaming instead of GET
router.post("/:id/message", sendMessage);
router.post("/:id/message/stream", sendMessageStream);
router.delete("/:id", deleteChat);
router.get("/:id/stream", streamConnection); // Add this new endpoint for SSE connection

export default router;