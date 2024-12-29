import { Document, Model, Schema, model, Types } from "mongoose";

export interface ReviewI {
    restaurantId: Types.ObjectId; 
    userId: Types.ObjectId; 
    rating: number; 
    comment: string; 
    createdAt: Date; 
}

export interface ReviewD extends Document<ReviewI>, ReviewI { }
export interface ReviewModel extends Model<ReviewD> { }

const reviewSchema = new Schema<ReviewI>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", 
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true, 
    }
);

reviewSchema.index({ restaurant: 1 });

export const ReviewModel = model<ReviewI, ReviewModel>("Review", reviewSchema);
