import { Router } from "express";
import * as wishlistController from "../controllers/wishlist.controller.js";
import { wishlistParamValidator } from "../validators/wishlist.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware as any);

router.get("/", wishlistController.getWishlist);
router.post(
  "/add/:productId",
  wishlistParamValidator,
  wishlistController.addToWishlist
);
router.delete(
  "/remove/:productId",
  wishlistParamValidator,
  wishlistController.removeFromWishlist
);

export default router;
