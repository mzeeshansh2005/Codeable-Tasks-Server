import { Router } from 'express';
import { getForYouRecents } from '../controllers/forYou';
import { authenticateUser } from '../middleware/auth';
const router = Router();

router.get('/get-recents/:type',authenticateUser, getForYouRecents);

export default router;