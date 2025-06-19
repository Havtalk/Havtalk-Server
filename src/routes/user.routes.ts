import { Router } from "express";
import { toggleFavourite, getFavorites, updateDetails,getUserDetails,addUserDetails,updateUserAvatar } from "../controllers/user/user.controller";
import { upload } from "../middlewares/multer.middleware";

const router= Router();

router.post("/toggle-favourite", toggleFavourite);
router.get("/favorites", getFavorites);
router.get("/user-details", getUserDetails);
router.post("/user-details", addUserDetails);
router.put("/user-details", updateDetails);
router.put("/update-avatar",upload.single('avatar'), updateUserAvatar);

export default router;