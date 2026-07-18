export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'ready' | 'picked_up' | 'on_the_way' | 'delivered' | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  quantity: number;
  variantId?: string;
  addonIds?: string[];
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  deliveryPartnerId?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
  surgeReason?: string;
  statusTimestamps?: Record<string, string>;
  orderType?: 'food' | 'grocery' | 'mixed';
}
