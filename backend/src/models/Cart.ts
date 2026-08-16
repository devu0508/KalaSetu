import mongoose from "mongoose";
import type { ICart, ICartItem } from "../types/index.js";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    priceAtAdd: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema<ICart>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
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

// ── Virtual: server-side total ────────────────────────────────────
cartSchema.virtual("total").get(function (this: ICart) {
  return this.items.reduce(
    (sum: number, item) => sum + item.quantity * item.priceAtAdd,
    0
  );
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
