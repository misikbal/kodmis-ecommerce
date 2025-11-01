import mongoose, { Schema, models, model } from 'mongoose';

export interface IBrand {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  bannerImage?: string;
  website?: string;
  isActive: boolean;
  country?: string;
  foundedYear?: number;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    logo: { type: String },
    bannerImage: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
    country: { type: String },
    foundedYear: { type: Number },
    sortOrder: { type: Number, default: 0 },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String
    }
  },
  {
    timestamps: true
  }
);

const Brand = models.Brand || model<IBrand>('Brand', BrandSchema);

export default Brand;