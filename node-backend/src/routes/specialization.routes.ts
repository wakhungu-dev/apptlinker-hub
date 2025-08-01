import { Router } from 'express';
import { SpecializationController } from '../controllers/specialization.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const specializationController = new SpecializationController();

// Public route to get all specializations
router.get('/', specializationController.getAll);

// Admin routes for CRUD operations
router.post('/', auth, checkRole(['admin']), specializationController.create);
router.get('/:id', auth, checkRole(['admin']), specializationController.getById);
router.put('/:id', auth, checkRole(['admin']), specializationController.update);
router.delete('/:id', auth, checkRole(['admin']), specializationController.delete);

export default router;
