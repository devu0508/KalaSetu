import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";
import { clearTokenCookies } from "../services/token.service.js";
import type { AuthenticatedRequest } from "../types/index.js";

/**
 * GET /api/profile
 */
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = await User.findById(authReq.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Profile fetched successfully"));
});

/**
 * PUT /api/profile
 * Update name, avatar, phone, address.
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const allowedFields = ["name", "avatar", "phone", "address"] as const;
  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  }

  const user = await User.findByIdAndUpdate(authReq.user.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Profile updated successfully"));
});

/**
 * PUT /api/profile/password
 * Change password (only for non-Google accounts).
 */
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const authReq = req as AuthenticatedRequest;
  const user = await User.findById(authReq.user.id).select("+password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.password) {
    throw new ApiError(
      400,
      "Cannot change password for a Google-only account. Set a password first via email/password signup."
    );
  }

  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

/**
 * DELETE /api/profile
 * Delete account + cascade cart and wishlist.
 */
export const deleteProfile = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.user.id;

  // Cascade delete cart and wishlist
  await Promise.all([
    Cart.findOneAndDelete({ userId }),
    Wishlist.findOneAndDelete({ userId }),
    User.findByIdAndDelete(userId),
  ]);

  clearTokenCookies(res);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Account deleted successfully"));
});

/**
 * POST /api/profile/avatar
 * Upload avatar image via multer, update user record.
 */
export const uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const avatarPath = `/uploads/avatars/${req.file.filename}`;

  const user = await User.findByIdAndUpdate(
    authReq.user.id,
    { avatar: avatarPath },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), "Avatar uploaded successfully"));
});
