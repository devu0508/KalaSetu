import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import type { IWishlist } from "../types/index.js";

/**
 * Get the user's wishlist with populated product details.
 */
export const getWishlist = async (userId: string): Promise<IWishlist> => {
  let wishlist = await Wishlist.findOne({ userId }).populate({
    path: "products",
    select: "name price images glbAsset category stock ratings",
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, products: [] });
  }

  return wishlist;
};

/**
 * Add a product to the wishlist. Prevents duplicates via $addToSet.
 */
export const addToWishlist = async (userId: string, productId: string): Promise<IWishlist> => {
  // Verify the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { products: productId } },
    { new: true, upsert: true }
  ).populate({
    path: "products",
    select: "name price images glbAsset category stock ratings",
  });

  return wishlist!;
};

/**
 * Remove a product from the wishlist.
 */
export const removeFromWishlist = async (userId: string, productId: string): Promise<IWishlist> => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    throw new ApiError(404, "Wishlist not found");
  }

  const initialLength = wishlist.products.length;
  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== productId
  ) as typeof wishlist.products;

  if (wishlist.products.length === initialLength) {
    throw new ApiError(404, "Product not found in wishlist");
  }

  await wishlist.save();

  // Return populated wishlist
  const populated = await Wishlist.findById(wishlist._id).populate({
    path: "products",
    select: "name price images glbAsset category stock ratings",
  });

  return populated!;
};
