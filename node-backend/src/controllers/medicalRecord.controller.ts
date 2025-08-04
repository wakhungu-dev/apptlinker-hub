import { Request, Response } from 'express';
import mongoose from 'mongoose';
import MedicalRecord from '../models/medicalRecord.model';
import { BaseController } from './base.controller';
import { IMedicalRecord, IPatient, IDoctor, IAppointment } from '../models/interfaces';
import { AuthRequest } from '../types/express';
import Patient from '../models/patient.model';
import Doctor from '../models/doctor.model';
import Appointment from '../models/appointment.model';

export class MedicalRecordController extends BaseController<IMedicalRecord> {
  constructor() {
    super(MedicalRecord);
  }

  // Create a medical record (for doctors)
  createRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { patientId, appointmentId, diagnosis, prescription, notes } = req.body;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Verify the patient exists
      const patientProfile = await Patient.findById(patientId);
      
      if (!patientProfile) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // If appointmentId provided, verify it exists and belongs to this doctor
      if (appointmentId) {
        const appointment = await Appointment.findOne({
          _id: appointmentId,
          doctor: doctorProfile._id,
          patient: patientProfile._id
        });
        
        if (!appointment) {
          return res.status(404).json({ error: 'Appointment not found or not associated with this doctor and patient' });
        }
        
        // Mark appointment as completed
        appointment.status = 'completed';
        await appointment.save();
      }
      
      // Create medical record
      const newRecord = await MedicalRecord.create({
        patient: patientProfile._id,
        appointment: appointmentId || null,
        diagnosis,
        prescription,
        notes
      });

      return res.status(201).json(newRecord);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error creating medical record', details: err.message });
    }
  };

  // Get medical records for a patient (for doctors)
  getPatientRecords = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { patientId } = req.params;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Verify the patient exists
      const patientProfile = await Patient.findById(patientId);
      
      if (!patientProfile) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // Get all medical records for this patient
      const records = await MedicalRecord.find({ patient: patientId })
        .populate('appointment')
        .sort({ createdAt: -1 });
      
      return res.status(200).json(records);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching medical records', details: err.message });
    }
  };

  // Get my medical records (for patients)
  getMyRecords = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      // Find patient profile
      const patientProfile = await Patient.findOne({ user: userId });
      
      if (!patientProfile) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      
      // Get all medical records for this patient
      const records = await MedicalRecord.find({ patient: patientProfile._id })
        .populate({
          path: 'appointment',
          populate: {
            path: 'doctor',
            populate: {
              path: 'user specialization',
              select: '-password'
            }
          }
        })
        .sort({ createdAt: -1 });
      
      return res.status(200).json(records);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching medical records', details: err.message });
    }
  };

  // Get a specific medical record (for either doctor or patient)
  getRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const userRole = (req as AuthRequest).user.role;
      const { recordId } = req.params;
      
      // Find the record first
      const record = await MedicalRecord.findById(recordId).populate({
        path: 'appointment',
        populate: {
          path: 'doctor patient',
          populate: {
            path: 'user specialization',
            select: '-password'
          }
        }
      });
      
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      
      // Check authorization
      if (userRole === 'patient') {
        // Patient can only access their own records
        const patientProfile = await Patient.findOne({ user: userId });
        
        if (!patientProfile) {
          return res.status(403).json({ error: 'Not authorized to access this record' });
        }
        
        // Use string comparison instead of object methods to avoid typing issues
        const patientId = String(patientProfile._id);
        const recordPatientId = String(record.patient);
        
        if (patientId !== recordPatientId) {
          return res.status(403).json({ error: 'Not authorized to access this record' });
        }
      } else if (userRole === 'doctor') {
        // Doctors can access records of appointments they had with patients
        if (record.appointment) {
          const doctorProfile = await Doctor.findOne({ user: userId });
          const appointment = await Appointment.findById(record.appointment);
          
          if (!doctorProfile || !appointment) {
            return res.status(403).json({ error: 'Not authorized to access this record' });
          }
          
          // Use string comparison instead of object methods to avoid typing issues
          const doctorId = String(doctorProfile._id);
          const appointmentDoctorId = String(appointment.doctor);
          
          if (doctorId !== appointmentDoctorId) {
            return res.status(403).json({ error: 'Not authorized to access this record' });
          }
        } else {
          return res.status(403).json({ error: 'Not authorized to access this record' });
        }
      } else {
        return res.status(403).json({ error: 'Not authorized to access this record' });
      }
      
      return res.status(200).json(record);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching medical record', details: err.message });
    }
  };

  // Update a medical record (for doctors only)
  updateRecord = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { recordId } = req.params;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Find the record
      const record = await MedicalRecord.findById(recordId).populate('appointment');
      
      if (!record) {
        return res.status(404).json({ error: 'Medical record not found' });
      }
      
      // Check if this record is associated with an appointment for this doctor
      if (record.appointment) {
        const appointment = await Appointment.findById(record.appointment);
        if (!appointment) {
          return res.status(403).json({ error: 'Not authorized to update this record' });
        }
        
        const doctorId = String(doctorProfile._id);
        const appointmentDoctorId = String(appointment.doctor);
        
        if (doctorId !== appointmentDoctorId) {
          return res.status(403).json({ error: 'Not authorized to update this record' });
        }
      }
      
      // Update the record
      const { diagnosis, prescription, notes } = req.body;
      
      if (diagnosis) record.diagnosis = diagnosis;
      if (prescription !== undefined) record.prescription = prescription;
      if (notes !== undefined) record.notes = notes;
      
      await record.save();
      
      return res.status(200).json(record);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating medical record', details: err.message });
    }
  };
}
