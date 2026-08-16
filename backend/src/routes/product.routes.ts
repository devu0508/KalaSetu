import { Router } from "express";
import * as productController from "../controllers/product.controller.js";
import {
  createProductValidator,
  updateProductValidator,
  listProductsValidator,
} from "../validators/product.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

// Public
router.get("/", listProductsValidator, productController.listProducts);
router.get("/:id", productController.getProduct);

// Admin only
router.post(
  "/",
  authMiddleware as any,
  adminMiddleware as any,
  createProductValidator,
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware as any,
  adminMiddleware as any,
  updateProductValidator,
  productController.updateProduct
);
router.delete(
  "/:id",
  authMiddleware as any,
  adminMiddleware as any,
  productController.deleteProduct
);

export default router;
