import { Router } from "express";
import { checkLogs, isLoggedIn } from "../middleware/auth";
import {
  CreateOrder,
  GetOrder,
  UpdateOrderStatus,
  CancelOrder,
  GetUserOrders,
  GetOrderHistory,
} from "../controller/order.controller";

const orderRouter = Router();

orderRouter.post("/orders", checkLogs, CreateOrder); // add isLoggedIn later
orderRouter.get("/orders/:orderId", checkLogs, GetOrder); // add isLoggedIn later
orderRouter.put(
  "/orders/:orderId/status",
  checkLogs,
  // isLoggedIn,
  UpdateOrderStatus,
);
orderRouter.put("/orders/:orderId/cancel", checkLogs, isLoggedIn, CancelOrder);
orderRouter.get("/users/:userId/orders", checkLogs, isLoggedIn, GetUserOrders);
orderRouter.get(
  "/users/:userId/order-history",
  checkLogs,
  isLoggedIn,
  GetOrderHistory,
);

export default orderRouter;
