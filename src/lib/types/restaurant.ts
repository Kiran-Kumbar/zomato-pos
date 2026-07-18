export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  deliveryTimeMinutes: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  transparencyScore: number;
  ecoDeliveriesCount: number;
  isPromoted?: boolean;
  address: string;
}
