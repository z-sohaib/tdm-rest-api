import { Application } from "express";
import indexRouter from "./index.router";
import authRouter from "./auth.router";
import restaurantRouter from "./restaurant.router";
import reviewRouter from "./review.router";
import orderRouter from "./order.router";

export default function SetRouters(app: Application) {
  app.use("/", indexRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/restaurants", restaurantRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/orders", orderRouter);
}
