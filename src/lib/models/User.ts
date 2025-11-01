import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  role: 'ADMIN' | 'VENDOR' | 'CUSTOMER';
  isActive: boolean;
  isVerified: boolean;
  language: string;
  currency: string;
  timezone: string;
  hashedPassword?: string;
  loyaltyPoints: number;
  referralCode?: string;
  referredBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ['ADMIN', 'VENDOR', 'CUSTOMER'],
    default: 'CUSTOMER',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  language: {
    type: String,
    default: 'tr',
  },
  currency: {
    type: String,
    default: 'TRY',
  },
  timezone: {
    type: String,
    default: 'Europe/Istanbul',
  },
  hashedPassword: {
    type: String,
  },
  loyaltyPoints: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true,
  },
  referredBy: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ referralCode: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);