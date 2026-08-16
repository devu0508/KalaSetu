import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as productService from "../services/product.service.js";

/**
 * GET /api/products
 */
export const listProducts = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const { page, limit, category, search, sort } = req.query;
  const result = await productService.listProducts({
    page: parseInt(page as string, 10) || 1,
    limit: parseInt(limit as string, 10) || 12,
    category: category as string | undefined,
    search: search as string | undefined,
    sort: sort as string | undefined,
  });

  res
    .status(200)
    .json(
      new ApiResponse(200, result, "Products fetched successfully")
    );
});

/**
 * GET /api/products/:id
 */
export const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);

  res
    .status(200)
    .json(new ApiResponse(200, product.toJSON(), "Product fetched successfully"));
});

/**
 * POST /api/products (admin only)
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const product = await productService.createProduct(req.body);

  res
    .status(201)
    .json(new ApiResponse(201, product.toJSON(), "Product created successfully"));
});

/**
 * PUT /api/products/:id (admin only)
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const product = await productService.updateProduct(req.params.id as string, req.body);

  res
    .status(200)
    .json(new ApiResponse(200, product.toJSON(), "Product updated successfully"));
});

/**
 * DELETE /api/products/:id (admin only)
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id as string);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
