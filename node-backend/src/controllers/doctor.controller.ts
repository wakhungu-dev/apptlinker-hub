import { Request, Response } from 'express';
import Doctor from '../models/doctor.model';
import { BaseController } from './base.controller';
import { IDoctor } from '../models/interfaces';
import { AuthRequest } from '../types/express';
import User from '../models/user.model';

export class DoctorController extends BaseController<IDoctor> {
  constructor() {
    super(Doctor);
  }

  // Create doctor profile for the current user
  createMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      // Check if user already has a doctor profile
      const existingProfile = await Doctor.findOne({ user: userId });
      
      if (existingProfile) {
        return res.status(400).json({ error: 'Doctor profile already exists for this user' });
      }
      
      // Check if user exists and has the right role
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.role !== 'doctor') {
        return res.status(403).json({ error: 'Only users with doctor role can create a doctor profile' });
      }

      // Create doctor profile
      const newProfile = await Doctor.create({
        ...req.body,
        user: userId
      });

      return res.status(201).json(newProfile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error creating doctor profile', details: err.message });
    }
  };

  // Get current user's doctor profile
  getMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      const profile = await Doctor.findOne({ user: userId })
        .populate('user', '-password')
        .populate('specialization');
      
      if (!profile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      return res.status(200).json(profile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching doctor profile', details: err.message });
    }
  };

  // Update current user's doctor profile
  updateMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      const updatedProfile = await Doctor.findOneAndUpdate(
        { user: userId },
        { $set: req.body },
        { new: true, runValidators: true }
      ).populate('specialization');
      
      if (!updatedProfile) {
        return res.status(404).json({ error: 'Doctor profile not found' });
      }
      
      return res.status(200).json(updatedProfile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating doctor profile', details: err.message });
    }
  };

  // Get all doctors with filters
  getAllDoctors = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { specialization, name } = req.query;
      
      const filter: { specialization?: string; name?: RegExp } = {};
      
      if (specialization) {
        filter.specialization = specialization as string;
      }
      
      if (name) {
        // Search by doctor name
        filter.name = new RegExp(name as string, 'i');
      }
      
      const doctors = await Doctor.find(filter)
        .populate('user', '-password')
        .populate('specialization');
      
      return res.status(200).json(doctors);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching doctors', details: err.message });
    }
  };
}
