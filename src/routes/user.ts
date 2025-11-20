import { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  updateLastSignIn,
} from '../controllers/user.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public route - no authentication required
router.post('/', createUser);

router.get('/:uid', authenticateUser, getUser);
router.put('/', authenticateUser, updateUser);
router.patch('/last-signin', authenticateUser, updateLastSignIn);
// router.delete('/:uid', authenticateUser, deleteUser);

export default router;
