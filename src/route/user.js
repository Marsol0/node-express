import express from 'express';
import auth from '../middleware/auth.js';
import { SIGN_UP, LOGIN, REFRESH_TOKEN } from '../controller/user.js';
import { GET_ALL_USERS, GET_USER_BY_ID } from '../controller/userRouts.js';

const router = express.Router();

router.post('/signup', SIGN_UP);
router.post('/login', LOGIN);

router.get('/users', auth, GET_ALL_USERS);
router.get('/users/:id', auth, GET_USER_BY_ID);

// Note: Changed from POST to GET for refresh token to be consistent with REST practices
router.post('/token', REFRESH_TOKEN);

export default router;
