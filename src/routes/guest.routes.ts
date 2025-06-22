import { Router } from "express";
import { addGuestUser, getPublicCharacterDetails, sendGuestMessageStream } from "../controllers/guest-chat/guest.controller";
import { validateGuestUser } from "../middlewares/validate-guest.middleware";

const router = Router();

router.post("/", addGuestUser);
router.get("/character/:id", getPublicCharacterDetails);
router.post("/:characterId/message/stream",validateGuestUser,sendGuestMessageStream);

export default router;