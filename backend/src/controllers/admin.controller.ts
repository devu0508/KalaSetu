import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Artisan from "../models/Artisan.js";

/**
 * GET /api/admin/stats
 * Platform overview statistics.
 */
export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalUsers, totalArtisans, totalProducts, totalAdmins] =
    await Promise.all([
      User.countDocuments(),
      Artisan.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: "admin" }),
    ]);

  const totalCustomers = await User.countDocuments({ role: "customer" });
  const totalArtisanUsers = await User.countDocuments({ role: "artisan" });
  const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

  // Get unique categories
  const categories = await Product.distinct("category");

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalUsers,
        totalCustomers,
        totalArtisanUsers,
        totalAdmins,
        totalArtisans,
        totalProducts,
        verifiedUsers,
        categories,
      },
      "Stats fetched successfully"
    )
  );
});

/**
 * GET /api/admin/users
 * List users with search, role filter, and pagination.
 */
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
  const skip = (page - 1) * limit;
  const search = (req.query.search as string) || "";
  const role = req.query.role as string;

  const filter: Record<string, any> = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role && ["customer", "artisan", "admin"].includes(role)) {
    filter.role = role;
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        users: users.map((u) => u.toJSON()),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      "Users fetched successfully"
    )
  );
});

/**
 * PATCH /api/admin/users/:id/role
 * Update a user's role.
 */
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !["customer", "artisan", "admin"].includes(role)) {
    throw new ApiError(400, "Invalid role. Must be 'customer', 'artisan', or 'admin'");
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, user.toJSON(), `User role updated to ${role}`));
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user account.
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot delete the last admin account");
    }
  }

  await User.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product.
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Remove product reference from artisan
  if (product.artisan) {
    await Artisan.findByIdAndUpdate(product.artisan, {
      $pull: { products: product._id },
    });
  }

  await Product.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});
