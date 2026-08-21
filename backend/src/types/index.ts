import type { Request } from "express";
import type { Document, Types } from "mongoose";

// ── Address ───────────────────────────────────────────────────────
export interface IAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// ── User ──────────────────────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string | null;
  avatar: string;
  phone: string;
  address: IAddress;
  googleId: string | null;
  role: "customer" | "artisan" | "admin";
  refreshToken: string | null;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ── Product ───────────────────────────────────────────────────────
export interface IProductRatings {
  average: number;
  count: number;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  glbAsset: string;
  stock: number;
  ratings: IProductRatings;
  artisan?: Types.ObjectId | IArtisan;
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  /** Virtual: first image in the array */
  image: string;
  /** Virtual: Indian-rupee formatted price string */
  formattedPrice: string;
}

// ── Artisan ───────────────────────────────────────────────────────
export interface IArtisan extends Document {
  _id: Types.ObjectId;
  name: string;
  bio: string;
  story: string;
  craft: string;
  location: { city: string; state: string };
  profileImage: string;
  coverImage: string;
  since: number;
  featured: boolean;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ── Cart ──────────────────────────────────────────────────────────
export interface ICartItem {
  productId: Types.ObjectId;
  quantity: number;
  priceAtAdd: number;
}

export interface ICart extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  items: Types.DocumentArray<ICartItem & Document>;
  createdAt: Date;
  updatedAt: Date;
  /** Virtual: server-side computed total */
  total: number;
}

// ── Wishlist ──────────────────────────────────────────────────────
export interface IWishlist extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  products: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// ── JWT / Auth ────────────────────────────────────────────────────
export interface JwtPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: string;
  };
}

// ── Environment Config ────────────────────────────────────────────
export interface EnvConfig {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  jwtAccessExpiresIn: string;
  jwtRefreshExpiresIn: string;
  googleClientId: string;
  googleClientSecret: string;
  googleCallbackUrl: string;
  frontendOrigin: string;
  geminiApiKey: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
}
