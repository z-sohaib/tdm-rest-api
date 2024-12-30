import { Request, Response, NextFunction } from "express";
import { RestaurantService } from "../services/Restaurant/restaurant.service";
import { Logger } from "../services/Restaurant/restautant.los";

export class RestaurantController {
  // CRUD pour Restaurants
  static createRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const restaurant = await RestaurantService.create(req.body);
      res.status(201).json(restaurant);
    } catch (error) {
      Logger.error("Error creating restaurant", error);
      next(error);
    }
  };

  static getAllRestaurants = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const restaurants = await RestaurantService.getAll();
      res.status(200).json(restaurants);
    } catch (error) {
      Logger.error("Error getting all restaurants", error);
      next(error);
    }
  };

  static getRestaurantById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const restaurant = await RestaurantService.getById(req.params.id);
      if (!restaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }
      res.status(200).json(restaurant);
    } catch (error) {
      Logger.error("Error getting restaurant by ID", error);
      next(error);
    }
  };

  static updateRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updatedRestaurant = await RestaurantService.update(
        req.params.id,
        req.body,
      );
      if (!updatedRestaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }
      res.status(200).json(updatedRestaurant);
    } catch (error) {
      Logger.error("Error updating restaurant", error);
      next(error);
    }
  };

  static deleteRestaurant = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const deletedRestaurant = await RestaurantService.delete(req.params.id);
      if (!deletedRestaurant) {
        res.status(404).json({ error: "Restaurant not found" });
        return;
      }
      res.status(204).send();
    } catch (error) {
      Logger.error("Error deleting restaurant", error);
      next(error);
    }
  };
}
