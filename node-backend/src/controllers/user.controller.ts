import { Request, Response } from 'express';
import User from '../models/user.model';
import { BaseController } from './base.controller';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthRequest, UserProfile } from '../types/express';
import { IUser } from '../models/interfaces';

export class UserController extends BaseController<IUser> {
  constructor() {
    super(User);
  }

  // Register a new user
  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { username, email, password, role, firstName, lastName } = req.body;
      
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }
      
      // Check if username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ error: 'Username is already taken' });
      }

      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password, // password will be hashed by the pre-save hook
        role,
        firstName,
        lastName
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        user: {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        },
        token
      });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  };

  // Login user
  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      // Find user by email and validate password
      const user = await User.findByCredentials(email, password);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid login credentials' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token
      });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(401).json({ error: 'Authentication failed', details: err.message });
    }
  };

  // Get current user profile
  getProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      // req.user will be set by auth middleware
      const userId = (req as AuthRequest).user.userId;
      
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json({ user });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error fetching profile', details: err.message });
    }
  };

  // Update user profile
  updateProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = (req as AuthRequest).user.userId;
      const { firstName, lastName, email } = req.body;
      
      // Don't allow password updates through this endpoint
      const updates: UserProfile = {};
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (email) updates.email = email;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json({ user: updatedUser });
    } catch (error: unknown) {
      const err = error as Error;
      return res.status(500).json({ error: 'Error updating profile', details: err.message });
    }
  };
}
