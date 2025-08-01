import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const availabilityController = new AvailabilityController();

// Public route to get a doctor's availability slots
router.get('/doctor/:doctorId', availabilityController.getDoctorSlots);

// Doctor routes to manage their availability
router.post('/', auth, checkRole(['doctor']), availabilityController.createSlot);
router.get('/me', auth, checkRole(['doctor']), availabilityController.getMySlots);
router.put('/:slotId', auth, checkRole(['doctor']), availabilityController.updateSlot);
router.delete('/:slotId', auth, checkRole(['doctor']), availabilityController.deleteSlot);

// Admin routes
router.get('/', auth, checkRole(['admin']), availabilityController.getAll);
router.get('/:id', auth, checkRole(['admin']), availabilityController.getById);

export default router;
