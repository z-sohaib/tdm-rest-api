import { body } from "express-validator";

export const reviewValidator = [
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("La note doit être un entier entre 1 et 5."),
    body("comment")
        .isString()
        .isLength({ min: 10 })
        .withMessage("Le commentaire doit être une chaîne de caractères d'au moins 10 caractères."),
    body("restaurantId")
        .isMongoId()
        .withMessage("L'ID du restaurant doit être valide."),
];
