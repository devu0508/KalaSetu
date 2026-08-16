import { Router } from "express";
import * as artisanController from "../controllers/artisan.controller.js";
import {
  createArtisanValidator,
  updateArtisanValidator,
} from "../validators/artisan.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const router = Router();

// Public routes
router.get("/", artisanController.listArtisans);
router.get("/:id", artisanController.getArtisan);

// Admin only
router.post(
  "/",
  authMiddleware as any,
  adminMiddleware as any,
  createArtisanValidator,
  artisanController.createArtisan
);
router.put(
  "/:id",
  authMiddleware as any,
  adminMiddleware as any,
  updateArtisanValidator,
  artisanController.updateArtisan
);
router.delete(
  "/:id",
  authMiddleware as any,
  adminMiddleware as any,
  artisanController.deleteArtisan
);

export default router;
