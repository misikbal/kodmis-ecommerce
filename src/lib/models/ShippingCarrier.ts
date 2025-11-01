import mongoose from 'mongoose';

export interface IShippingCarrier extends mongoose.Document {
  name: string;
  slug: string;
  logo: string;
  website?: string;
  isActive: boolean;
  apiKey?: string;
  apiSecret?: string;
  apiEndpoint?: string;
  trackingUrl?: string;
  trackingEndpoint?: string;
  supportedServices: Array<{
    name: string;
    code: string;
    description?: string;
  }>;
  pricing: {
    weightUnit: 'KG' | 'GR';
    dimensionUnit: 'CM' | 'M';
    basePrice: number;
    pricePerKg?: number;
    minimumPrice: number;
  };
  settings: {
    allowCod: boolean;
    allowInsurance: boolean;
    allowPickup: boolean;
    autoTracking: boolean;
  };
  integrationStatus: 'CONNECTED' | 'DISCONNECTED' | 'ERROR';
  lastSyncDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const shippingCarrierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  apiKey: {
    type: String
  },
  apiSecret: {
    type: String
  },
  apiEndpoint: {
    type: String
  },
  trackingUrl: {
    type: String
  },
  trackingEndpoint: {
    type: String
  },
  supportedServices: [{
    name: String,
    code: String,
    description: String
  }],
  pricing: {
    weightUnit: { type: String, enum: ['KG', 'GR'], default: 'KG' },
    dimensionUnit: { type: String, enum: ['CM', 'M'], default: 'CM' },
    basePrice: { type: Number, default: 0 },
    pricePerKg: { type: Number, default: 0 },
    minimumPrice: { type: Number, default: 0 }
  },
  settings: {
    allowCod: { type: Boolean, default: false },
    allowInsurance: { type: Boolean, default: false },
    allowPickup: { type: Boolean, default: false },
    autoTracking: { type: Boolean, default: false }
  },
  integrationStatus: {
    type: String,
    enum: ['CONNECTED', 'DISCONNECTED', 'ERROR'],
    default: 'DISCONNECTED'
  },
  lastSyncDate: {
    type: Date
  }
}, {
  timestamps: true
});

const ShippingCarrier = mongoose.models.ShippingCarrier || mongoose.model<IShippingCarrier>('ShippingCarrier', shippingCarrierSchema);

export default ShippingCarrier;

