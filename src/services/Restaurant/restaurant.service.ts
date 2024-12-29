import { RestaurantModel } from "../../db/models/restaurant";
import { MenuItemModel } from "../../db/models/menu";

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
}
