import { Review } from '../types/review';
import { reviews } from '../mock-data';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(restaurantId?: string): Promise<Review[]> {
  await delay();
  if (restaurantId) {
    return reviews.filter(r => r.restaurantId === restaurantId);
  }
  return [...reviews];
}

export async function getById(id: string): Promise<Review | undefined> {
  await delay();
  return reviews.find(r => r.id === id);
}

export async function create(data: Omit<Review, 'id'>): Promise<Review> {
  await delay();
  const newReview: Review = { ...data, id: `rev${Date.now()}` };
  reviews.push(newReview);
  return newReview;
}

export async function update(id: string, data: Partial<Review>): Promise<Review> {
  await delay();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Review not found');
  const updated = { ...reviews[index], ...data };
  reviews[index] = updated;
  return updated;
}
