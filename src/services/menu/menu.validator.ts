import { body } from "express-validator";

export const menuValidator = [
  body("name").isString().withMessage("Menu item name is required"),
  body("price")
    .isNumeric()
    .withMessage("Price is required and must be a number"),
  body("isAvailable").isBoolean().withMessage("Availability is required"),
  body("imageUrl").isString().withMessage("Image URL is required"),
];
