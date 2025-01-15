import { MenuItemModel } from "../../db/models/menu";
import { RestaurantModel } from "../../db/models/restaurant";

export class RestaurantService {
  static create = async (data: any) => {
    const restaurant = new RestaurantModel(data);
    return restaurant.save();
  };

  static getAll = async () => {
    return RestaurantModel.find().populate("menu");
  };

  static getById = async (id: string) => {
    return RestaurantModel.findById(id).populate("menu");
  };

  static update = async (id: string, data: any) => {
    return RestaurantModel.findByIdAndUpdate(id, data, { new: true });
  };

  static delete = async (id: string) => {
    return RestaurantModel.findByIdAndDelete(id);
  };

  static async search(query: string): Promise<any[]> {
    if (!query || query.trim() === "") {
      throw new Error("Search query cannot be empty");
    }

    const regex = new RegExp(query, "i"); // Insensible à la casse

    // Recherche des restaurants correspondant aux critères
    const restaurantsByCriteria = await RestaurantModel.find({
      $or: [{ name: regex }, { location: regex }, { cuisineType: regex }],
    }).exec();

    // Recherche des menus correspondant au nom du menu
    const menus = await MenuItemModel.find({
      name: regex,
    }).exec();

    // Si aucun menu n'a été trouvé, retourne directement les restaurants
    if (!menus.length) {
      return restaurantsByCriteria;
    }

    // Extraire les IDs des restaurants associés aux éléments de menu trouvés
    const restaurantIds = menus.map((menu) => menu.restaurantId);

    // Recherche des restaurants par les IDs extraits des menus
    const restaurantsByMenu = await RestaurantModel.find({
      _id: { $in: restaurantIds },
    }).exec();

    // Fusionner les restaurants trouvés par critères et par menu
    const allRestaurants = [...restaurantsByCriteria, ...restaurantsByMenu];

    // Éliminer les doublons en utilisant un Set pour les restaurantId
    const uniqueRestaurants = Array.from(
      new Map(
        allRestaurants.map((restaurant) => [
          restaurant._id.toString(),
          restaurant,
        ]),
      ).values(),
    );

    return uniqueRestaurants;
  }
}
