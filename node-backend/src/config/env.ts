// Environment variables configuration
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

// Define the path to the .env file
const envPath = path.join(process.cwd(), '.env');

// Check if .env file exists
if (!fs.existsSync(envPath)) {
  console.error('.env file not found! Please create one based on .env.example');
  process.exit(1);
}

// Load environment variables from .env file
dotenv.config({ path: envPath });

// Make sure required environment variables are set
const requiredEnvVars = [
  'MONGODB_URI', 
  'JWT_SECRET'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Utility functions for encryption/decryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decrypt = (text: string): string => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts[0], 'hex');
  const encryptedText = Buffer.from(textParts[1], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

export default {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/apptlinker-hub',
  JWT_SECRET: process.env.JWT_SECRET || 'default-jwt-secret-key-not-secure',
  JWT_EXPIRE: parseInt(process.env.JWT_EXPIRE || '86400', 10),
  ENCRYPTION_KEY,
};
