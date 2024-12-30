import { Request, Response } from "express";
import * as reviewService from "../services/review/review.service"; // Importation des services

export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reviewData = req.body; // Récupère les données de la requête
    const createdReview = await reviewService.createReview(reviewData); // Appel au service pour créer la revue
    res
      .status(201)
      .json({ message: "Review created successfully", review: createdReview });
  } catch (error: unknown) {
    // Spécifie que l'erreur est de type 'unknown'
    if (error instanceof Error) {
      // Vérifie si l'erreur est une instance d'Error
      res
        .status(500)
        .json({ message: "Failed to create review", error: error.message });
    } else {
      // Si l'erreur n'est pas une instance d'Error, vous pouvez la gérer ici
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: error });
    }
  }
};

export const getReviewById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reviewId = req.params.reviewId;
    const review = await reviewService.getReviewById(reviewId); // Appel au service pour obtenir la revue par ID
    if (!review) {
      res.status(404).json({ message: "Review not found" });
    } else {
      res.status(200).json({ review });
    }
  } catch (error: unknown) {
    // Spécifie que l'erreur est de type 'unknown'
    if (error instanceof Error) {
      // Vérifie si l'erreur est une instance d'Error
      res
        .status(500)
        .json({ message: "Failed to fetch review", error: error.message });
    } else {
      // Si l'erreur n'est pas une instance d'Error, vous pouvez la gérer ici
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: error });
    }
  }
};

export const updateReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reviewId = req.params.reviewId; // Récupère l'ID de la revue depuis les paramètres
    const updatedData = req.body; // Récupère les nouvelles données pour la mise à jour

    const updatedReview = await reviewService.updateReview(
      reviewId,
      updatedData,
    ); // Appel au service pour mettre à jour la revue
    if (!updatedReview) {
      res.status(404).json({ message: "Review not found" });
    } else {
      res
        .status(200)
        .json({
          message: "Review updated successfully",
          review: updatedReview,
        });
    }
  } catch (error: unknown) {
    // Spécifie que l'erreur est de type 'unknown'
    if (error instanceof Error) {
      // Vérifie si l'erreur est une instance d'Error
      res
        .status(500)
        .json({ message: "Failed to update review", error: error.message });
    } else {
      // Si l'erreur n'est pas une instance d'Error, vous pouvez la gérer ici
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: error });
    }
  }
};

export const deleteReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const reviewId = req.params.reviewId; // Récupère l'ID de la revue à supprimer

    const deletedReview = await reviewService.deleteReview(reviewId); // Appel au service pour supprimer la revue
    if (!deletedReview) {
      res.status(404).json({ message: "Review not found" });
    } else {
      res
        .status(200)
        .json({
          message: "Review deleted successfully",
          review: deletedReview,
        });
    }
  } catch (error: unknown) {
    // Spécifie que l'erreur est de type 'unknown'
    if (error instanceof Error) {
      // Vérifie si l'erreur est une instance d'Error
      res
        .status(500)
        .json({ message: "Failed to delete review", error: error.message });
    } else {
      // Si l'erreur n'est pas une instance d'Error, vous pouvez la gérer ici
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: error });
    }
  }
};

export const getReviewsByRestaurant = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const restaurantId = req.params.restoId;

    // Vérification du format de l'ID (ID valide pour MongoDB)
    if (!restaurantId || !/^[a-fA-F0-9]{24}$/.test(restaurantId)) {
      res.status(400).json({ message: "Invalid restaurant ID format" });
      return;
    }

    // Appel du service pour obtenir les avis
    const reviews = await reviewService.getReviewsByRestaurant(restaurantId);

    // Vérification si des avis sont trouvés
    if (!reviews || reviews.length === 0) {
      res.status(404).json({ message: "No reviews found for this restaurant" });
      return;
    }

    res.status(200).json({ reviews });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Failed to fetch reviews", error: error.message });
    } else {
      res
        .status(500)
        .json({ message: "An unknown error occurred", error: error });
    }
  }
};
