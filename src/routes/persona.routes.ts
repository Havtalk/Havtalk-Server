import { Router } from "express";
import { getAllPersonas, createPersona, updatePersona, deletePersona } from "../controllers/persona/persona.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getAllPersonas);
router.post("/",upload.single('avatar'), createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);

export default router;

