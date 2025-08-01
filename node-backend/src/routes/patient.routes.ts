import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const patientController = new PatientController();

// Patient profile routes
router.post('/me', auth, checkRole(['patient']), patientController.createMyProfile);
router.get('/me', auth, checkRole(['patient']), patientController.getMyProfile);
router.patch('/me', auth, checkRole(['patient']), patientController.updateMyProfile);

// Admin and doctor routes
router.get('/', auth, checkRole(['admin', 'doctor']), patientController.getAll);
router.get('/:id', auth, checkRole(['admin', 'doctor']), patientController.getById);
router.put('/:id', auth, checkRole(['admin']), patientController.update);
router.delete('/:id', auth, checkRole(['admin']), patientController.delete);

export default router;
