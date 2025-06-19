import { Router } from "express";
import { registerAdmin,addToCharacterShowcase, getCharacterShowcase, deleteFromCharacterShowcase,allUserRequests,updateUserRequest ,updateStatusFromCharacterShowcase} from "../controllers/admin/admin.controller";

const router = Router();

router.get("/character-showcase", getCharacterShowcase);
router.post("/character-showcase", addToCharacterShowcase);
router.delete("/character-showcase", deleteFromCharacterShowcase);
router.put("/character-showcase", updateStatusFromCharacterShowcase);
router.get("/user-requests", allUserRequests);
router.put("/user-requests/:id", updateUserRequest);
router.post('/add',registerAdmin);
export default router;