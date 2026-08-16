import { Router } from "express";
import * as cartController from "../controllers/cart.controller.js";
import {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} from "../validators/cart.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware as any);

router.get("/", cartController.getCart);
router.post("/add", addToCartValidator, cartController.addToCart);
router.put(
  "/update/:productId",
  updateCartItemValidator,
  cartController.updateCartItem
);
router.delete(
  "/remove/:productId",
  removeCartItemValidator,
  cartController.removeFromCart
);
router.delete("/clear", cartController.clearCart);

export default router;
