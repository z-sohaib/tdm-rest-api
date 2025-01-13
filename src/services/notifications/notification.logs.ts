import Logger from "../../utils/Logger";

export type INotificationLogs =
  | "NOTIFICATION_SEND_SUCCESS"
  | "NOTIFICATION_SEND_ERROR"
  | "NOTIFICATION_NO_DEVICES"
  | "NOTIFICATION_INVALID_TOKEN"
  | "NOTIFICATION_MULTICAST_SUCCESS"
  | "NOTIFICATION_MULTICAST_ERROR"
  | "NOTIFICATION_TOKEN_REMOVED";

export const notificationLogs: IErrors<INotificationLogs> = {
  NOTIFICATION_SEND_SUCCESS: {
    code: 200,
    message: "Successfully sent notification to user {userId}",
    type: "NOTIFICATION_SEND_SUCCESS",
  },
  NOTIFICATION_SEND_ERROR: {
    code: 201,
    message: "Error sending notification to user {userId}: {error}",
    type: "NOTIFICATION_SEND_ERROR",
  },
  NOTIFICATION_NO_DEVICES: {
    code: 202,
    message: "No devices found for user {userId}",
    type: "NOTIFICATION_NO_DEVICES",
  },
  NOTIFICATION_INVALID_TOKEN: {
    code: 203,
    message: "Invalid FCM token removed for device {deviceId}",
    type: "NOTIFICATION_INVALID_TOKEN",
  },
  NOTIFICATION_MULTICAST_SUCCESS: {
    code: 204,
    message: "Successfully sent multicast notification to {count} devices",
    type: "NOTIFICATION_MULTICAST_SUCCESS",
  },
  NOTIFICATION_MULTICAST_ERROR: {
    code: 205,
    message: "Error sending multicast notification: {error}",
    type: "NOTIFICATION_MULTICAST_ERROR",
  },
  NOTIFICATION_TOKEN_REMOVED: {
    code: 206,
    message: "Removed invalid FCM token for user {userId}",
    type: "NOTIFICATION_TOKEN_REMOVED",
  },
} as const;

export default notificationLogs;
export const notificationLogger = new Logger("notifications");
