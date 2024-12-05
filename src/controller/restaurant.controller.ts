import { Request, Response, NextFunction } from "express";
import { RestaurantModel } from "../db/models/restaurant";

export const createRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = new RestaurantModel(req.body);
        const savedRestaurant = await restaurant.save();
        res.status(201).json(savedRestaurant);
    } catch (error) {
        next(error);  
    }
};

export const getAllRestaurants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Récupérer tous les restaurants et peupler les éléments du menu
        const restaurants = await RestaurantModel.find()
            .populate("menu");  // Peupler les éléments du menu (référence)

        // Retourner les restaurants avec les éléments du menu complets
        res.status(200).json(restaurants);
    } catch (error) {
        next(error);
    }
};


export const getRestaurantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findById(req.params.id)
            .populate("menu");;
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

export const updateRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }
        res.status(200).json(restaurant);
    } catch (error) {
        next(error);
    }
};

export const deleteRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantModel.findByIdAndDelete(req.params.id);
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }
        res.status(204).send();  
    } catch (error) {
        next(error);
    }
};
