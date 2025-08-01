import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import { BaseController } from './base.controller';
import { IPatient } from '../models/interfaces';
import { AuthRequest } from '../types/express';
import User from '../models/user.model';

export class PatientController extends BaseController<IPatient> {
  constructor() {
    super(Patient);
  }

  // Create patient profile for the current user
  createMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      // Check if user already has a patient profile
      const existingProfile = await Patient.findOne({ user: userId });
      
      if (existingProfile) {
        return res.status(400).json({ error: 'Patient profile already exists for this user' });
      }
      
      // Check if user exists and has the right role
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (user.role !== 'patient') {
        return res.status(403).json({ error: 'Only users with patient role can create a patient profile' });
      }

      // Create patient profile
      const newProfile = await Patient.create({
        ...req.body,
        user: userId
      });

      return res.status(201).json(newProfile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error creating patient profile', details: err.message });
    }
  };

  // Get current user's patient profile
  getMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      const profile = await Patient.findOne({ user: userId }).populate('user', '-password');
      
      if (!profile) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      
      return res.status(200).json(profile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching patient profile', details: err.message });
    }
  };

  // Update current user's patient profile
  updateMyProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      
      const updatedProfile = await Patient.findOneAndUpdate(
        { user: userId },
        { $set: req.body },
        { new: true, runValidators: true }
      );
      
      if (!updatedProfile) {
        return res.status(404).json({ error: 'Patient profile not found' });
      }
      
      return res.status(200).json(updatedProfile);
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating patient profile', details: err.message });
    }
  };
}
