import { Router } from "express";
import { getAllPersonas, createPersona, updatePersona, deletePersona } from "../controllers/persona/persona.controller";

const router = Router();

router.get("/", getAllPersonas);
router.post("/", createPersona);
router.put("/:id", updatePersona);
router.delete("/:id", deletePersona);

export default router;

