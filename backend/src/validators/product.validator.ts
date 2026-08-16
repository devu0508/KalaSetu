import { body, query } from "express-validator";

export const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ max: 200 })
    .withMessage("Name must be at most 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be at most 5000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("images.*")
    .optional()
    .trim()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  body("glbAsset")
    .optional()
    .trim(),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("ratings.average")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating average must be between 0 and 5"),

  body("ratings.count")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Rating count must be a non-negative integer"),
];

export const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty")
    .isLength({ max: 200 })
    .withMessage("Name must be at most 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage("Description must be at most 5000 characters"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array"),

  body("images.*")
    .optional()
    .trim()
    .isURL()
    .withMessage("Each image must be a valid URL"),

  body("glbAsset")
    .optional()
    .trim(),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
];

export const listProductsValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("category")
    .optional()
    .trim(),

  query("search")
    .optional()
    .trim(),

  query("sort")
    .optional()
    .trim()
    .isIn(["price_asc", "price_desc", "newest", "oldest", "name_asc", "name_desc"])
    .withMessage("Invalid sort option"),
];
