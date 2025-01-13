import { firebaseAdmin } from "../../config/Firebase";
import { DeviceTokenModel } from "../../db/models/dtoken";
import { notificationLogger, notificationLogs } from "./notification.logs";
import { formatString } from "../../utils/Strings";

interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {
    // Initialize Firebase Admin if not already initialized
    if (!firebaseAdmin.apps.length) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.applicationDefault(),
        // Add your Firebase project configurations here
      });
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async sendToUser(
    userId: string,
    payload: NotificationPayload,
  ): Promise<void> {
    const userDevice = await DeviceTokenModel.findOne({ userId });

    if (!userDevice) {
      notificationLogger.warn(notificationLogs.NOTIFICATION_NO_DEVICES.type, {
        userId,
      });
      return;
    }

    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        token: userDevice.fcmToken,
      };

      await firebaseAdmin.messaging().send(message);

      const msg = formatString(
        notificationLogs.NOTIFICATION_SEND_SUCCESS.message,
        {
          userId,
        },
      );
      notificationLogger.info(msg);
    } catch (error: any) {
      if (
        error.code === "messaging/invalid-registration-token" ||
        error.code === "messaging/registration-token-not-registered"
      ) {
        await DeviceTokenModel.findOneAndDelete({
          fcmToken: userDevice.fcmToken,
        });
        notificationLogger.warn(
          notificationLogs.NOTIFICATION_TOKEN_REMOVED.type,
          {
            userId,
          },
        );
      }

      const msg = formatString(
        notificationLogs.NOTIFICATION_SEND_ERROR.message,
        {
          userId,
          error: error.message,
        },
      );
      notificationLogger.error(msg);
      throw error;
    }
  }

  async sendToAllUsers(payload: NotificationPayload): Promise<void> {
    try {
      const message = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
        topic: "users", // Send to 'users' topic instead of individual tokens
      };

      await firebaseAdmin.messaging().send(message);

      notificationLogger.info(
        formatString(notificationLogs.NOTIFICATION_MULTICAST_SUCCESS.message, {
          count: "all users",
        }),
      );
    } catch (error: any) {
      const msg = formatString(
        notificationLogs.NOTIFICATION_MULTICAST_ERROR.message,
        {
          error: error.message,
        },
      );
      notificationLogger.error(msg);
      throw error;
    }
  }

  // Add new method to manage topic subscriptions
  async subscribeToTopic(userId: string, topic: string): Promise<void> {
    const userDevices = await DeviceTokenModel.find({ userId });

    if (userDevices.length === 0) {
      notificationLogger.warn(notificationLogs.NOTIFICATION_NO_DEVICES.type, {
        userId,
      });
      return;
    }

    try {
      const tokens = userDevices.map((device) => device.fcmToken);
      await firebaseAdmin.messaging().subscribeToTopic(tokens, topic);

      // Update devices in database
      await DeviceTokenModel.updateMany(
        { userId },
        { $addToSet: { topics: topic } },
      );
    } catch (error: any) {
      notificationLogger.error("Error subscribing to topic", {
        userId,
        topic,
        error: error.message,
      });
      throw error;
    }
  }

  async unsubscribeFromTopic(userId: string, topic: string): Promise<void> {
    const userDevices = await DeviceTokenModel.find({ userId });

    if (userDevices.length === 0) return;

    try {
      const tokens = userDevices.map((device) => device.fcmToken);
      await firebaseAdmin.messaging().unsubscribeFromTopic(tokens, topic);

      // Update devices in database
      await DeviceTokenModel.updateMany(
        { userId },
        { $pull: { topics: topic } },
      );
    } catch (error: any) {
      notificationLogger.error("Error unsubscribing from topic", {
        userId,
        topic,
        error: error.message,
      });
      throw error;
    }
  }
}
