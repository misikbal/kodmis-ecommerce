import mongoose from 'mongoose';

export interface ICustomerSegment extends mongoose.Document {
  name: string;
  description: string;
  criteria: string;
  color: string;
  icon: string;
  customerCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customerSegmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: '#3B82F6'
  },
  icon: {
    type: String,
    default: 'Users'
  },
  customerCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const CustomerSegment = mongoose.models.CustomerSegment || mongoose.model<ICustomerSegment>('CustomerSegment', customerSegmentSchema);

export default CustomerSegment;


