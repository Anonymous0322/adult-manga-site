import { Router } from 'express';
import { deleteUser, listUsers, updateUser } from '../controllers/user.controller.js';
import { protect, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protect, requireAdmin, listUsers);
router.patch('/:id', protect, requireAdmin, updateUser);
router.delete('/:id', protect, requireAdmin, deleteUser);

export default router;
