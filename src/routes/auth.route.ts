// import {Router} from "express";
// import { registeruser, login, logout, refreshAccessToken, healthCheck  } from "../controllers/auth/auth.controller";
// import { verifyJWT } from "../middlewares/auth.middleware";
// import { upload } from "../middlewares/multer.middleware";

// const router = Router();

// // Route for user authentication
// router.route("/register").post(upload.fields([{ name: 'avatar', maxCount: 1 }]), registeruser);
// router.route("/login").post(login);
// router.route('/health-check').get(healthCheck);
// router.route("/").get((req, res) => {
//     res.send("Welcome to the Auth API");
// }
// );

// // Secured routes requiring authentication
// router.route("/logout").post(verifyJWT, logout);
// router.route("/refresh-token").post(refreshAccessToken);

// export default router;


