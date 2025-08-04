import { Request } from 'express';

export interface AuthRequest extends Request {
  user: {
    userId: string;
    role: string;
  };
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  role?: 'patient' | 'doctor' | 'admin';
  createdAt?: Date;
  updatedAt?: Date;
}
