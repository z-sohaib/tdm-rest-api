import Logger from "../../utils/Logger";

export type IOrderLogs =
  | "ORDER_CREATE_SUCCESS"
  | "ORDER_CREATE_ERROR"
  | "ORDER_GET_SUCCESS"
  | "ORDER_GET_ERROR"
  | "ORDER_NOT_FOUND"
  | "ORDER_UPDATE_SUCCESS"
  | "ORDER_UPDATE_ERROR"
  | "ORDER_DELETE_SUCCESS"
  | "ORDER_DELETE_ERROR"
  | "ORDER_STATUS_INVALID"
  | "USER_ORDERS_SUCCESS"
  | "USER_ORDERS_ERROR"
  | "USER_ORDERS_NOT_FOUND"
  | "ORDER_HISTORY_SUCCESS"
  | "ORDER_HISTORY_ERROR"
  | "ORDER_VALIDATION_ERROR"
  | "ORDER_UNAUTHORIZED"
  | "ORDER_DATABASE_ERROR";

export const orderLogs: IErrors<IOrderLogs> = {
  ORDER_CREATE_SUCCESS: {
    code: 100,
    message: 'Order created successfully for user "{userId}"',
    type: "ORDER_CREATE_SUCCESS",
  },
  ORDER_CREATE_ERROR: {
    code: 101,
    message: 'Error creating order for user "{userId}": {error}',
    type: "ORDER_CREATE_ERROR",
  },
  ORDER_GET_SUCCESS: {
    code: 102,
    message: 'Order "{orderId}" retrieved successfully',
    type: "ORDER_GET_SUCCESS",
  },
  ORDER_GET_ERROR: {
    code: 103,
    message: 'Error retrieving order "{orderId}": {error}',
    type: "ORDER_GET_ERROR",
  },
  ORDER_NOT_FOUND: {
    code: 104,
    message: 'Order "{orderId}" not found',
    type: "ORDER_NOT_FOUND",
  },
  ORDER_UPDATE_SUCCESS: {
    code: 105,
    message: 'Order "{orderId}" updated successfully to status "{status}"',
    type: "ORDER_UPDATE_SUCCESS",
  },
  ORDER_UPDATE_ERROR: {
    code: 106,
    message: 'Error updating order "{orderId}": {error}',
    type: "ORDER_UPDATE_ERROR",
  },
  ORDER_DELETE_SUCCESS: {
    code: 107,
    message: 'Order "{orderId}" cancelled successfully',
    type: "ORDER_DELETE_SUCCESS",
  },
  ORDER_DELETE_ERROR: {
    code: 108,
    message: 'Error cancelling order "{orderId}": {error}',
    type: "ORDER_DELETE_ERROR",
  },
  ORDER_STATUS_INVALID: {
    code: 109,
    message: 'Invalid status "{status}" for order "{orderId}"',
    type: "ORDER_STATUS_INVALID",
  },
  USER_ORDERS_SUCCESS: {
    code: 110,
    message: 'Orders retrieved successfully for user "{userId}"',
    type: "USER_ORDERS_SUCCESS",
  },
  USER_ORDERS_ERROR: {
    code: 111,
    message: 'Error retrieving orders for user "{userId}": {error}',
    type: "USER_ORDERS_ERROR",
  },
  USER_ORDERS_NOT_FOUND: {
    code: 112,
    message: 'No orders found for user "{userId}"',
    type: "USER_ORDERS_NOT_FOUND",
  },
  ORDER_HISTORY_SUCCESS: {
    code: 113,
    message: 'Order history retrieved successfully for user "{userId}"',
    type: "ORDER_HISTORY_SUCCESS",
  },
  ORDER_HISTORY_ERROR: {
    code: 114,
    message: 'Error retrieving order history for user "{userId}": {error}',
    type: "ORDER_HISTORY_ERROR",
  },
  ORDER_VALIDATION_ERROR: {
    code: 115,
    message: "Order validation failed: {error}",
    type: "ORDER_VALIDATION_ERROR",
  },
  ORDER_UNAUTHORIZED: {
    code: 116,
    message: 'Unauthorized access to order "{orderId}"',
    type: "ORDER_UNAUTHORIZED",
  },
  ORDER_DATABASE_ERROR: {
    code: 117,
    message: "Database operation failed: {error}",
    type: "ORDER_DATABASE_ERROR",
  },
} as const;

export default orderLogs;
export const orderLogger = new Logger("order");
