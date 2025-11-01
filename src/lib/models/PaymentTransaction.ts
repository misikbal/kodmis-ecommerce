import mongoose from 'mongoose';

export interface IPaymentTransaction extends mongoose.Document {
  orderId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  type: 'PAYMENT' | 'REFUND' | 'CHARGEBACK' | 'REVERSAL';
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  amount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'WALLET' | 'OTHER';
  provider: string; // Stripe, PayPal, etc.
  transactionId: string;
  referenceId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['PAYMENT', 'REFUND', 'CHARGEBACK', 'REVERSAL'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED'],
    default: 'PENDING'
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'TRY'
  },
  paymentMethod: {
    type: String,
    enum: ['CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'WALLET', 'OTHER'],
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  referenceId: {
    type: String
  },
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const PaymentTransaction = mongoose.models.PaymentTransaction || mongoose.model<IPaymentTransaction>('PaymentTransaction', paymentTransactionSchema);

export default PaymentTransaction;

