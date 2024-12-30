import { body } from "express-validator";

export const orderCreationValidators = [
  body("restaurantId")
    .notEmpty()
    .withMessage("Restaurant ID is required")
    .isMongoId()
    .withMessage("Invalid restaurant ID format"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must contain at least one item"),

  body("items.*.itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isString()
    .withMessage("Item ID must be a string"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number"),

  body("deliveryAddress")
    .notEmpty()
    .withMessage("Delivery address is required")
    .isString()
    .withMessage("Delivery address must be a string"),

  body("deliveryNotes")
    .optional()
    .isString()
    .withMessage("Delivery notes must be a string"),
];
