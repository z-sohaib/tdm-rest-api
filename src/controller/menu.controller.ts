import { Request, Response, NextFunction } from "express";
import { RestaurantModel } from "../db/models/restaurant";
import { MenuItemModel } from "../db/models/menu";
import { MenuItemD } from "../db/models/menu";  // Si vous avez une interface pour MenuItem

// GET: Obtenir le menu d'un restaurant
export const getMenuByRestaurantId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurantId = req.params.restaurantId;

        // Récupérer le restaurant par ID et peupler les menus
        const restaurant = await RestaurantModel.findById(restaurantId).populate('menu');
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }

        res.status(200).json(restaurant.menu);
    } catch (error) {
        next(error);
    }
};

export const addMenuItemsToRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { restaurantId, menuItems } = req.body;  // Récupérer le restaurantId et les éléments du menu depuis la requête

        // Vérifier que le restaurant existe
        const restaurant = await RestaurantModel.findById(restaurantId);
        if (!restaurant) {
            res.status(404).json({ error: "Restaurant not found" });
            return;
        }

        // Ajouter l'ID du restaurant à chaque élément de menu avant de les insérer
        const menuItemsWithRestaurantId = menuItems.map((item: any) => ({
            ...item,
            restaurantId: restaurantId,  // Ajouter le restaurantId à chaque élément de menu
        }));

        // Ajouter les éléments de menu dans la base de données
        const savedMenuItems = await MenuItemModel.insertMany(menuItemsWithRestaurantId);

        // Ajouter les _id des éléments du menu à la propriété `menu` du restaurant
        const menuIds = savedMenuItems.map(item => item._id);
        restaurant.menu.push(...menuIds);  // Ajouter les ID des éléments du menu au restaurant

        // Sauvegarder le restaurant avec les nouvelles références de menu
        await restaurant.save();  // Assurez-vous de sauvegarder après la mise à jour

        // Retourner les éléments ajoutés avec succès
        res.status(201).json(savedMenuItems);
    } catch (error) {
        next(error);  // Gestion des erreurs
    }
};



// PUT: Mettre à jour un élément du menu (admin)
export const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { menuItemId } = req.params;
        const updatedMenuItem = req.body;

        // Trouver et mettre à jour l'élément du menu
        const menuItem = await MenuItemModel.findByIdAndUpdate(menuItemId, updatedMenuItem, { new: true });
        if (!menuItem) {
            res.status(404).json({ error: "Menu item not found" });
            return;
        }

        res.status(200).json(menuItem);
    } catch (error) {
        next(error);
    }
};

// DELETE: Supprimer un élément du menu (admin)
export const deleteMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { menuItemId } = req.params;

        // Supprimer l'élément du menu
        const menuItem = await MenuItemModel.findByIdAndDelete(menuItemId);
        if (!menuItem) {
            res.status(404).json({ error: "Menu item not found" });
            return;
        }

        // Mettre à jour le restaurant pour supprimer l'élément du menu
        await RestaurantModel.updateMany(
            { menu: menuItemId },
            { $pull: { menu: menuItemId } }
        );

        res.status(204).send();  // Retourner un statut 204 pour indiquer que la suppression a réussi
    } catch (error) {
        next(error);
    }
};
