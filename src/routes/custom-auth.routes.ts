import {Router} from "express";
import {login,register,usersession} from '../controllers/auth/auth.controller';

const router = Router();

router.post('/login',login);
router.post('/register',register);
router.get('/session',usersession);

export default router;

