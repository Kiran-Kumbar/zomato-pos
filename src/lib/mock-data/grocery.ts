import { GroceryVendor, GroceryCategory, GroceryProduct, AIRecipe, RecipeKit, PantryItem } from '../types/grocery-ecosystem';

export const GROCERY_VENDORS: GroceryVendor[] = [
  { id: 'v1', name: 'Reliance Fresh', freshnessScore: 98, rating: 4.6, distanceKm: 1.2, etaMins: 15, bannerUrl: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c2', 'c3'] },
  { id: 'v2', name: 'DMart', freshnessScore: 95, rating: 4.8, distanceKm: 3.5, etaMins: 25, bannerUrl: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c4', 'c5'] },
  { id: 'v3', name: 'More', freshnessScore: 92, rating: 4.3, distanceKm: 2.1, etaMins: 20, bannerUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c2', 'c6'] },
  { id: 'v4', name: 'FreshMart', freshnessScore: 99, rating: 4.7, distanceKm: 0.8, etaMins: 10, bannerUrl: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c2'] },
  { id: 'v5', name: 'Organic Basket', freshnessScore: 100, rating: 4.9, distanceKm: 4.0, etaMins: 35, bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c2'] },
  { id: 'v6', name: 'Local Vegetable Shop', freshnessScore: 90, rating: 4.1, distanceKm: 0.5, etaMins: 8, bannerUrl: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=800&q=80&auto=format&fit=crop', categories: ['c1'] },
  { id: 'v7', name: 'Local Dairy', freshnessScore: 97, rating: 4.5, distanceKm: 1.5, etaMins: 12, bannerUrl: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2a009?w=800&q=80&auto=format&fit=crop', categories: ['c3'] },
  { id: 'v8', name: 'Organic Farms', freshnessScore: 100, rating: 4.8, distanceKm: 5.2, etaMins: 40, bannerUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a011d?w=800&q=80&auto=format&fit=crop', categories: ['c1', 'c2'] }
];

export const GROCERY_CATEGORIES: GroceryCategory[] = [
  { id: 'c1', name: 'Vegetables', imageUrl: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=400&q=80&auto=format&fit=crop' },
  { id: 'c2', name: 'Fruits', imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80&auto=format&fit=crop' },
  { id: 'c3', name: 'Dairy', imageUrl: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80&auto=format&fit=crop' },
  { id: 'c4', name: 'Bakery', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80&auto=format&fit=crop' },
  { id: 'c5', name: 'Snacks', imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80&auto=format&fit=crop' },
  { id: 'c6', name: 'Frozen Food', imageUrl: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&q=80&auto=format&fit=crop' },
  { id: 'c7', name: 'Beverages', imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80&auto=format&fit=crop' },
  { id: 'c8', name: 'Household', imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80&auto=format&fit=crop' },
  { id: 'c9', name: 'Cleaning', imageUrl: 'https://images.unsplash.com/photo-1584820927498-cafe3c073a6b?w=400&q=80&auto=format&fit=crop' },
  { id: 'c10', name: 'Personal Care', imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80&auto=format&fit=crop' },
  { id: 'c11', name: 'Baby Care', imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&q=80&auto=format&fit=crop' },
  { id: 'c12', name: 'Pet Care', imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&q=80&auto=format&fit=crop' }
];

const categoryProductMap: Record<string, string[]> = {
  c1: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80&auto=format&fit=crop'],
  c2: ['https://images.unsplash.com/photo-1528825871115-3581a5387919?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&q=80&auto=format&fit=crop'],
  c3: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80&auto=format&fit=crop'],
  c4: ['https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=300&q=80&auto=format&fit=crop'],
  c5: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599490659213-e2b9527bd08c?w=300&q=80&auto=format&fit=crop'],
  c6: ['https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80&auto=format&fit=crop'],
  c7: ['https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&q=80&auto=format&fit=crop'],
  c8: ['https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&q=80&auto=format&fit=crop'],
  c9: ['https://images.unsplash.com/photo-1584820927498-cafe3c073a6b?w=300&q=80&auto=format&fit=crop'],
  c10: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80&auto=format&fit=crop'],
  c11: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?w=300&q=80&auto=format&fit=crop'],
  c12: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&q=80&auto=format&fit=crop']
};

const getProductName = (categoryId: string, i: number, brand: string) => {
  const names: Record<string, string[]> = {
    c1: ['Fresh Tomato', 'Organic Potato', 'Green Peas', 'Onion', 'Carrot', 'Broccoli'],
    c2: ['Banana 1kg', 'Apple 4pcs', 'Mango 1kg', 'Orange 1kg', 'Grapes 500g', 'Watermelon 1pc'],
    c3: ['Toned Milk 1L', 'Butter 500g', 'Cheese Slices 200g', 'Paneer 200g', 'Curd 400g'],
    c4: ['White Bread 400g', 'Brown Bread 400g', 'Burger Buns', 'Pav 6pcs', 'Croissant'],
    c5: ['Potato Chips 150g', 'Nachos 150g', 'Bhujia 1kg', 'Mixed Namkeen', 'Popcorn 100g'],
    c6: ['Frozen Peas 1kg', 'French Fries 400g', 'Chicken Nuggets 500g', 'Ice Cream 1L'],
    c7: ['Cola 2L', 'Orange Juice 1L', 'Cold Coffee 200ml', 'Energy Drink 250ml', 'Mineral Water 1L'],
    c8: ['Tissue Paper 100s', 'Aluminium Foil 9m', 'Garbage Bags 30s', 'Light Bulb 9W', 'AA Batteries 4pcs'],
    c9: ['Liquid Detergent 1L', 'Floor Cleaner 1L', 'Dishwash Gel 500ml', 'Toilet Cleaner 500ml'],
    c10: ['Shampoo 400ml', 'Soap 4x100g', 'Toothpaste 150g', 'Body Wash 250ml'],
    c11: ['Baby Wipes 72s', 'Diapers Medium 72s', 'Baby Powder 200g', 'Baby Lotion 200ml'],
    c12: ['Dog Food 3kg', 'Cat Food 1.2kg', 'Pet Shampoo 200ml', 'Dog Treats 100g']
  };
  const list = names[categoryId] || ['Grocery Item'];
  return `${brand} ${list[i % list.length]}`;
}

const generateProducts = (): GroceryProduct[] => {
  const products: GroceryProduct[] = [];
  const brands = ['Amul', 'Nandini', 'Britannia', 'Haldirams', 'Lays', 'Aashirvaad', 'Tata', 'Fortune', 'Surf Excel', 'Dettol', 'Pampers', 'Pedigree', 'Fresho', 'Organic Tattva'];
  
  for (let i = 1; i <= 85; i++) {
    const categoryId = `c${(i % 12) + 1}`;
    const brand = brands[i % brands.length];
    
    const productImages = categoryProductMap[categoryId] || categoryProductMap['c1'];
    const imageUrl = productImages[i % productImages.length];

    products.push({
      id: `p${i}`,
      vendorId: `v${(i % 8) + 1}`,
      categoryId,
      name: getProductName(categoryId, i, brand),
      brand,
      price: Math.floor(Math.random() * 500) + 20,
      weight: `${Math.floor(Math.random() * 5) + 1} pc/kg`,
      imageUrl: imageUrl,
      expiryDate: i % 5 === 0 ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : undefined
    });
  }
  return products;
};

export const GROCERY_PRODUCTS = generateProducts();

export const AI_RECIPES: AIRecipe[] = [
  {
    id: 'r1',
    name: 'Butter Chicken',
    description: 'Rich, creamy North Indian curry with tender chicken in a spiced tomato gravy.',
    prepTime: 45,
    difficulty: 'Medium',
    calories: 650,
    imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken1.jpg',
    ingredients: [
      { name: 'Chicken', quantity: '500g', productIdMapping: ['p1', 'p2'] },
      { name: 'Butter', quantity: '50g', productIdMapping: ['p3'] },
      { name: 'Tomato Puree', quantity: '200ml', productIdMapping: ['p4'] }
    ],
    instructions: [
      "Marinate the chicken in spices for 30 minutes.",
      "Heat butter and cook chicken until browned.",
      "Add tomato puree and simmer for 15 minutes."
    ]
  },
  {
    id: 'r2',
    name: 'Masala Dosa',
    description: 'Crispy fermented crepe filled with spiced potato masala, served with chutney.',
    prepTime: 40,
    difficulty: 'Medium',
    calories: 350,
    imageUrl: 'https://foodish-api.com/images/dosa/dosa1.jpg',
    ingredients: [
      { name: 'Dosa Batter', quantity: '500g', productIdMapping: ['p5'] },
      { name: 'Potatoes', quantity: '300g', productIdMapping: ['p6'] },
      { name: 'Oil', quantity: '50ml', productIdMapping: ['p7'] }
    ],
    instructions: [
      "Boil and mash potatoes with spices.",
      "Spread dosa batter thinly on a hot pan.",
      "Place potato masala inside and fold."
    ]
  },
  {
    id: 'r3',
    name: 'Samosa Chaat',
    description: 'Crushed crispy samosas topped with spicy chole, sweet yogurt, and tangy chutneys.',
    prepTime: 25,
    difficulty: 'Easy',
    calories: 450,
    imageUrl: 'https://foodish-api.com/images/samosa/samosa1.jpg',
    ingredients: [
      { name: 'Frozen Samosas', quantity: '4 pcs', productIdMapping: ['p8'] },
      { name: 'Curd', quantity: '200g', productIdMapping: ['p9'] },
      { name: 'Chaat Masala', quantity: '10g', productIdMapping: ['p10'] }
    ],
    instructions: [
      "Fry or bake the samosas until golden.",
      "Crush samosas lightly on a plate.",
      "Top with yogurt, chutneys, and spices."
    ]
  },
  {
    id: 'r4',
    name: 'Vegetable Biryani',
    description: 'Aromatic basmati rice cooked with mixed vegetables and whole Indian spices.',
    prepTime: 50,
    difficulty: 'Hard',
    calories: 400,
    imageUrl: 'https://foodish-api.com/images/rice/rice1.jpg',
    ingredients: [
      { name: 'Basmati Rice', quantity: '500g', productIdMapping: ['p11'] },
      { name: 'Mixed Veggies', quantity: '300g', productIdMapping: ['p12'] },
      { name: 'Biryani Masala', quantity: '50g', productIdMapping: ['p13'] }
    ],
    instructions: [
      "Soak rice for 30 minutes and parboil.",
      "Cook vegetables with biryani masala.",
      "Layer rice and vegetables, and simmer."
    ]
  },
  {
    id: 'r5',
    name: 'Paneer Pizza',
    description: 'Fusion style pizza topped with spicy paneer tikka, onions, and gooey mozzarella cheese.',
    prepTime: 35,
    difficulty: 'Medium',
    calories: 600,
    imageUrl: 'https://foodish-api.com/images/pizza/pizza1.jpg',
    ingredients: [
      { name: 'Pizza Base', quantity: '2 pcs', productIdMapping: ['p14'] },
      { name: 'Paneer', quantity: '200g', productIdMapping: ['p15'] },
      { name: 'Cheese', quantity: '150g', productIdMapping: ['p16'] }
    ],
    instructions: [
      "Spread pizza sauce on the base.",
      "Top with marinated paneer, onions, and cheese.",
      "Bake at 200°C for 12-15 minutes."
    ]
  }
];

export const RECIPE_KITS: RecipeKit[] = [
  { id: 'k1', name: 'Diwali Special Sweets Kit', occasion: 'Diwali', productIds: ['p10', 'p11', 'p12'], totalPrice: 899, discountPercentage: 15 },
  { id: 'k2', name: 'Christmas Baking Kit', occasion: 'Christmas', productIds: ['p20', 'p21', 'p22', 'p23'], totalPrice: 1299, discountPercentage: 20 },
  { id: 'k3', name: 'Holi Snacks Kit', occasion: 'Holi', productIds: ['p30', 'p31'], totalPrice: 499, discountPercentage: 10 }
];

export const DEFAULT_PANTRY: PantryItem[] = [
  { id: 'pan1', name: 'Salt', quantity: '500g', lastRestocked: new Date().toISOString() },
  { id: 'pan2', name: 'Sugar', quantity: '1kg', lastRestocked: new Date().toISOString() },
  { id: 'pan3', name: 'Oil', quantity: '1L', lastRestocked: new Date().toISOString() },
  { id: 'pan4', name: 'Turmeric', quantity: '100g', lastRestocked: new Date().toISOString() },
  { id: 'pan5', name: 'Chilli Powder', quantity: '100g', lastRestocked: new Date().toISOString() },
  { id: 'pan6', name: 'Butter', quantity: '200g', lastRestocked: new Date().toISOString() }
];
