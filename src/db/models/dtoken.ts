import { firebaseAdmin } from "config/Firebase";
import { Schema, model, Document, Model } from "mongoose";

export interface DeviceTokenI {
  userId: Types.ObjectId;
  fcmToken: string;
  deviceId: string;
  createdAt?: Date;
  updatedAt?: Date;
  topics: string[]; // Add this line
}

export interface OptimizedDeviceToken {
  tokenId: string;
  userId: string;
  deviceId: string;
  [key: string]: any;
}

export interface DeviceTokenD extends Document<DeviceTokenI>, DeviceTokenI {
  optimize(): OptimizedDeviceToken;
}

export interface DeviceTokenModel extends Model<DeviceTokenD> {
  findDeviceToken(id: string): Promise<DeviceTokenI | null>;
}

const deviceTokenSchema = new Schema<DeviceTokenD>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fcmToken: { type: String, required: true },
    deviceId: { type: String, required: true },
    topics: [{ type: String, default: [] }], // Add this line
  },
  {
    timestamps: true,
  },
);

deviceTokenSchema.methods.optimize = function (): OptimizedDeviceToken {
  const obj = this.toObject();
  return {
    tokenId: obj._id.toString(),
    userId: obj.userId.toString(),
    deviceId: obj.deviceId,
    fcmToken: obj.fcmToken,
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

deviceTokenSchema.statics.findDeviceToken = async function (id: string) {
  return this.findById(id);
};

deviceTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const DeviceTokenModel = model<DeviceTokenD, DeviceTokenModel>(
  "DeviceTokens",
  deviceTokenSchema,
);

export const createDeviceTokenFactory = async (
  props: Partial<DeviceTokenI>,
): Promise<DeviceTokenD> => {
  const deviceToken = new DeviceTokenModel({
    userId: props.userId,
    fcmToken: props.fcmToken,
    deviceId: props.deviceId || `default-device-${Date.now()}`,
  });
  return deviceToken.save();
};

export const saveDeviceToken = async (
  userId: string,
  fcmToken: string,
  deviceId: string,
): Promise<DeviceTokenD> => {
  const token = await DeviceTokenModel.findOneAndUpdate(
    { userId, deviceId },
    {
      fcmToken,
      $addToSet: { topics: ["users"] }, // Automatically subscribe to 'users' topic
    },
    { upsert: true, new: true },
  );

  // Subscribe the token to the users topic
  await firebaseAdmin.messaging().subscribeToTopic(fcmToken, "users");

  return token;
};
