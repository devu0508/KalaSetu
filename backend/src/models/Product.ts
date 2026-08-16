import mongoose from "mongoose";
import type { IProduct } from "../types/index.js";

const productSchema = new mongoose.Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    glbAsset: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// ── Virtuals ──────────────────────────────────────────────────────

/** Convenience alias: returns the first image in the array */
productSchema.virtual("image").get(function (this: IProduct) {
  return this.images?.[0] || "";
});

/**
 * Indian-rupee formatted price string, matching the frontend's display.
 * e.g. 2400 → "₹2,400"
 */
productSchema.virtual("formattedPrice").get(function (this: IProduct) {
  return `₹${this.price.toLocaleString("en-IN")}`;
});

// ── Text index for search ─────────────────────────────────────────
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });

const Product = mongoose.model<IProduct>("Product", productSchema);

export default Product;
