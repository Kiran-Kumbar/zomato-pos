import { GroceryVendor, GroceryProduct } from '../types/grocery';

export const MOCK_GROCERY_VENDORS: GroceryVendor[] = [
  {
    id: 'v1',
    name: 'Reliance Fresh',
    rating: 4.5,
    distance: '1.2 km',
    estimatedTime: '12 mins',
    bannerImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'v2',
    name: 'DMart',
    rating: 4.8,
    distance: '3.5 km',
    estimatedTime: '25 mins',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    isPremium: true
  },
  {
    id: 'v3',
    name: 'Organic Basket',
    rating: 4.9,
    distance: '2.1 km',
    estimatedTime: '18 mins',
    bannerImage: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&q=80&w=800',
    isPremium: true
  },
  {
    id: 'v4',
    name: 'Local Dairy',
    rating: 4.2,
    distance: '0.5 km',
    estimatedTime: '8 mins',
    bannerImage: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=800'
  }
];

export const MOCK_GROCERY_PRODUCTS: GroceryProduct[] = [
  {
    id: 'p1',
    vendorId: 'v1',
    name: 'Amul Taaza Milk',
    category: 'Dairy',
    price: 54,
    weight: '1 L',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400',
    inStock: true
  },
  {
    id: 'p2',
    vendorId: 'v1',
    name: 'Fresh Tomatoes',
    category: 'Vegetables',
    price: 45,
    originalPrice: 60,
    weight: '1 kg',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=400',
    inStock: true
  },
  {
    id: 'p3',
    vendorId: 'v2',
    name: 'Farm Fresh Onions',
    category: 'Vegetables',
    price: 35,
    weight: '1 kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&q=80&w=400',
    inStock: true
  },
  {
    id: 'p4',
    vendorId: 'v3',
    name: 'Organic Paneer',
    category: 'Dairy',
    price: 120,
    weight: '200 g',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc0?auto=format&fit=crop&q=80&w=400',
    inStock: true
  },
  {
    id: 'p5',
    vendorId: 'v1',
    name: 'Whole Wheat Bread',
    category: 'Bakery',
    price: 40,
    weight: '400 g',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400',
    inStock: true
  },
  {
    id: 'p6',
    vendorId: 'v4',
    name: 'Nandini Fresh Cream',
    category: 'Dairy',
    price: 65,
    weight: '200 ml',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&q=80&w=400',
    inStock: true
  }
];
