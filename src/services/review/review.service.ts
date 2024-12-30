import { ReviewModel } from "../../db/models/review"; // Assurez-vous que votre modèle est correctement importé
import { Types } from "mongoose";

export const createReview = async (data: any) => {
  const review = new ReviewModel(data); // Crée une nouvelle revue
  return await review.save(); // Enregistre la revue dans la base de données
};

export const getReviewById = async (reviewId: string) => {
  return await ReviewModel.findById(reviewId); // Recherche une revue par son ID
};

export const updateReview = async (reviewId: string, data: any) => {
  return await ReviewModel.findByIdAndUpdate(reviewId, data, { new: true }); // Met à jour la revue
};

export const deleteReview = async (reviewId: string) => {
  return await ReviewModel.findByIdAndDelete(reviewId); // Supprime la revue
};

export const getReviewsByRestaurant = async (
  restaurantId: string,
): Promise<any[]> => {
  try {
    // Convertir l'ID du restaurant en ObjectId
    const objectId = new Types.ObjectId(restaurantId);

    // Rechercher les avis avec l'ObjectId
    const reviews = await ReviewModel.find({ restaurantId: objectId }).exec(); // Utilisez restaurantId comme clé

    // Si aucun avis n'est trouvé, retourner un tableau vide
    return reviews;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Failed to fetch reviews");
  }
};
