import { param } from "express-validator";

export const wishlistParamValidator = [
  param("productId")
    .isMongoId()
    .withMessage("Invalid product ID"),
];
