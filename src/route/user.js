import express from 'express';
import { SIGN_UP, LOGIN } from '../controller/user.js'

const router = express.Router();

router.post('/signup', SIGN_UP);
router.post('/login', LOGIN);

export default router;