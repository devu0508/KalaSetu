import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import type { IProduct } from "../types/index.js";

interface ListProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}

interface ListProductsResult {
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * List products with pagination, filtering, and search.
 */
export const listProducts = async ({
  page = 1,
  limit = 12,
  category,
  search,
  sort = "newest",
}: ListProductsOptions): Promise<ListProductsResult> => {
  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  // Sort mapping
  const sortMap: Record<string, Record<string, 1 | -1>> = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  const sortOption = sortMap[sort] || sortMap.newest;

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("artisan", "name bio craft location profileImage since")
      .sort(sortOption)
      .skip(skip)
      .limit(limit),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single product by ID.
 */
export const getProductById = async (id: string): Promise<IProduct> => {
  const product = await Product.findById(id)
    .populate("artisan", "name bio craft location profileImage coverImage since story");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

/**
 * Create a new product (admin only).
 */
export const createProduct = async (data: Partial<IProduct>): Promise<IProduct> => {
  const product = await Product.create(data);
  return product;
};

/**
 * Update a product by ID (admin only).
 */
export const updateProduct = async (id: string, data: Partial<IProduct>): Promise<IProduct> => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

/**
 * Delete a product by ID (admin only).
 */
export const deleteProduct = async (id: string): Promise<IProduct> => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};
