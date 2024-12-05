import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRestaurant = [
    body("name").notEmpty().withMessage("Restaurant name is required"),
    body("cuisineType").notEmpty().withMessage("Cuisine type is required"),
    body("location").notEmpty().withMessage("Location is required"),

    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Si des erreurs sont présentes, passer l'erreur au middleware de gestion des erreurs via next()
            const error = new Error("Validation failed");
            (error as any).statusCode = 400;
            (error as any).errors = errors.array();
            next(error); // Passe l'erreur au gestionnaire d'erreurs
            return; // Important de ne pas continuer après avoir passé l'erreur
        }

        // Si pas d'erreurs, continuer le traitement
        next();
    },
];
