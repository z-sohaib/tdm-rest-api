import { Request, Response } from "express";
import { OrderServices } from "../services/order/order.service";
import { ErrorResponse, SuccessResponse } from "../utils/Response";
import {
  ErrorResponseC,
  SuccessResponseC,
} from "../services/services.response";
import { MyRequest } from "../types/Express";

// Create Order
export const CreateOrder = async (
  req: MyRequest<any, any, any, any, any, any>,
  res: Response,
) => {
  const orderData = {
    ...req.body,
    // userId: req.user!._id,
  };
  const result = await OrderServices.executeCreateOrder(orderData);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Get Order
export const GetOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.executeGetOrder(orderId);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Update Order Status
export const UpdateOrderStatus = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const result = await OrderServices.executeUpdateOrderStatus(orderId, status);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Cancel Order
export const CancelOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.executeCancelOrder(orderId);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Get User Orders
export const GetUserOrders = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await OrderServices.executeGetUserOrders(userId);
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};

// Get Order History
export const GetOrderHistory = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { page, limit, startDate, endDate, status } = req.query;

  const filters = {
    startDate: startDate ? new Date(startDate as string) : undefined,
    endDate: endDate ? new Date(endDate as string) : undefined,
    status: status as string | undefined,
  };

  const result = await OrderServices.executeGetOrderHistory(
    userId,
    Number(page) || 1,
    Number(limit) || 10,
    filters,
  );
  if (result instanceof SuccessResponseC)
    return SuccessResponse(
      res,
      result.code,
      result.data,
      result.message,
      result.status,
    );
  if (result instanceof ErrorResponseC)
    return ErrorResponse(res, result.code, result.message, result.error);
};
