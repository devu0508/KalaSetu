import { Router } from "express";
import * as profileController from "../controllers/profile.controller.js";
import {
  updateProfileValidator,
  changePasswordValidator,
} from "../validators/profile.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = Router();

// All profile routes require authentication
router.use(authMiddleware as any);

router.get("/", profileController.getProfile);
router.put("/", updateProfileValidator, profileController.updateProfile);
router.put(
  "/password",
  changePasswordValidator,
  profileController.changePassword
);
router.post("/avatar", uploadAvatar as any, profileController.uploadAvatar);
router.delete("/", profileController.deleteProfile);

export default router;
