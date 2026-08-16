import { validationResult } from "express-validator";
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import * as artisanService from "../services/artisan.service.js";

/**
 * GET /api/artisans
 */
export const listArtisans = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, craft, featured } = req.query;

  const result = await artisanService.listArtisans({
    page: parseInt(page as string, 10) || 1,
    limit: parseInt(limit as string, 10) || 12,
    craft: craft as string | undefined,
    featured: featured === "true" ? true : featured === "false" ? false : undefined,
  });

  res.status(200).json(new ApiResponse(200, result, "Artisans fetched successfully"));
});

/**
 * GET /api/artisans/:id
 */
export const getArtisan = asyncHandler(async (req: Request, res: Response) => {
  const artisan = await artisanService.getArtisanById(req.params.id as string);

  res.status(200).json(new ApiResponse(200, artisan.toJSON(), "Artisan fetched successfully"));
});

/**
 * POST /api/artisans (admin only)
 */
export const createArtisan = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const artisan = await artisanService.createArtisan(req.body);

  res.status(201).json(new ApiResponse(201, artisan.toJSON(), "Artisan created successfully"));
});

/**
 * PUT /api/artisans/:id (admin only)
 */
export const updateArtisan = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(422, "Validation failed", errors.array());
  }

  const artisan = await artisanService.updateArtisan(req.params.id as string, req.body);

  res.status(200).json(new ApiResponse(200, artisan.toJSON(), "Artisan updated successfully"));
});

/**
 * DELETE /api/artisans/:id (admin only)
 */
export const deleteArtisan = asyncHandler(async (req: Request, res: Response) => {
  await artisanService.deleteArtisan(req.params.id as string);

  res.status(200).json(new ApiResponse(200, null, "Artisan deleted successfully"));
});
