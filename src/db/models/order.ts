import { Schema, model, Document, Model } from "mongoose";

export interface OrderItem {
  itemId: string;
  quantity: number;
}

export interface OrderHistory {
  status: string;
  timestamp: Date;
}

export interface OrderI {
  _id: any;
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  deliveryAddress: string;
  deliveryNotes?: string;
  history?: OrderHistory[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderD extends Document<OrderI>, OrderI {
  optimize(): OptimizedOrder;
}

export interface OrderModel extends Model<OrderD> {
  findOrder(id: string): Promise<OrderI | null>;
}

export interface OptimizedOrder {
  orderId: string;
  userId: string;
  [key: string]: any;
}

const orderSchema = new Schema<OrderD>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        itemId: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Preparing" },
    deliveryAddress: { type: String, required: true },
    deliveryNotes: { type: String, default: null },
    history: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  },
);

orderSchema.statics.findOrder = async function (id: string) {
  return this.findById(id);
};

export const OrderModel = model<OrderD, OrderModel>("Orders", orderSchema);

export const createOrderFactory = async (
  props: Partial<OrderI>,
): Promise<OrderD> => {
  const order = new OrderModel({
    userId: props.userId || "defaultUserId",
    restaurantId: props.restaurantId || "defaultRestaurantId",
    items: props.items || [{ itemId: "defaultItemId", quantity: 1 }],
    totalAmount: props.totalAmount ?? 10,
    status: props.status || "Preparing",
    deliveryAddress: props.deliveryAddress || "123 Default St",
    deliveryNotes: props.deliveryNotes || null,
    history: props.history || [{ status: "Created", timestamp: new Date() }],
  });
  return order.save() as unknown as OrderD;
};
