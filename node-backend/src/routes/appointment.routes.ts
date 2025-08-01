import { Router } from 'express';
import { AppointmentController } from '../controllers/appointment.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const appointmentController = new AppointmentController();

// Patient routes
router.post('/', auth, checkRole(['patient']), appointmentController.bookAppointment);
router.patch('/:appointmentId/cancel', auth, checkRole(['patient']), appointmentController.cancelAppointment);

// Doctor routes
router.patch('/:appointmentId/status', auth, checkRole(['doctor']), appointmentController.updateStatus);

// Common routes for both patients and doctors
router.get('/me', auth, checkRole(['patient', 'doctor']), appointmentController.getMyAppointments);

// Admin routes
router.get('/', auth, checkRole(['admin']), appointmentController.getAll);
router.get('/:id', auth, checkRole(['admin', 'patient', 'doctor']), appointmentController.getById);
router.delete('/:id', auth, checkRole(['admin']), appointmentController.delete);

export default router;
