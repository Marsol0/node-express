import express from 'express';
import auth from '../middleware/auth.js';
import { SIGN_UP, LOGIN, GET_NEW_JWT_TOKEN, GET_ALL_USERS, GET_USER_BY_ID  } from '../controller/user.js';


const router = express.Router();

router.post('/signup', SIGN_UP);
router.post('/login', LOGIN);

router.get('/users', auth, GET_ALL_USERS);
router.get('/users/:id', auth, GET_USER_BY_ID);


router.get('/token', GET_NEW_JWT_TOKEN);

export default router;
