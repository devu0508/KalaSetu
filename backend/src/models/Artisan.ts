import mongoose from "mongoose";
import type { IArtisan } from "../types/index.js";

const artisanSchema = new mongoose.Schema<IArtisan>(
  {
    name: {
      type: String,
      required: [true, "Artisan name is required"],
      trim: true,
      maxlength: 150,
    },
    bio: {
      type: String,
      required: [true, "Bio is required"],
      maxlength: 500,
    },
    story: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    craft: {
      type: String,
      required: [true, "Craft/category is required"],
      trim: true,
    },
    location: {
      city: { type: String, default: "" },
      state: { type: String, default: "" },
    },
    profileImage: {
      type: String,
      default: "",
    },
    coverImage: {
      type: String,
      default: "",
    },
    since: {
      type: Number,
      default: new Date().getFullYear(),
    },
    featured: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
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

artisanSchema.index({ name: "text", bio: "text", craft: 1, featured: 1 });

const Artisan = mongoose.model<IArtisan>("Artisan", artisanSchema);

export default Artisan;
