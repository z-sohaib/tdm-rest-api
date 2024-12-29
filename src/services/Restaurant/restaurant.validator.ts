import { body } from "express-validator";

export const restaurantValidator = [
    body("name").isString().withMessage("Name is required"),
    body("logo").isString().withMessage("Logo URL is required"),
    body("image").isString().withMessage("Image URL is required"),
    body("location").isString().withMessage("Location is required"),
    body("cuisineType").isArray().withMessage("Cuisine Type should be an array"),
    body("contactInfo.phone").isString().withMessage("Phone number is required"),
    body("contactInfo.email").isString().withMessage("Email is required"),
];
