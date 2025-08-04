import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './interfaces';

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'],
      default: 'patient',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password
UserSchema.pre<IUser>('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with our new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Static method to find user by credentials
UserSchema.statics.findByCredentials = async function(email: string, password: string): Promise<IUser | null> {
  // Find user by email
  const user = await this.findOne({ email });
  
  if (!user) {
    return null;
  }
  
  // Check password
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return null;
  }
  
  return user;
};

// Add static methods to the model's interface
interface UserModel extends mongoose.Model<IUser> {
  findByCredentials(email: string, password: string): Promise<IUser | null>;
}

export default mongoose.model<IUser, UserModel>('User', UserSchema);
