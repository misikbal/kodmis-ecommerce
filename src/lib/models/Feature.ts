import mongoose, { Document, Schema } from 'mongoose';

export interface IFeatureOption {
  label: string;
  value: string;
  color?: string;
  sortOrder: number;
}

export interface IFeature extends Document {
  name: string;
  slug: string;
  description?: string;
  type: 'TEXT' | 'NUMBER' | 'COLOR' | 'DROPDOWN' | 'CHECKBOX' | 'RADIO';
  isRequired: boolean;
  isFilterable: boolean;
  isSearchable: boolean;
  options?: IFeatureOption[];
  unit?: string;
  minValue?: number;
  maxValue?: number;
  defaultValue?: string;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const FeatureOptionSchema = new Schema<IFeatureOption>({
  label: {
    type: String,
    required: true,
    trim: true,
  },
  value: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const FeatureSchema = new Schema<IFeature>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ['TEXT', 'NUMBER', 'COLOR', 'DROPDOWN', 'CHECKBOX', 'RADIO'],
    required: true,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isFilterable: {
    type: Boolean,
    default: true,
  },
  isSearchable: {
    type: Boolean,
    default: false,
  },
  options: [FeatureOptionSchema],
  unit: {
    type: String,
    trim: true,
  },
  minValue: {
    type: Number,
  },
  maxValue: {
    type: Number,
  },
  defaultValue: {
    type: String,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  productCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Indexes
FeatureSchema.index({ slug: 1 });
FeatureSchema.index({ type: 1 });
FeatureSchema.index({ isActive: 1 });
FeatureSchema.index({ isFilterable: 1 });
FeatureSchema.index({ sortOrder: 1 });

export default mongoose.models.Feature || mongoose.model<IFeature>('Feature', FeatureSchema);
