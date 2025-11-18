import { Router } from 'express';
import { createUser, getUser } from '../controllers/user.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

// Public route - no authentication required
router.post('/', createUser);

router.get('/:id', authenticateUser, getUser);
// router.put('/:id', authenticateUser, updateUser);
// router.delete('/:id', authenticateUser, deleteUser);

export default router;
