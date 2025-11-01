import mongoose from 'mongoose';

export interface IMarketplaceSyncLog extends mongoose.Document {
  marketplaceId: mongoose.Types.ObjectId;
  type: 'PRODUCT' | 'ORDER' | 'STOCK' | 'PRICE';
  status: 'SUCCESS' | 'ERROR' | 'PENDING';
  itemsProcessed: number;
  itemsSuccessful: number;
  itemsFailed: number;
  errorMessage?: string;
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceSyncLogSchema = new mongoose.Schema({
  marketplaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Marketplace',
    required: true
  },
  type: {
    type: String,
    enum: ['PRODUCT', 'ORDER', 'STOCK', 'PRICE'],
    required: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'ERROR', 'PENDING'],
    default: 'PENDING'
  },
  itemsProcessed: {
    type: Number,
    default: 0
  },
  itemsSuccessful: {
    type: Number,
    default: 0
  },
  itemsFailed: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  duration: {
    type: Number
  }
}, {
  timestamps: true
});

const MarketplaceSyncLog = mongoose.models.MarketplaceSyncLog || mongoose.model<IMarketplaceSyncLog>('MarketplaceSyncLog', marketplaceSyncLogSchema);

export default MarketplaceSyncLog;

