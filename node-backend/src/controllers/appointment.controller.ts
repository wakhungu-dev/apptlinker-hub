import { Request, Response } from 'express';
import Appointment from '../models/appointment.model';
import { BaseController } from './base.controller';
import { IAppointment } from '../models/interfaces';
import { AuthRequest } from '../types/express';
import Patient from '../models/patient.model';
import Doctor from '../models/doctor.model';
import Availability from '../models/availability.model';

export class AppointmentController extends BaseController<IAppointment> {
  constructor() {
    super(Appointment);
  }

  // Book an appointment as a patient
  bookAppointment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { availabilityId } = req.body;
      
      // Find patient profile
      const patientProfile = await Patient.findOne({ user: userId });
      
      if (!patientProfile) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      
      // Find availability slot
      const availabilitySlot = await Availability.findById(availabilityId);
      
      if (!availabilitySlot) {
        return res.status(404).json({ error: 'Availability slot not found' });
      }
      
      // Check if slot is already booked
      if (availabilitySlot.isBooked) {
        return res.status(400).json({ error: 'This slot is already booked' });
      }
      
      // Mark the slot as booked
      availabilitySlot.isBooked = true;
      await availabilitySlot.save();
      
      // Create appointment
      const newAppointment = await Appointment.create({
        patient: patientProfile._id,
        doctor: availabilitySlot.doctor,
        date: availabilitySlot.date,
        startTime: availabilitySlot.startTime,
        endTime: availabilitySlot.endTime,
        status: 'scheduled',
        reasonForVisit: req.body.reasonForVisit || ''
      });

      // Populate the appointment with doctor and patient details
      const populatedAppointment = await Appointment.findById(newAppointment._id)
        .populate({
          path: 'doctor',
          populate: {
            path: 'user specialization',
            select: '-password'
          }
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: '-password'
          }
        });
      
      return res.status(201).json(populatedAppointment);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error booking appointment', details: err.message });
    }
  };

  // Get patient's appointments
  getMyAppointments = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const userRole = (req as AuthRequest).user.role;
      
      let query = {};
      
      if (userRole === 'patient') {
        // Find patient profile
        const patientProfile = await Patient.findOne({ user: userId });
        
        if (!patientProfile) {
          return res.status(404).json({ error: 'Patient profile not found' });
        }
        
        query = { patient: patientProfile._id };
      } else if (userRole === 'doctor') {
        // Find doctor profile
        const doctorProfile = await Doctor.findOne({ user: userId });
        
        if (!doctorProfile) {
          return res.status(404).json({ error: 'Doctor profile not found' });
        }
        
        query = { doctor: doctorProfile._id };
      } else {
        return res.status(403).json({ error: 'Unauthorized' });
      }
      
      // Filter by status if provided
      const { status } = req.query;
      if (status) {
        query = { ...query, status };
      }
      
      const appointments = await Appointment.find(query)
        .populate({
          path: 'doctor',
          populate: {
            path: 'user specialization',
            select: '-password'
          }
        })
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            select: '-password'
          }
        })
        .sort({ date: 1, startTime: 1 });
      
      return res.status(200).json(appointments);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching appointments', details: err.message });
    }
  };

  // Update appointment status (for doctors to cancel, complete, etc.)
  updateStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { appointmentId } = req.params;
      const { status, notes } = req.body;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Make sure the appointment belongs to this doctor
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        doctor: doctorProfile._id
      });
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found or not owned by this doctor' });
      }
      
      // Update the appointment status
      appointment.status = status;
      if (notes) {
        appointment.notes = notes;
      }
      
      await appointment.save();
      
      // If appointment is cancelled, free up the availability slot
      if (status === 'cancelled') {
        // Find the matching availability slot
        const availabilitySlot = await Availability.findOne({
          doctor: appointment.doctor,
          date: appointment.date,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          isBooked: true
        });
        
        if (availabilitySlot) {
          availabilitySlot.isBooked = false;
          await availabilitySlot.save();
        }
      }
      
      return res.status(200).json(appointment);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating appointment status', details: err.message });
    }
  };

  // Cancel appointment (for patients)
  cancelAppointment = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { appointmentId } = req.params;
      
      // Find patient profile
      const patientProfile = await Patient.findOne({ user: userId });
      
      if (!patientProfile) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      
      // Make sure the appointment belongs to this patient
      const appointment = await Appointment.findOne({
        _id: appointmentId,
        patient: patientProfile._id
      });
      
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found or not owned by this patient' });
      }
      
      // Check if appointment can be cancelled (not completed or already cancelled)
      if (['completed', 'cancelled'].includes(appointment.status)) {
        return res.status(400).json({ error: `Cannot cancel an appointment that is already ${appointment.status}` });
      }
      
      // Update the appointment status
      appointment.status = 'cancelled';
      await appointment.save();
      
      // Free up the availability slot
      const availabilitySlot = await Availability.findOne({
        doctor: appointment.doctor,
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        isBooked: true
      });
      
      if (availabilitySlot) {
        availabilitySlot.isBooked = false;
        await availabilitySlot.save();
      }
      
      return res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error cancelling appointment', details: err.message });
    }
  };
}
