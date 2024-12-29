import { Schema, model, Types, Document, Model } from "mongoose";

export interface MenuItemI {
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    restaurantId: Types.ObjectId; // Référence au restaurant
    imageUrl: string;  // Nouveau champ pour l'URL de l'image
    createdAt: Date;
    updatedAt: Date;
}

export interface MenuItemD extends Document<MenuItemI>, MenuItemI { }
export interface MenuItemModel extends Model<MenuItemD> { }

const menuItemSchema = new Schema<MenuItemI>(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        isAvailable: { type: Boolean, default: true },
        restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurants", required: true },
        imageUrl: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

export const MenuItemModel = model<MenuItemI, MenuItemModel>("MenuItem", menuItemSchema);
