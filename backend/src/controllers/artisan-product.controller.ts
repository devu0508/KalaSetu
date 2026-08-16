import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import Product from "../models/Product.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * GET /api/artisan/products
 * List all products belonging to the authenticated artisan.
 */
export const listMyProducts = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  const products = await Product.find({ userId: authReq.user.id })
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, { products }, "Artisan products fetched successfully"));
});

/**
 * POST /api/artisan/products
 * Create a new product owned by the authenticated artisan.
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { name, description, price, category, images, stock } = req.body;

  if (!name || !price || !category) {
    throw new ApiError(400, "Name, price, and category are required");
  }

  const product = await Product.create({
    name,
    description: description || "",
    price,
    category,
    images: images || [],
    stock: stock || 0,
    userId: authReq.user.id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, product.toJSON(), "Product created successfully"));
});

/**
 * PUT /api/artisan/products/:id
 * Update a product — only if it belongs to the authenticated artisan.
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = req.params;

  const product = await Product.findOne({ _id: id, userId: authReq.user.id });
  if (!product) {
    throw new ApiError(404, "Product not found or not owned by you");
  }

  const allowedFields = ["name", "description", "price", "category", "images", "stock"] as const;
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      (product as any)[field] = req.body[field];
    }
  }

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product.toJSON(), "Product updated successfully"));
});

/**
 * DELETE /api/artisan/products/:id
 * Delete a product — only if it belongs to the authenticated artisan.
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const { id } = req.params;

  const product = await Product.findOneAndDelete({
    _id: id,
    userId: authReq.user.id,
  });

  if (!product) {
    throw new ApiError(404, "Product not found or not owned by you");
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
