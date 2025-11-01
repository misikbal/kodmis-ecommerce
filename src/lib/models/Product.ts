import mongoose, { Document, Schema } from 'mongoose';

export interface IProductImage {
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface IProductVariant {
  name: string;
  sku?: string;
  price?: number;
  quantity: number;
  options: Record<string, any>;
  image?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description?: string;
  content?: string;
  type: 'PHYSICAL' | 'DIGITAL' | 'SERVICE';
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  price: number;
  comparePrice?: number;
  costPrice?: number;
  sku?: string;
  trackQuantity: boolean;
  quantity: number;
  lowStockAlert: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  downloadUrl?: string;
  downloadLimit?: number;
  images: IProductImage[];
  categoryId?: mongoose.Types.ObjectId;
  brandId?: mongoose.Types.ObjectId;
  storeId?: mongoose.Types.ObjectId;
  hasVariants: boolean;
  variants: IProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  tags: string[];
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  viewCount: number;
  salesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductImageSchema = new Schema<IProductImage>({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const ProductVariantSchema = new Schema<IProductVariant>({
  name: {
    type: String,
    required: true,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  options: {
    type: Schema.Types.Mixed,
    required: true,
  },
  image: {
    type: String,
  },
});

const ProductSchema = new Schema<IProduct>({
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
  content: {
    type: String,
  },
  type: {
    type: String,
    enum: ['PHYSICAL', 'DIGITAL', 'SERVICE'],
    default: 'PHYSICAL',
  },
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
    default: 'DRAFT',
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  comparePrice: {
    type: Number,
    min: 0,
  },
  costPrice: {
    type: Number,
    min: 0,
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  trackQuantity: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  lowStockAlert: {
    type: Number,
    default: 5,
    min: 0,
  },
  weight: {
    type: Number,
    min: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  downloadUrl: {
    type: String,
  },
  downloadLimit: {
    type: Number,
    min: 0,
  },
  images: [ProductImageSchema],
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  brandId: {
    type: Schema.Types.ObjectId,
    ref: 'Brand',
  },
  storeId: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
  hasVariants: {
    type: Boolean,
    default: false,
  },
  variants: [ProductVariantSchema],
  seoTitle: {
    type: String,
    trim: true,
  },
  seoDescription: {
    type: String,
    trim: true,
  },
  seoKeywords: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isBestseller: {
    type: Boolean,
    default: false,
  },
  isNew: {
    type: Boolean,
    default: false,
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  salesCount: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

// Indexes
ProductSchema.index({ slug: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ categoryId: 1 });
ProductSchema.index({ storeId: 1 });
ProductSchema.index({ status: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isFeatured: 1 });
ProductSchema.index({ isBestseller: 1 });
ProductSchema.index({ isNew: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);