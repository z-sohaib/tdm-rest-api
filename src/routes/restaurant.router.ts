import { Router } from "express";
import { RestaurantController } from "../controller/restaurant.controller";
// import { validateRestaurant } from "../middleware/restaurant";
import { checkLogs, isAdmin, isLoggedIn } from "../middleware/auth";
import { MenuController } from "../controller/menu.controller";

const router = Router();

router.post(
  "/restaurants",
  checkLogs,
  isLoggedIn,
  RestaurantController.createRestaurant,
);
router.get("/restaurants", checkLogs, RestaurantController.getAllRestaurants);
router.get(
  "/restaurants/:id",
  checkLogs,
  isLoggedIn,
  RestaurantController.getRestaurantById,
);
router.put(
  "/restaurants/:id",
  checkLogs,
  isLoggedIn,
  RestaurantController.updateRestaurant,
);
router.delete(
  "/restaurants/:id",
  checkLogs,
  isLoggedIn,
  isAdmin,
  RestaurantController.deleteRestaurant,
);

router.get("/menu/:restaurantId", MenuController.getMenuByRestaurantId);
router.post("/menu", MenuController.addMenuItem);
router.put("/menu/:menuItemId", MenuController.updateMenuItem);
//router.delete("/menu/:menuItemId", MenuController.deleteMenuItem);

export default router;
