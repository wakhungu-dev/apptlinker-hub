import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getProfile);
router.patch('/me', auth, userController.updateProfile);

// Admin routes using the base controller methods (get all users, etc.)
router.get('/', auth, userController.getAll);
router.get('/:id', auth, userController.getById);
router.put('/:id', auth, userController.update);
router.delete('/:id', auth, userController.delete);

export default router;
