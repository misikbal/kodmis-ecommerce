import mongoose, { Document, Schema } from 'mongoose';

export interface IStockMovement extends Document {
  productId: mongoose.Types.ObjectId;
  type: 'in' | 'out' | 'transfer' | 'adjustment';
  quantity: number;
  warehouse?: string;
  reference?: string;
  notes?: string;
  createdBy?: string;
  previousStock: number;
  newStock: number;
  createdAt: Date;
  updatedAt: Date;
}

const StockMovementSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    type: {
      type: String,
      enum: ['in', 'out', 'transfer', 'adjustment'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    warehouse: {
      type: String,
      default: 'Ana Depo'
    },
    reference: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    createdBy: {
      type: String,
      default: 'Admin'
    },
    previousStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent re-compilation during hot reload
const StockMovement = mongoose.models.StockMovement || mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);

export default StockMovement;

