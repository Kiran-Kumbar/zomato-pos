export type MoodTag = 'light_meal' | 'post_workout' | 'comfort_food' | 'budget_friendly' | 'high_protein' | 'quick_bite';

export interface MenuItemVariant {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isVeg: boolean;
  moodTags: MoodTag[];
  variants?: MenuItemVariant[];
  addons?: MenuItemAddon[];
  rating?: number;
  isAvailable?: boolean;
}
