import mongoose from 'mongoose';

export interface IMarketplace extends mongoose.Document {
  name: string;
  slug: string;
  logo: string;
  website: string;
  isActive: boolean;
  isConnected: boolean;
  lastSyncDate?: Date;
  syncStatus: 'SUCCESS' | 'ERROR' | 'PENDING' | 'DISABLED';
  errorCount: number;
  productCount: number;
  orderCount: number;
  totalSales: number;
  commissionRate: number;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  settings: {
  autoSync: boolean;
    syncInterval: number;
    priceMarkup: number;
  stockSync: boolean;
  orderSync: boolean;
  imageSync: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceSchema = new mongoose.Schema({
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
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  lastSyncDate: {
    type: Date
  },
  syncStatus: {
    type: String,
    enum: ['SUCCESS', 'ERROR', 'PENDING', 'DISABLED'],
    default: 'DISABLED'
  },
  errorCount: {
    type: Number,
    default: 0
  },
  productCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  commissionRate: {
    type: Number,
    default: 0
  },
  apiKey: {
    type: String
  },
  apiSecret: {
    type: String
  },
  webhookUrl: {
    type: String
  },
  settings: {
    autoSync: { type: Boolean, default: false },
    syncInterval: { type: Number, default: 60 },
    priceMarkup: { type: Number, default: 15 },
    stockSync: { type: Boolean, default: true },
    orderSync: { type: Boolean, default: true },
    imageSync: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

const Marketplace = mongoose.models.Marketplace || mongoose.model<IMarketplace>('Marketplace', marketplaceSchema);

export default Marketplace;
