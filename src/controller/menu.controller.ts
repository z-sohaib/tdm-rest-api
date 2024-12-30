import { Request, Response, NextFunction } from "express";
import { MenuService } from "../services/menu/menu.service";
import { Logger } from "../services/Restaurant/restautant.los";

export class MenuController {
  static addMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const menuItem = await MenuService.addItem(
        req.params.restaurantId,
        req.body,
      );
      res.status(201).json(menuItem);
    } catch (error) {
      Logger.error("Error adding menu item", error);
      next(error);
    }
  };

  static getMenuByRestaurantId = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const menu = await MenuService.getMenuByRestaurantId(
        req.params.restaurantId,
      );
      if (!menu) {
        res.status(404).json({ error: "Menu not found" });
        return;
      }
      res.status(200).json(menu);
    } catch (error) {
      Logger.error("Error fetching menu", error);
      next(error);
    }
  };

  static updateMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const updatedItem = await MenuService.updateItem(
        req.params.restaurantId,
        req.params.menuItemId,
        req.body,
      );
      if (!updatedItem) {
        res.status(404).json({ error: "Menu item not found" });
        return;
      }
      res.status(200).json(updatedItem);
    } catch (error) {
      Logger.error("Error updating menu item", error);
      next(error);
    }
  };
}
