import mongoose from 'mongoose';

export interface IPaymentPayout extends mongoose.Document {
  marketplaceId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  payoutMethod: 'BANK_TRANSFER' | 'PAYPAL' | 'STRIPE' | 'OTHER';
  accountDetails: {
    accountNumber?: string;
    iban?: string;
    bankName?: string;
    beneficiaryName?: string;
  };
  referenceId?: string;
  description?: string;
  scheduledDate?: Date;
  processedDate?: Date;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentPayoutSchema = new mongoose.Schema({
  marketplaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marketplace'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TRY'
  },
  status: {
    type: String,
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  payoutMethod: {
    type: String,
    enum: ['BANK_TRANSFER', 'PAYPAL', 'STRIPE', 'OTHER'],
    required: true
  },
  accountDetails: {
    accountNumber: String,
    iban: String,
    bankName: String,
    beneficiaryName: String
  },
  referenceId: {
    type: String,
    unique: true,
    sparse: true
  },
  description: {
    type: String
  },
  scheduledDate: {
    type: Date
  },
  processedDate: {
    type: Date
  },
  failureReason: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const PaymentPayout = mongoose.models.PaymentPayout || mongoose.model<IPaymentPayout>('PaymentPayout', paymentPayoutSchema);

export default PaymentPayout;

