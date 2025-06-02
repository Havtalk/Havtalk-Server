import { Router } from "express";
import { getAllCharacters, getAllPublicCharacters, getCharacterDetails, addCharacter, updateCharacter, deleteCharacter } from "../controllers/character/character.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.get("/", getAllCharacters);
router.post("/",upload.single('avatar'), addCharacter);
router.get("/public", getAllPublicCharacters);
router.get("/:id", getCharacterDetails);
router.put("/:id",upload.single('avatar'), updateCharacter);
router.delete("/:id", deleteCharacter);


export default router;

