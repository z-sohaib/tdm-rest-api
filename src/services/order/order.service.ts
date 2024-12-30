import { OrderModel, OrderI } from "../../db/models/order";
import orderLogs, { orderLogger } from "./order.logs";
import { formatString } from "../../utils/Strings";
import { HttpCodes } from "../../config/Errors";
import { ErrorResponseC, SuccessResponseC } from "../services.response";
import { FilterQuery } from "mongoose";

export class OrderServices {
  /**
   * @description Create a new order
   * @param orderData - OrderI data
   * @returns ResponseT
   */
  static executeCreateOrder = async (orderData: OrderI): Promise<ResponseT> => {
    try {
      const order = new OrderModel(orderData);
      await order.save();

      const msg = formatString(orderLogs.ORDER_CREATE_SUCCESS.message, {
        userId: order.userId.toString(),
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.ORDER_CREATE_SUCCESS.type,
        order,
        msg,
        HttpCodes.Created.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.ORDER_CREATE_ERROR.message, {
        userId: orderData.userId.toString(),
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.ORDER_CREATE_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Get order by ID
   * @param orderId - String
   * @returns ResponseT
   */
  static executeGetOrder = async (orderId: string): Promise<ResponseT> => {
    try {
      const order = await OrderModel.findOrder(orderId);
      if (!order) {
        const msg = formatString(orderLogs.ORDER_NOT_FOUND.message, {
          orderId,
        });
        orderLogger.error(msg);
        return new ErrorResponseC(
          orderLogs.ORDER_NOT_FOUND.type,
          HttpCodes.NotFound.code,
          msg,
        );
      }

      const msg = formatString(orderLogs.ORDER_GET_SUCCESS.message, {
        orderId,
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.ORDER_GET_SUCCESS.type,
        order,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.ORDER_GET_ERROR.message, {
        orderId,
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.ORDER_GET_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Update order status
   * @param orderId - String
   * @param status - String
   * @returns ResponseT
   */
  static executeUpdateOrderStatus = async (
    orderId: string,
    status: string,
  ): Promise<ResponseT> => {
    try {
      const validStatuses = [
        "Preparing",
        "Ready",
        "On the Way",
        "Delivered",
        "Cancelled",
      ];
      if (!validStatuses.includes(status)) {
        const msg = formatString(orderLogs.ORDER_STATUS_INVALID.message, {
          orderId,
          status,
        });
        orderLogger.error(msg);
        return new ErrorResponseC(
          orderLogs.ORDER_STATUS_INVALID.type,
          HttpCodes.BadRequest.code,
          msg,
        );
      }

      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          status,
          $push: { history: { status, timestamp: new Date() } },
        },
        { new: true },
      );

      if (!order) {
        const msg = formatString(orderLogs.ORDER_NOT_FOUND.message, {
          orderId,
        });
        orderLogger.error(msg);
        return new ErrorResponseC(
          orderLogs.ORDER_NOT_FOUND.type,
          HttpCodes.NotFound.code,
          msg,
        );
      }

      const msg = formatString(orderLogs.ORDER_UPDATE_SUCCESS.message, {
        orderId,
        status,
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.ORDER_UPDATE_SUCCESS.type,
        order,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.ORDER_UPDATE_ERROR.message, {
        orderId,
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.ORDER_UPDATE_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Cancel order
   * @param orderId - String
   * @returns ResponseT
   */
  static executeCancelOrder = async (orderId: string): Promise<ResponseT> => {
    try {
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        {
          status: "Cancelled",
          $push: { history: { status: "Cancelled", timestamp: new Date() } },
        },
        { new: true },
      );

      if (!order) {
        const msg = formatString(orderLogs.ORDER_NOT_FOUND.message, {
          orderId,
        });
        orderLogger.error(msg);
        return new ErrorResponseC(
          orderLogs.ORDER_NOT_FOUND.type,
          HttpCodes.NotFound.code,
          msg,
        );
      }

      const msg = formatString(orderLogs.ORDER_DELETE_SUCCESS.message, {
        orderId,
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.ORDER_DELETE_SUCCESS.type,
        order,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.ORDER_DELETE_ERROR.message, {
        orderId,
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.ORDER_DELETE_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Get user orders
   * @param userId - String
   * @returns ResponseT
   */
  static executeGetUserOrders = async (userId: string): Promise<ResponseT> => {
    try {
      const orders = await OrderModel.find({ userId });

      if (!orders.length) {
        const msg = formatString(orderLogs.USER_ORDERS_NOT_FOUND.message, {
          userId,
        });
        orderLogger.info(msg);
        return new SuccessResponseC(
          orderLogs.USER_ORDERS_NOT_FOUND.type,
          [],
          msg,
          HttpCodes.OK.code,
        );
      }

      const msg = formatString(orderLogs.USER_ORDERS_SUCCESS.message, {
        userId,
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.USER_ORDERS_SUCCESS.type,
        orders,
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.USER_ORDERS_ERROR.message, {
        userId,
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.USER_ORDERS_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };

  /**
   * @description Get user order history with filters
   * @param userId - String
   * @param page - Number
   * @param limit - Number
   * @param filters - Object
   * @returns ResponseT
   */
  static executeGetOrderHistory = async (
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters: { startDate?: Date; endDate?: Date; status?: string },
  ): Promise<ResponseT> => {
    try {
      const query: FilterQuery<OrderI> = { userId };

      if (filters.status) {
        query.status = filters.status;
      }

      if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) query.createdAt.$gte = filters.startDate;
        if (filters.endDate) query.createdAt.$lte = filters.endDate;
      }

      const skip = (page - 1) * limit;
      const orders = await OrderModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await OrderModel.countDocuments(query);

      const msg = formatString(orderLogs.ORDER_HISTORY_SUCCESS.message, {
        userId,
      });
      orderLogger.info(msg);
      return new SuccessResponseC(
        orderLogs.ORDER_HISTORY_SUCCESS.type,
        { orders, total, page, limit },
        msg,
        HttpCodes.OK.code,
      );
    } catch (err) {
      const msg = formatString(orderLogs.ORDER_HISTORY_ERROR.message, {
        userId,
        error: (err as Error)?.message || "",
      });
      orderLogger.error(msg, err as Error);
      return new ErrorResponseC(
        orderLogs.ORDER_HISTORY_ERROR.type,
        HttpCodes.InternalServerError.code,
        msg,
      );
    }
  };
}
