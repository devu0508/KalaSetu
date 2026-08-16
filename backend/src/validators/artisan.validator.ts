import { body } from "express-validator";

export const createArtisanValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 150 })
    .withMessage("Name cannot exceed 150 characters"),

  body("bio")
    .trim()
    .notEmpty()
    .withMessage("Bio is required")
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("craft")
    .trim()
    .notEmpty()
    .withMessage("Craft/category is required"),

  body("story")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Story cannot exceed 5000 characters"),

  body("since")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Since must be a valid year"),

  body("featured")
    .optional()
    .isBoolean()
    .withMessage("Featured must be a boolean"),

  body("location.city").optional().isString(),
  body("location.state").optional().isString(),
  body("profileImage").optional().isURL().withMessage("Profile image must be a valid URL"),
  body("coverImage").optional().isURL().withMessage("Cover image must be a valid URL"),
];

export const updateArtisanValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage("Name cannot exceed 150 characters"),

  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("story")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Story cannot exceed 5000 characters"),

  body("since")
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() })
    .withMessage("Since must be a valid year"),

  body("featured").optional().isBoolean(),
  body("profileImage").optional().isURL(),
  body("coverImage").optional().isURL(),
];
