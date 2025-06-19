import { Router } from "express";
import { getAllPersonas, createPersona, updatePersona, deletePersona,setCurrentPersona } from "../controllers/persona/persona.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getAllPersonas);
router.post("/",upload.single('avatar'), createPersona);
router.post("/set-current", setCurrentPersona);
router.put("/:id",upload.single('avatar'), updatePersona);
router.delete("/:id", deletePersona);

export default router;

