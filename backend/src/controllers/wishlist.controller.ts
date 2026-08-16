import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as wishlistService from "../services/wishlist.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * GET /api/wishlist
 */
export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const wishlist = await wishlistService.getWishlist(authReq.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, wishlist.toJSON(), "Wishlist fetched successfully"));
});

/**
 * POST /api/wishlist/add/:productId
 */
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const wishlist = await wishlistService.addToWishlist(
    authReq.user.id,
    req.params.productId as string
  );

  res
    .status(200)
    .json(new ApiResponse(200, wishlist.toJSON(), "Product added to wishlist"));
});

/**
 * DELETE /api/wishlist/remove/:productId
 */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const wishlist = await wishlistService.removeFromWishlist(
    authReq.user.id,
    req.params.productId as string
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, wishlist.toJSON(), "Product removed from wishlist")
    );
});
