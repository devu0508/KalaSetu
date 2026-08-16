import Artisan from "../models/Artisan.js";
import ApiError from "../utils/ApiError.js";
import type { IArtisan } from "../types/index.js";

interface ListArtisansOptions {
  page?: number;
  limit?: number;
  craft?: string;
  featured?: boolean;
}

interface ListArtisansResult {
  artisans: IArtisan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * List artisans with optional filtering and pagination.
 */
export const listArtisans = async ({
  page = 1,
  limit = 12,
  craft,
  featured,
}: ListArtisansOptions): Promise<ListArtisansResult> => {
  const filter: Record<string, unknown> = {};

  if (craft) {
    filter.craft = { $regex: new RegExp(`^${craft}$`, "i") };
  }
  if (featured !== undefined) {
    filter.featured = featured;
  }

  const skip = (page - 1) * limit;

  const [artisans, total] = await Promise.all([
    Artisan.find(filter)
      .populate("products", "name images price formattedPrice category ratings glbAsset")
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Artisan.countDocuments(filter),
  ]);

  return {
    artisans,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single artisan by ID with their products.
 */
export const getArtisanById = async (id: string): Promise<IArtisan> => {
  const artisan = await Artisan.findById(id).populate(
    "products",
    "name images price formattedPrice category ratings glbAsset description stock"
  );
  if (!artisan) {
    throw new ApiError(404, "Artisan not found");
  }
  return artisan;
};

/**
 * Create a new artisan (admin only).
 */
export const createArtisan = async (data: Partial<IArtisan>): Promise<IArtisan> => {
  const artisan = await Artisan.create(data);
  return artisan;
};

/**
 * Update an artisan by ID (admin only).
 */
export const updateArtisan = async (id: string, data: Partial<IArtisan>): Promise<IArtisan> => {
  const artisan = await Artisan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!artisan) {
    throw new ApiError(404, "Artisan not found");
  }
  return artisan;
};

/**
 * Delete an artisan by ID (admin only).
 */
export const deleteArtisan = async (id: string): Promise<IArtisan> => {
  const artisan = await Artisan.findByIdAndDelete(id);
  if (!artisan) {
    throw new ApiError(404, "Artisan not found");
  }
  return artisan;
};
