import { Application } from "express";
import indexRouter from "./index.router";
import authRouter from "./auth.router";
import restaurantRouter from "./restaurant.router";
import reviewRouter from "./review.router";

export default function SetRouters(app: Application) {
  app.use("/", indexRouter);
  app.use("/auth", authRouter);
  app.use("/api", restaurantRouter);
  app.use("/api/review", reviewRouter);

  
}
