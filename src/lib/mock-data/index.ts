import { User } from '../types/user';
import { Restaurant } from '../types/restaurant';
import { MenuItem } from '../types/menuItem';
import { Order } from '../types/order';
import { DeliveryPartner } from '../types/deliveryPartner';
import { Review } from '../types/review';
import { Notification } from '../types/notification';

export const users: User[] = [
  { id: 'u1', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+919876543210', address: '123 MG Road, Bangalore', isPremium: true },
  { id: 'u2', name: 'Priya Patel', email: 'priya@example.com', phone: '+919876543211', address: '456 Indiranagar, Bangalore' },
  { id: 'u3', name: 'Amit Kumar', email: 'amit@example.com', phone: '+919876543212', address: '789 Koramangala, Bangalore', isPremium: true },
  { id: 'u4', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+919876543213', address: '101 Whitefield, Bangalore' },
  { id: 'u5', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+919876543214', address: '202 HSR Layout, Bangalore' },
  { id: 'u6', name: 'Neha Gupta', email: 'neha@example.com', phone: '+919876543215', address: '303 Jayanagar, Bangalore', isPremium: true },
];

export const restaurants: Restaurant[] = [
  { id: 'r1', name: 'Punjabi Dhaba', cuisine: ['North Indian', 'Mughlai'], rating: 4.5, deliveryTimeMinutes: 35, priceRange: '$$', imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken17.jpg', transparencyScore: 92, ecoDeliveriesCount: 450, address: 'Koramangala, Bangalore', isPromoted: true },
  { id: 'r2', name: 'Dakshin Delights', cuisine: ['South Indian'], rating: 4.2, deliveryTimeMinutes: 25, priceRange: '$', imageUrl: 'https://foodish-api.com/images/dosa/dosa42.jpg', transparencyScore: 85, ecoDeliveriesCount: 320, address: 'Indiranagar, Bangalore' },
  { id: 'r3', name: 'Wok This Way', cuisine: ['Chinese', 'Asian'], rating: 4.0, deliveryTimeMinutes: 40, priceRange: '$$', imageUrl: 'undefined', transparencyScore: 78, ecoDeliveriesCount: 150, address: 'MG Road, Bangalore' },
  { id: 'r4', name: 'Tuscany Pizzeria', cuisine: ['Italian', 'Pizza'], rating: 4.7, deliveryTimeMinutes: 45, priceRange: '$$$', imageUrl: 'https://foodish-api.com/images/pizza/pizza22.jpg', transparencyScore: 95, ecoDeliveriesCount: 500, address: 'Whitefield, Bangalore', isPromoted: true },
  { id: 'r5', name: 'The Daily Grind', cuisine: ['Cafe', 'Beverages', 'Fast Food'], rating: 4.3, deliveryTimeMinutes: 20, priceRange: '$$', imageUrl: 'undefined', transparencyScore: 88, ecoDeliveriesCount: 200, address: 'HSR Layout, Bangalore' },
  { id: 'r6', name: 'Paradise Biryani', cuisine: ['Biryani', 'Mughlai'], rating: 4.8, deliveryTimeMinutes: 30, priceRange: '$$', imageUrl: 'https://foodish-api.com/images/biryani/biryani52.jpg', transparencyScore: 90, ecoDeliveriesCount: 800, address: 'Jayanagar, Bangalore' },
  { id: 'r7', name: 'Sugar Rush', cuisine: ['Desserts', 'Bakery'], rating: 4.6, deliveryTimeMinutes: 15, priceRange: '$$', imageUrl: 'https://foodish-api.com/images/dessert/dessert20.jpg', transparencyScore: 89, ecoDeliveriesCount: 120, address: 'Koramangala, Bangalore' },
  { id: 'r8', name: 'Tandoori Tales', cuisine: ['North Indian'], rating: 4.1, deliveryTimeMinutes: 35, priceRange: '$$', imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken20.jpg', transparencyScore: 82, ecoDeliveriesCount: 250, address: 'Indiranagar, Bangalore' },
  { id: 'r9', name: 'Burger Joint', cuisine: ['Fast Food', 'American'], rating: 3.9, deliveryTimeMinutes: 25, priceRange: '$', imageUrl: 'https://foodish-api.com/images/burger/burger20.jpg', transparencyScore: 75, ecoDeliveriesCount: 90, address: 'MG Road, Bangalore' },
  { id: 'r10', name: 'Green Bowl', cuisine: ['Healthy Food', 'Salads'], rating: 4.4, deliveryTimeMinutes: 30, priceRange: '$$$', imageUrl: 'https://foodish-api.com/images/rice/rice21.jpg', transparencyScore: 96, ecoDeliveriesCount: 600, address: 'Whitefield, Bangalore' },
];

export const menuItems: MenuItem[] = [
  // Restaurant 1: Punjabi Dhaba (North Indian)
  { id: 'm1', restaurantId: 'r1', name: 'Butter Chicken', description: 'Creamy and rich tomato-based curry.', price: 250, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken12.jpg', isVeg: false, moodTags: ['comfort_food'], variants: [{ id: 'v1', name: 'Half', price: 250 }, { id: 'v2', name: 'Full', price: 450 }] },
  { id: 'm2', restaurantId: 'r1', name: 'Dal Makhani', description: 'Slow-cooked black lentils.', price: 180, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken4.jpg', isVeg: true, moodTags: ['comfort_food', 'budget_friendly'] },
  { id: 'm3', restaurantId: 'r1', name: 'Garlic Naan', description: 'Soft bread topped with garlic and butter.', price: 40, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken14.jpg', isVeg: true, moodTags: ['budget_friendly'] },
  { id: 'm4', restaurantId: 'r1', name: 'Paneer Tikka', description: 'Grilled cottage cheese skewers.', price: 220, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken6.jpg', isVeg: true, moodTags: ['high_protein', 'light_meal'] },
  { id: 'm5', restaurantId: 'r1', name: 'Lassi', description: 'Sweet yogurt drink.', price: 60, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken6.jpg', isVeg: true, moodTags: ['quick_bite'] },

  // Restaurant 2: Dakshin Delights (South Indian)
  { id: 'm6', restaurantId: 'r2', name: 'Masala Dosa', description: 'Crispy crepe filled with spiced potatoes.', price: 90, imageUrl: 'https://foodish-api.com/images/idly/idly23.jpg', isVeg: true, moodTags: ['budget_friendly', 'light_meal'], addons: [{ id: 'a1', name: 'Extra Sambhar', price: 20 }] },
  { id: 'm7', restaurantId: 'r2', name: 'Idli Vada', description: 'Steamed rice cakes and fried lentil donuts.', price: 70, imageUrl: 'https://foodish-api.com/images/idly/idly4.jpg', isVeg: true, moodTags: ['budget_friendly', 'quick_bite'] },
  { id: 'm8', restaurantId: 'r2', name: 'Pongal', description: 'Savory rice and lentil dish.', price: 80, imageUrl: 'https://foodish-api.com/images/idly/idly34.jpg', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm9', restaurantId: 'r2', name: 'Filter Coffee', description: 'Traditional South Indian coffee.', price: 30, imageUrl: 'https://foodish-api.com/images/idly/idly69.jpg', isVeg: true, moodTags: ['quick_bite', 'budget_friendly'] },
  { id: 'm10', restaurantId: 'r2', name: 'Uttapam', description: 'Thick pancake with onion and tomato.', price: 85, imageUrl: 'https://foodish-api.com/images/idly/idly72.jpg', isVeg: true, moodTags: ['light_meal'] },

  // Restaurant 3: Wok This Way (Chinese)
  { id: 'm11', restaurantId: 'r3', name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables.', price: 150, imageUrl: 'undefined', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm12', restaurantId: 'r3', name: 'Chilli Chicken', description: 'Spicy tossed chicken.', price: 200, imageUrl: 'undefined', isVeg: false, moodTags: ['high_protein'] },
  { id: 'm13', restaurantId: 'r3', name: 'Veg Manchurian', description: 'Vegetable dumplings in soy sauce.', price: 160, imageUrl: 'undefined', isVeg: true, moodTags: ['budget_friendly'] },
  { id: 'm14', restaurantId: 'r3', name: 'Sweet Corn Soup', description: 'Comforting corn soup.', price: 110, imageUrl: 'undefined', isVeg: true, moodTags: ['light_meal'] },

  // Restaurant 4: Tuscany Pizzeria (Italian)
  { id: 'm15', restaurantId: 'r4', name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', price: 350, imageUrl: 'https://foodish-api.com/images/pasta/pasta22.jpg', isVeg: true, moodTags: ['comfort_food'], variants: [{ id: 'v3', name: 'Regular', price: 350 }, { id: 'v4', name: 'Large', price: 550 }] },
  { id: 'm16', restaurantId: 'r4', name: 'Pepperoni Pizza', description: 'Pizza topped with pepperoni slices.', price: 450, imageUrl: 'https://foodish-api.com/images/pasta/pasta11.jpg', isVeg: false, moodTags: ['comfort_food'], addons: [{ id: 'a2', name: 'Extra Cheese', price: 50 }] },
  { id: 'm17', restaurantId: 'r4', name: 'Penne Arrabbiata', description: 'Spicy tomato pasta.', price: 280, imageUrl: 'https://foodish-api.com/images/pasta/pasta14.jpg', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm18', restaurantId: 'r4', name: 'Garlic Bread', description: 'Toasted bread with garlic butter.', price: 120, imageUrl: 'https://foodish-api.com/images/pasta/pasta2.jpg', isVeg: true, moodTags: ['quick_bite'] },
  { id: 'm19', restaurantId: 'r4', name: 'Tiramisu', description: 'Coffee-flavored Italian dessert.', price: 180, imageUrl: 'https://foodish-api.com/images/pasta/pasta13.jpg', isVeg: true, moodTags: ['comfort_food'] },

  // Restaurant 5: The Daily Grind (Cafe)
  { id: 'm20', restaurantId: 'r5', name: 'Cappuccino', description: 'Espresso with steamed milk.', price: 120, imageUrl: 'undefined', isVeg: true, moodTags: ['quick_bite'] },
  { id: 'm21', restaurantId: 'r5', name: 'Club Sandwich', description: 'Multi-layered vegetable sandwich.', price: 150, imageUrl: 'undefined', isVeg: true, moodTags: ['light_meal'] },
  { id: 'm22', restaurantId: 'r5', name: 'French Fries', description: 'Crispy salted fries.', price: 90, imageUrl: 'undefined', isVeg: true, moodTags: ['quick_bite', 'budget_friendly'] },
  { id: 'm23', restaurantId: 'r5', name: 'Cold Coffee', description: 'Chilled creamy coffee.', price: 140, imageUrl: 'undefined', isVeg: true, moodTags: ['quick_bite'] },

  // Restaurant 6: Paradise Biryani (Biryani)
  { id: 'm24', restaurantId: 'r6', name: 'Chicken Biryani', description: 'Aromatic basmati rice cooked with spiced chicken.', price: 250, imageUrl: 'https://foodish-api.com/images/biryani/biryani73.jpg', isVeg: false, moodTags: ['comfort_food', 'high_protein'] },
  { id: 'm25', restaurantId: 'r6', name: 'Mutton Biryani', description: 'Rich biryani with tender mutton pieces.', price: 350, imageUrl: 'https://foodish-api.com/images/biryani/biryani9.jpg', isVeg: false, moodTags: ['comfort_food', 'high_protein'] },
  { id: 'm26', restaurantId: 'r6', name: 'Veg Biryani', description: 'Fragrant rice with mixed vegetables.', price: 200, imageUrl: 'https://foodish-api.com/images/biryani/biryani45.jpg', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm27', restaurantId: 'r6', name: 'Chicken Kebab', description: 'Spicy fried chicken.', price: 180, imageUrl: 'https://foodish-api.com/images/biryani/biryani80.jpg', isVeg: false, moodTags: ['high_protein', 'quick_bite'] },
  { id: 'm28', restaurantId: 'r6', name: 'Mirchi Ka Salan', description: 'Peanut and chili curry.', price: 50, imageUrl: 'https://foodish-api.com/images/biryani/biryani14.jpg', isVeg: true, moodTags: ['budget_friendly'] },

  // Restaurant 7: Sugar Rush (Desserts)
  { id: 'm29', restaurantId: 'r7', name: 'Chocolate Truffle Cake', description: 'Rich chocolate cake.', price: 150, imageUrl: 'https://foodish-api.com/images/dessert/dessert28.jpg', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm30', restaurantId: 'r7', name: 'Red Velvet Cupcake', description: 'Soft cupcake with cream cheese frosting.', price: 80, imageUrl: 'https://foodish-api.com/images/dessert/dessert15.jpg', isVeg: true, moodTags: ['quick_bite'] },
  { id: 'm31', restaurantId: 'r7', name: 'Vanilla Ice Cream', description: 'Classic vanilla bean ice cream.', price: 60, imageUrl: 'https://foodish-api.com/images/dessert/dessert18.jpg', isVeg: true, moodTags: ['budget_friendly'] },
  { id: 'm32', restaurantId: 'r7', name: 'Brownie', description: 'Fudgy walnut brownie.', price: 90, imageUrl: 'https://foodish-api.com/images/dessert/dessert7.jpg', isVeg: true, moodTags: ['comfort_food', 'quick_bite'] },

  // Restaurant 8: Tandoori Tales (North Indian)
  { id: 'm33', restaurantId: 'r8', name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato gravy.', price: 220, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken6.jpg', isVeg: true, moodTags: ['comfort_food'] },
  { id: 'm34', restaurantId: 'r8', name: 'Jeera Rice', description: 'Cumin flavored rice.', price: 110, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken11.jpg', isVeg: true, moodTags: ['budget_friendly'] },
  { id: 'm35', restaurantId: 'r8', name: 'Tandoori Chicken', description: 'Roasted marinated chicken.', price: 280, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken6.jpg', isVeg: false, moodTags: ['high_protein', 'post_workout'] },
  { id: 'm36', restaurantId: 'r8', name: 'Malai Kofta', description: 'Potato and paneer dumplings in cream sauce.', price: 240, imageUrl: 'https://foodish-api.com/images/butter-chicken/butter-chicken13.jpg', isVeg: true, moodTags: ['comfort_food'] },

  // Restaurant 9: Burger Joint (Fast Food)
  { id: 'm37', restaurantId: 'r9', name: 'Classic Chicken Burger', description: 'Fried chicken patty with mayo.', price: 160, imageUrl: 'https://foodish-api.com/images/burger/burger47.jpg', isVeg: false, moodTags: ['comfort_food', 'quick_bite'] },
  { id: 'm38', restaurantId: 'r9', name: 'Veggie Burger', description: 'Mixed vegetable patty.', price: 120, imageUrl: 'https://foodish-api.com/images/burger/burger4.jpg', isVeg: true, moodTags: ['budget_friendly', 'quick_bite'] },
  { id: 'm39', restaurantId: 'r9', name: 'Onion Rings', description: 'Crispy fried onion rings.', price: 90, imageUrl: 'https://foodish-api.com/images/burger/burger34.jpg', isVeg: true, moodTags: ['quick_bite'] },
  { id: 'm40', restaurantId: 'r9', name: 'Oreo Shake', description: 'Thick shake blended with Oreos.', price: 150, imageUrl: 'https://foodish-api.com/images/burger/burger30.jpg', isVeg: true, moodTags: ['comfort_food'] },

  // Restaurant 10: Green Bowl (Healthy Food)
  { id: 'm41', restaurantId: 'r10', name: 'Quinoa Salad', description: 'Fresh veggies with quinoa and vinaigrette.', price: 220, imageUrl: 'https://foodish-api.com/images/rice/rice8.jpg', isVeg: true, moodTags: ['light_meal', 'post_workout', 'high_protein'] },
  { id: 'm42', restaurantId: 'r10', name: 'Grilled Chicken Breast', description: 'Herb marinated grilled chicken.', price: 250, imageUrl: 'https://foodish-api.com/images/rice/rice7.jpg', isVeg: false, moodTags: ['post_workout', 'high_protein'] },
  { id: 'm43', restaurantId: 'r10', name: 'Fruit Bowl', description: 'Assorted seasonal fresh fruits.', price: 180, imageUrl: 'https://foodish-api.com/images/rice/rice26.jpg', isVeg: true, moodTags: ['light_meal', 'budget_friendly'] },
  { id: 'm44', restaurantId: 'r10', name: 'Detox Juice', description: 'Apple, carrot, and beetroot blend.', price: 120, imageUrl: 'https://foodish-api.com/images/rice/rice9.jpg', isVeg: true, moodTags: ['light_meal', 'quick_bite'] },
  { id: 'm45', restaurantId: 'r10', name: 'Avocado Toast', description: 'Mashed avocado on multigrain bread.', price: 200, imageUrl: 'https://foodish-api.com/images/rice/rice28.jpg', isVeg: true, moodTags: ['light_meal'] },
];

export const deliveryPartners: DeliveryPartner[] = [
  { id: 'dp1', name: 'Suresh Das', phone: '+919988776655', vehicleType: 'bike', rating: 4.8, earningsBreakdown: [{ date: '2026-07-15', amount: 1200, trips: 15 }, { date: '2026-07-16', amount: 1500, trips: 18 }], currentLocation: { lat: 12.9716, lng: 77.5946 } },
  { id: 'dp2', name: 'Ramesh Singh', phone: '+919988776656', vehicleType: 'bicycle', rating: 4.5, earningsBreakdown: [{ date: '2026-07-15', amount: 800, trips: 12 }, { date: '2026-07-16', amount: 950, trips: 14 }], currentLocation: { lat: 12.9352, lng: 77.6245 } },
  { id: 'dp3', name: 'Abdul Khan', phone: '+919988776657', vehicleType: 'bike', rating: 4.9, earningsBreakdown: [{ date: '2026-07-15', amount: 2000, trips: 22 }, { date: '2026-07-16', amount: 1800, trips: 20 }], currentLocation: { lat: 12.9279, lng: 77.6271 } },
  { id: 'dp4', name: 'Manoj Kumar', phone: '+919988776658', vehicleType: 'car', rating: 4.2, earningsBreakdown: [{ date: '2026-07-15', amount: 1500, trips: 10 }, { date: '2026-07-16', amount: 1600, trips: 11 }] },
  { id: 'dp5', name: 'Kishore V', phone: '+919988776659', vehicleType: 'bike', rating: 4.7, earningsBreakdown: [{ date: '2026-07-15', amount: 1100, trips: 14 }, { date: '2026-07-16', amount: 1300, trips: 16 }] },
];

export const orders: Order[] = [
  { id: 'o1', userId: 'u1', restaurantId: 'r1', deliveryPartnerId: 'dp1', items: [{ menuItemId: 'm1', quantity: 1, price: 250 }, { menuItemId: 'm3', quantity: 2, price: 40 }], totalAmount: 330, status: 'delivered', createdAt: '2026-07-15T18:30:00Z', deliveredAt: '2026-07-15T19:15:00Z' },
  { id: 'o2', userId: 'u2', restaurantId: 'r2', deliveryPartnerId: 'dp2', items: [{ menuItemId: 'm6', quantity: 2, price: 90 }, { menuItemId: 'm9', quantity: 2, price: 30 }], totalAmount: 240, status: 'delivered', createdAt: '2026-07-15T09:00:00Z', deliveredAt: '2026-07-15T09:30:00Z' },
  { id: 'o3', userId: 'u3', restaurantId: 'r4', deliveryPartnerId: 'dp3', items: [{ menuItemId: 'm15', quantity: 1, variantId: 'v4', price: 550 }, { menuItemId: 'm18', quantity: 1, price: 120 }], totalAmount: 670, status: 'delivered', createdAt: '2026-07-16T20:00:00Z', deliveredAt: '2026-07-16T20:50:00Z', surgeReason: 'High demand in your area' },
  { id: 'o4', userId: 'u4', restaurantId: 'r6', deliveryPartnerId: 'dp1', items: [{ menuItemId: 'm24', quantity: 1, price: 250 }, { menuItemId: 'm27', quantity: 1, price: 180 }], totalAmount: 430, status: 'on_the_way', createdAt: '2026-07-17T11:00:00Z' },
  { id: 'o5', userId: 'u5', restaurantId: 'r10', deliveryPartnerId: 'dp5', items: [{ menuItemId: 'm41', quantity: 1, price: 220 }, { menuItemId: 'm44', quantity: 1, price: 120 }], totalAmount: 340, status: 'preparing', createdAt: '2026-07-17T11:15:00Z' },
  { id: 'o6', userId: 'u6', restaurantId: 'r7', items: [{ menuItemId: 'm29', quantity: 1, price: 150 }], totalAmount: 150, status: 'placed', createdAt: '2026-07-17T11:25:00Z' },
  { id: 'o7', userId: 'u1', restaurantId: 'r3', deliveryPartnerId: 'dp4', items: [{ menuItemId: 'm11', quantity: 1, price: 150 }, { menuItemId: 'm12', quantity: 1, price: 200 }], totalAmount: 350, status: 'delivered', createdAt: '2026-07-14T19:30:00Z', deliveredAt: '2026-07-14T20:15:00Z', surgeReason: 'Rain in your area' },
  { id: 'o8', userId: 'u2', restaurantId: 'r5', deliveryPartnerId: 'dp2', items: [{ menuItemId: 'm20', quantity: 1, price: 120 }, { menuItemId: 'm21', quantity: 1, price: 150 }], totalAmount: 270, status: 'delivered', createdAt: '2026-07-13T16:00:00Z', deliveredAt: '2026-07-13T16:30:00Z' },
  { id: 'o9', userId: 'u3', restaurantId: 'r9', deliveryPartnerId: 'dp3', items: [{ menuItemId: 'm37', quantity: 2, price: 160 }, { menuItemId: 'm39', quantity: 1, price: 90 }], totalAmount: 410, status: 'cancelled', createdAt: '2026-07-12T14:00:00Z' },
  { id: 'o10', userId: 'u4', restaurantId: 'r8', deliveryPartnerId: 'dp1', items: [{ menuItemId: 'm33', quantity: 1, price: 220 }, { menuItemId: 'm34', quantity: 2, price: 110 }], totalAmount: 440, status: 'delivered', createdAt: '2026-07-16T21:00:00Z', deliveredAt: '2026-07-16T21:45:00Z' },
  { id: 'o11', userId: 'u5', restaurantId: 'r1', deliveryPartnerId: 'dp5', items: [{ menuItemId: 'm2', quantity: 1, price: 180 }, { menuItemId: 'm5', quantity: 2, price: 60 }], totalAmount: 300, status: 'delivered', createdAt: '2026-07-11T13:00:00Z', deliveredAt: '2026-07-11T13:40:00Z', surgeReason: 'Festival rush' },
  { id: 'o12', userId: 'u6', restaurantId: 'r4', deliveryPartnerId: 'dp4', items: [{ menuItemId: 'm16', quantity: 1, addonIds: ['a2'], price: 500 }], totalAmount: 500, status: 'delivered', createdAt: '2026-07-10T19:30:00Z', deliveredAt: '2026-07-10T20:20:00Z' },
  { id: 'o13', userId: 'u1', restaurantId: 'r10', deliveryPartnerId: 'dp3', items: [{ menuItemId: 'm42', quantity: 1, price: 250 }], totalAmount: 250, status: 'delivered', createdAt: '2026-07-09T13:00:00Z', deliveredAt: '2026-07-09T13:30:00Z' },
  { id: 'o14', userId: 'u2', restaurantId: 'r7', deliveryPartnerId: 'dp2', items: [{ menuItemId: 'm32', quantity: 3, price: 90 }], totalAmount: 270, status: 'delivered', createdAt: '2026-07-08T15:00:00Z', deliveredAt: '2026-07-08T15:20:00Z' },
  { id: 'o15', userId: 'u3', restaurantId: 'r6', deliveryPartnerId: 'dp1', items: [{ menuItemId: 'm25', quantity: 2, price: 350 }], totalAmount: 700, status: 'delivered', createdAt: '2026-07-07T20:00:00Z', deliveredAt: '2026-07-07T20:45:00Z' },
];

export const reviews: Review[] = [
  { id: 'rev1', userId: 'u1', restaurantId: 'r1', orderId: 'o1', rating: 5, comment: 'Amazing Butter Chicken! Highly recommended.', createdAt: '2026-07-15T20:00:00Z', videoUrl: 'https://example.com/video1.mp4' },
  { id: 'rev2', userId: 'u2', restaurantId: 'r2', orderId: 'o2', rating: 4, comment: 'Good food, but sambhar was a bit cold.', createdAt: '2026-07-15T10:00:00Z' },
  { id: 'rev3', userId: 'u3', restaurantId: 'r4', orderId: 'o3', rating: 5, comment: 'Best pizza in town. Crust was perfect.', createdAt: '2026-07-17T09:00:00Z', imageUrls: ['/mock/review1.jpg'] },
  { id: 'rev4', userId: 'u1', restaurantId: 'r3', orderId: 'o7', rating: 3, comment: 'Noodles were a bit too oily for my taste.', createdAt: '2026-07-14T21:00:00Z' },
  { id: 'rev5', userId: 'u4', restaurantId: 'r8', orderId: 'o10', rating: 5, comment: 'Tandoori chicken was perfectly cooked.', createdAt: '2026-07-16T22:30:00Z', videoUrl: 'https://example.com/video2.mp4' },
  { id: 'rev6', userId: 'u5', restaurantId: 'r1', orderId: 'o11', rating: 4, comment: 'Dal makhani was good. Arrived on time despite rain.', createdAt: '2026-07-11T14:30:00Z' },
  { id: 'rev7', userId: 'u6', restaurantId: 'r4', orderId: 'o12', rating: 5, comment: 'Extra cheese makes it so much better!', createdAt: '2026-07-10T21:00:00Z' },
  { id: 'rev8', userId: 'u3', restaurantId: 'r6', orderId: 'o15', rating: 5, comment: 'Authentic taste. Loved the mutton biryani.', createdAt: '2026-07-08T09:00:00Z' },
];

export const notifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Order Delivered', message: 'Your order from Punjabi Dhaba has been delivered.', isRead: true, createdAt: '2026-07-15T19:15:00Z', type: 'order_update' },
  { id: 'n2', userId: 'u4', title: 'Order is on the way', message: 'Your order from Paradise Biryani is out for delivery.', isRead: false, createdAt: '2026-07-17T11:00:00Z', type: 'order_update' },
  { id: 'n3', userId: 'u1', title: '50% Off on Pizzas!', message: 'Use code PIZZA50 at Tuscany Pizzeria.', isRead: false, createdAt: '2026-07-17T10:00:00Z', type: 'promo' },
  { id: 'n4', userId: 'u3', title: 'System Maintenance', message: 'App will be down for 30 minutes tonight.', isRead: true, createdAt: '2026-07-16T08:00:00Z', type: 'system' },
];
