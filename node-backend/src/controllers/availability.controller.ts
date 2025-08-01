import { Request, Response } from 'express';
import Availability from '../models/availability.model';
import { BaseController } from './base.controller';
import { IAvailability } from '../models/interfaces';
import { AuthRequest } from '../types/express';
import Doctor from '../models/doctor.model';

export class AvailabilityController extends BaseController<IAvailability> {
  constructor() {
    super(Availability);
  }

  // Create availability slot for doctor
  createSlot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Create availability slot
      const newSlot = await Availability.create({
        ...req.body,
        doctor: doctorProfile._id
      });

      return res.status(201).json(newSlot);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error creating availability slot', details: err.message });
    }
  };

  // Get availability slots for doctor
  getMySlots = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      const slots = await Availability.find({ doctor: doctorProfile._id })
        .sort({ date: 1, startTime: 1 });
      
      return res.status(200).json(slots);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching availability slots', details: err.message });
    }
  };

  // Get availability slots for a specific doctor
  getDoctorSlots = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { doctorId } = req.params;
      
      const slots = await Availability.find({
        doctor: doctorId,
        isBooked: false,
        // Only show future slots
        date: { $gte: new Date().toISOString().split('T')[0] }
      }).sort({ date: 1, startTime: 1 });
      
      return res.status(200).json(slots);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching doctor availability', details: err.message });
    }
  };

  // Update availability slot
  updateSlot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { slotId } = req.params;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Make sure the slot belongs to this doctor
      const slot = await Availability.findOne({
        _id: slotId,
        doctor: doctorProfile._id
      });
      
      if (!slot) {
        return res.status(404).json({ error: 'Availability slot not found or not owned by this doctor' });
      }
      
      // If the slot is already booked, don't allow updates
      if (slot.isBooked) {
        return res.status(400).json({ error: 'Cannot update a slot that is already booked' });
      }
      
      // Update the slot
      const updatedSlot = await Availability.findByIdAndUpdate(
        slotId,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      return res.status(200).json(updatedSlot);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating availability slot', details: err.message });
    }
  };

  // Delete availability slot
  deleteSlot = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { slotId } = req.params;
      
      // Find doctor profile
      const doctorProfile = await Doctor.findOne({ user: userId });
      
      if (!doctorProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      // Make sure the slot belongs to this doctor
      const slot = await Availability.findOne({
        _id: slotId,
        doctor: doctorProfile._id
      });
      
      if (!slot) {
        return res.status(404).json({ error: 'Availability slot not found or not owned by this doctor' });
      }
      
      // If the slot is already booked, don't allow deletion
      if (slot.isBooked) {
        return res.status(400).json({ error: 'Cannot delete a slot that is already booked' });
      }
      
      // Delete the slot
      await Availability.findByIdAndDelete(slotId);
      
      return res.status(200).json({ message: 'Availability slot deleted successfully' });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error deleting availability slot', details: err.message });
    }
  };
}
