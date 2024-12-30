import { RestaurantModel } from "../../db/models/restaurant";
import { MenuItemModel } from "../../db/models/menu";
import { Types } from "mongoose"; // Assure-toi d'importer Types de mongoose

export class MenuService {
  static addItem = async (restaurantId: string, itemData: any) => {
    // Cherche le restaurant par son ID
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Crée un nouveau menuItem à partir des données reçues
    const menuItem = new MenuItemModel({
      ...itemData, // copie les données du nouvel élément du menu
      restaurantId: restaurantId, // Associe le restaurantId
    });

    // Sauvegarde du menuItem
    await menuItem.save();

    // Assure-toi que menuItem._id est bien un ObjectId (en cas de doute)
    if (!(menuItem._id instanceof Types.ObjectId)) {
      throw new Error("menuItem._id is not a valid ObjectId");
    }

    // Ajoute l'ID de menuItem au tableau de menu du restaurant
    restaurant.menu.push(menuItem._id); // menuItem._id doit être un ObjectId
    await restaurant.save();

    return menuItem;
  };

  static getMenuByRestaurantId = async (restaurantId: string) => {
    // Recherche du restaurant avec ses éléments de menu peuplés
    const restaurant =
      await RestaurantModel.findById(restaurantId).populate("menu");
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }
    return restaurant.menu;
  };

  static updateItem = async (
    restaurantId: string,
    menuItemId: string,
    itemData: any,
  ) => {
    // Recherche du restaurant
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      throw new Error("Restaurant not found");
    }

    // Recherche de l'élément de menu par son ID
    const menuItem = await MenuItemModel.findById(menuItemId);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }

    // Mise à jour de l'élément de menu avec les nouvelles données
    Object.assign(menuItem, itemData);
    await menuItem.save();
    return menuItem;
  };
}
