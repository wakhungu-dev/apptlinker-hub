import { Router } from 'express';
import { DoctorController } from '../controllers/doctor.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const doctorController = new DoctorController();

// Public route to get all doctors
router.get('/', doctorController.getAllDoctors);

// Doctor profile routes
router.post('/me', auth, checkRole(['doctor']), doctorController.createMyProfile);
router.get('/me', auth, checkRole(['doctor']), doctorController.getMyProfile);
router.patch('/me', auth, checkRole(['doctor']), doctorController.updateMyProfile);

// Admin routes
router.get('/:id', doctorController.getById);
router.put('/:id', auth, checkRole(['admin']), doctorController.update);
router.delete('/:id', auth, checkRole(['admin']), doctorController.delete);

export default router;
