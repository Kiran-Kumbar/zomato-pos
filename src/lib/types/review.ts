export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  orderId?: string;
  rating: number;
  comment: string;
  createdAt: string;
  videoUrl?: string;
  imageUrls?: string[];
}
