import { Router } from "express";
import { RestaurantController } from "../controller/restaurant.controller";
import { checkLogs, isAdmin, isLoggedIn } from "../middleware/auth";
import { MenuController } from "../controller/menu.controller";
import { upload, uploadToCloudinary } from "../middleware/file";

const router = Router();

router.post(
  "/restaurants",
  checkLogs,
  isLoggedIn,
  upload.single("image"),
  uploadToCloudinary,
  RestaurantController.createRestaurant,
);
router.get("/restaurants", checkLogs, RestaurantController.getAllRestaurants);
router.get(
  "/restaurants/:id",
  checkLogs,
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
router.post(
  "/menu",
  checkLogs,
  isLoggedIn,
  upload.single("image"),
  uploadToCloudinary,
  MenuController.addMenuItem,
);
router.put("/menu/:menuItemId", MenuController.updateMenuItem);
router.get("/menuid/:menuId", MenuController.getMenuById);

export default router;
