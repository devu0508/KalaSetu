import { Router } from "express";
import * as chatController from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import artisanMiddleware from "../middlewares/artisan.middleware.js";

const router = Router();

// All chat routes require authentication + artisan role
router.use(authMiddleware as any);
router.use(artisanMiddleware as any);

router.post("/", chatController.sendMessage);

export default router;
