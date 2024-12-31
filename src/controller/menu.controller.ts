import { Request, Response, NextFunction } from "express";
import { MenuService } from "../services/menu/menu.service";
import { Logger } from "../services/Restaurant/restautant.los";
import mongoose from "mongoose";
import { MenuItemModel } from "db/models/menu";


export class MenuController {
    static addMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { restaurantId, menuItems } = req.body; // Récupérer restaurantId et menuItems depuis le body
            if (!restaurantId) {
                res.status(400).json({ error: "Restaurant ID is required" });
                return;
            }

            if (!menuItems || menuItems.length === 0) {
                res.status(400).json({ error: "Menu items are required" });
                return;
            }

            // Ajouter chaque item de menu au restaurant
            const addedMenuItems = [];
            for (const itemData of menuItems) {
                const menuItem = await MenuService.addItem(restaurantId, itemData);
                addedMenuItems.push(menuItem);
            }

            res.status(201).json(addedMenuItems); // Retourner les éléments du menu ajoutés
        } catch (error) {
            Logger.error("Error adding menu item", error);
            next(error);
        }
    };


    static getMenuByRestaurantId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const menu = await MenuService.getMenuByRestaurantId(req.params.restaurantId);
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

    static updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const updatedItem = await MenuService.updateItem(req.params.restaurantId, req.params.menuItemId, req.body);
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

    static getMenuById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { menuId } = req.params;
            if (!mongoose.Types.ObjectId.isValid(menuId)) {
                Logger.error(`Invalid menuId: ${menuId}`);
                res.status(400).json({ error: "Invalid or missing menu item ID" });
                return;
            }
            const menuItem = await MenuService.getById(menuId);

            if (!menuItem) {
                Logger.error(`Menu item not found for ID: ${menuId}`);
                res.status(404).json({ error: "Menu item not found" });
                return;
            }

            res.status(200).json(menuItem);
        } catch (error: unknown) {
            if (res.headersSent) {
                return next(error); // Si les headers sont déjà envoyés
            }

            Logger.error("Error fetching menu item by ID", error instanceof Error ? error.message : error);
            res.status(500).json({ error: "An internal error occurred" });
        }
    };



}
