import { Router } from "express";
import { getAllCharacters, getAllPublicCharacters, getCharacterDetails, addCharacter, updateCharacter, deleteCharacter } from "../controllers/character/character.controller";

const router = Router();

router.get("/", getAllCharacters);
router.post("/", addCharacter);
router.get("/public", getAllPublicCharacters);
router.get("/:id", getCharacterDetails);
router.put("/:id", updateCharacter);
router.delete("/:id", deleteCharacter);


export default router;

