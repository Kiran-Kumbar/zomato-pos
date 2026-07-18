import { Restaurant } from '../types/restaurant';
import { restaurants } from '../mock-data';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(): Promise<Restaurant[]> {
  await delay();
  return [...restaurants];
}

export async function getById(id: string): Promise<Restaurant | undefined> {
  await delay();
  return restaurants.find(r => r.id === id);
}

export async function create(data: Omit<Restaurant, 'id'>): Promise<Restaurant> {
  await delay();
  const newRestaurant: Restaurant = { ...data, id: `r${Date.now()}` };
  restaurants.push(newRestaurant);
  return newRestaurant;
}

export async function update(id: string, data: Partial<Restaurant>): Promise<Restaurant> {
  await delay();
  const index = restaurants.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Restaurant not found');
  const updated = { ...restaurants[index], ...data };
  restaurants[index] = updated;
  return updated;
}
