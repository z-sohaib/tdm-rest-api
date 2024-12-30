import { Router } from "express";
import { reviewValidator } from "../services/review/review.validator";
import {
  createReview,
  getReviewById,
  updateReview,
  deleteReview,
  getReviewsByRestaurant,
} from "../controller/review.controller";
import { checkLogs, isLoggedIn, isAdmin } from "../middleware/auth";

const reviewRouter = Router();

reviewRouter.route("/").post(
  //isLoggedIn,
  reviewValidator,
  createReview,
);

reviewRouter.route("/:reviewId").get(checkLogs, isLoggedIn, getReviewById);

reviewRouter.route("/:reviewId").put(isLoggedIn, reviewValidator, updateReview);

reviewRouter.route("/:reviewId").delete(isLoggedIn, isAdmin, deleteReview);

reviewRouter.route("/resto/:restoId").get(
  //isLoggedIn,
  getReviewsByRestaurant,
);

export default reviewRouter;
