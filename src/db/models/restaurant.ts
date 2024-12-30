import { Document, Model, Schema, model, Types } from "mongoose";

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  socialMedia: SocialMedia[];
}

export interface RestaurantI {
  name: string;
  logo: string;
  image: string;
  location: string;
  cuisineType: string[];
  avgRating?: number;
  reviewsCount?: number;
  contactInfo: ContactInfo;
  menu: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RestaurantD extends Document<RestaurantI>, RestaurantI {}
export type RestaurantModel = Model<RestaurantD>;

const ALLOWED_CUISINE_TYPES = [
  "Fast",
  "Italian",
  "Asian",
  "Mexican",
  "Indian",
  "Traditionnal",
  "Turkish",
];

const restaurantSchema = new Schema<RestaurantI>(
  {
    name: { type: String, required: true, index: true },
    logo: { type: String, required: true },
    image: { type: String, required: true }, // Nouveau champ
    location: { type: String, required: true, index: true },
    cuisineType: [
      {
        type: String,
        required: true,
        enum: ALLOWED_CUISINE_TYPES, // Enum des types de cuisine autorisés
      },
    ],
    avgRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    contactInfo: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      socialMedia: [
        {
          platform: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
    },
    menu: [{ type: Schema.Types.ObjectId, ref: "MenuItem" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

restaurantSchema.index({ name: 1, location: 1, cuisineType: 1, avgRating: 1 });

export const RestaurantModel = model<RestaurantI, RestaurantModel>(
  "Restaurants",
  restaurantSchema,
);
