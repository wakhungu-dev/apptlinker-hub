import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecord.controller';
import { auth, checkRole } from '../middleware/auth.middleware';

const router = Router();
const medicalRecordController = new MedicalRecordController();

// Doctor routes
router.post('/', auth, checkRole(['doctor']), medicalRecordController.createRecord);
router.get('/patient/:patientId', auth, checkRole(['doctor']), medicalRecordController.getPatientRecords);
router.patch('/:recordId', auth, checkRole(['doctor']), medicalRecordController.updateRecord);

// Patient routes
router.get('/me', auth, checkRole(['patient']), medicalRecordController.getMyRecords);

// Common routes
router.get('/:recordId', auth, checkRole(['patient', 'doctor']), medicalRecordController.getRecord);

// Admin routes
router.get('/', auth, checkRole(['admin']), medicalRecordController.getAll);
router.delete('/:id', auth, checkRole(['admin']), medicalRecordController.delete);

export default router;
