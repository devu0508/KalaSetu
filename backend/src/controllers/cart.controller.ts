import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as cartService from "../services/cart.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * GET /api/cart
 */
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const cart = await cartService.getCart(authReq.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, cart.toJSON(), "Cart fetched successfully"));
});

/**
 * POST /api/cart/add
 */
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(authReq.user.id, { productId, quantity });

  res
    .status(200)
    .json(new ApiResponse(200, cart.toJSON(), "Item added to cart"));
});

/**
 * PUT /api/cart/update/:productId
 */
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const productId = req.params.productId as string;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(authReq.user.id, productId, quantity);

  res
    .status(200)
    .json(new ApiResponse(200, cart.toJSON(), "Cart item updated"));
});

/**
 * DELETE /api/cart/remove/:productId
 */
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const cart = await cartService.removeFromCart(authReq.user.id, req.params.productId as string);

  res
    .status(200)
    .json(new ApiResponse(200, cart.toJSON(), "Item removed from cart"));
});

/**
 * DELETE /api/cart/clear
 */
export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const cart = await cartService.clearCart(authReq.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, cart.toJSON(), "Cart cleared"));
});
