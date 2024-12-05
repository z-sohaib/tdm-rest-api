import { Router } from "express";
import {createRestaurant,getAllRestaurants,getRestaurantById,updateRestaurant,deleteRestaurant} from "../controller/restaurant.controller";
import { validateRestaurant } from "../middleware/restaurant";
import { checkLogs, isAdmin, isLoggedIn } from "../middleware/auth";
import { addMenuItemsToRestaurant, deleteMenuItem, getMenuByRestaurantId, updateMenuItem } from "../controller/menu.controller";

const router = Router();

router.post("/restaurants", checkLogs, isLoggedIn, createRestaurant);
router.get("/restaurants", checkLogs,  getAllRestaurants);
router.get("/restaurants/:id", checkLogs, isLoggedIn, getRestaurantById);
router.put("/restaurants/:id", checkLogs, isLoggedIn, updateRestaurant);
router.delete("/restaurants/:id", checkLogs, isLoggedIn, isAdmin, deleteRestaurant);


router.get("/menu/:restaurantId", getMenuByRestaurantId);
router.post("/menu", addMenuItemsToRestaurant);
router.put("/menu/:menuItemId", updateMenuItem);
router.delete("/menu/:menuItemId", deleteMenuItem);


export default router;
