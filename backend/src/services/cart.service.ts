import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import type { ICart } from "../types/index.js";

/**
 * Get or create the cart for a user.
 */
const getOrCreateCart = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

/**
 * Get the user's cart with populated product details and computed total.
 */
export const getCart = async (userId: string): Promise<ICart> => {
  let cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "name price images glbAsset category stock",
  });

  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }

  return cart;
};

/**
 * Add an item to the cart. Validates stock before adding.
 * If the product is already in the cart, increments quantity.
 */
export const addToCart = async (
  userId: string,
  { productId, quantity }: { productId: string; quantity: number }
): Promise<ICart> => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const cart = await getOrCreateCart(userId);

  // Check if product already exists in cart
  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId
  );

  const totalQty = existingItem
    ? existingItem.quantity + quantity
    : quantity;

  // Validate stock
  if (totalQty > product.stock) {
    throw new ApiError(
      400,
      `Insufficient stock. Available: ${product.stock}, Requested: ${totalQty}`
    );
  }

  if (existingItem) {
    existingItem.quantity = totalQty;
    existingItem.priceAtAdd = product.price; // update snapshot to current price
  } else {
    cart.items.push({
      productId: product._id,
      quantity,
      priceAtAdd: product.price,
    } as any);
  }

  await cart.save();

  // Return populated cart
  return getCart(userId);
};

/**
 * Update the quantity of a specific item in the cart.
 */
export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<ICart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const item = cart.items.find(
    (item) => item.productId.toString() === productId
  );
  if (!item) {
    throw new ApiError(404, "Item not found in cart");
  }

  // Validate stock
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product no longer exists");
  }
  if (quantity > product.stock) {
    throw new ApiError(
      400,
      `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`
    );
  }

  item.quantity = quantity;
  item.priceAtAdd = product.price; // refresh price snapshot
  await cart.save();

  return getCart(userId);
};

/**
 * Remove a specific item from the cart.
 */
export const removeFromCart = async (
  userId: string,
  productId: string
): Promise<ICart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  ) as typeof cart.items;

  if (cart.items.length === initialLength) {
    throw new ApiError(404, "Item not found in cart");
  }

  await cart.save();

  return getCart(userId);
};

/**
 * Clear all items from the cart.
 */
export const clearCart = async (userId: string): Promise<ICart> => {
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  cart.items = [] as any;
  await cart.save();

  return cart;
};
