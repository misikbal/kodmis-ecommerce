import mongoose from 'mongoose';

export interface IShipping extends mongoose.Document {
  orderId: mongoose.Types.ObjectId;
  carrierId: mongoose.Types.ObjectId;
  trackingNumber?: string;
  status: 'PENDING' | 'PREPARING' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';
  shippingMethod: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  cost: number;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const shippingSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  carrierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShippingCarrier',
    required: true
  },
  trackingNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['PENDING', 'PREPARING', 'IN_TRANSIT', 'DELIVERED', 'RETURNED', 'CANCELLED'],
    default: 'PENDING'
  },
  shippingMethod: {
    type: String,
    required: true
  },
  weight: {
    type: Number
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  cost: {
    type: Number,
    required: true
  },
  estimatedDeliveryDate: {
    type: Date
  },
  actualDeliveryDate: {
    type: Date
  },
  notes: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

const Shipping = mongoose.models.Shipping || mongoose.model<IShipping>('Shipping', shippingSchema);

export default Shipping;

