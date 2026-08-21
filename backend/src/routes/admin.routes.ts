import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// All admin routes require authentication + admin role
router.use(authMiddleware as any);
router.use(adminMiddleware as any);

router.get("/stats", adminController.getStats as any);
router.get("/users", adminController.getUsers as any);
router.patch("/users/:id/role", adminController.updateUserRole as any);
router.delete("/users/:id", adminController.deleteUser as any);
router.delete("/products/:id", adminController.deleteProduct as any);

export default router;
