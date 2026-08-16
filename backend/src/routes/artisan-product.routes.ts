import { Router } from "express";
import * as artisanProductController from "../controllers/artisan-product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import artisanMiddleware from "../middlewares/artisan.middleware.js";

const router = Router();

// All routes require authentication + artisan role
router.use(authMiddleware as any);
router.use(artisanMiddleware as any);

router.get("/", artisanProductController.listMyProducts);
router.post("/", artisanProductController.createProduct);
router.put("/:id", artisanProductController.updateProduct);
router.delete("/:id", artisanProductController.deleteProduct);

export default router;
