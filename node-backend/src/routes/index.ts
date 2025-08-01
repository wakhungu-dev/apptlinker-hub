import { Router } from 'express';
import userRoutes from './user.routes';
import specializationRoutes from './specialization.routes';
import patientRoutes from './patient.routes';
import doctorRoutes from './doctor.routes';
import availabilityRoutes from './availability.routes';
import appointmentRoutes from './appointment.routes';
import medicalRecordRoutes from './medicalRecord.routes';

const router = Router();

// Register all routes
router.use('/users', userRoutes);
router.use('/specializations', specializationRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/availability', availabilityRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/medical-records', medicalRecordRoutes);

export default router;
