import { body } from "express-validator";

export const loginValidators = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const registerValidators = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("phoneNumber")
    .isMobilePhone("ar-DZ", { strictMode: false })
    .withMessage("Invalid phone number"),
  body("address")
    .isArray({ min: 1 })
    .withMessage("Address must be a list with at least one entry")
    .optional(),
  body("profileImage")
    .isURL()
    .withMessage("Invalid profile image URL")
    .optional(),
];

export const passwordResetRequestValidators = [
  body("email").isEmail().withMessage("Invalid email"),
];

export const passwordResetValidators = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
    .withMessage("Passwords do not match"),
];
