export interface GroupOrderMember {
  userId: string;
  name: string;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  paymentStatus?: 'pending' | 'paid';
}

export interface GroupOrder {
  id: string;
  hostUserId: string;
  restaurantId: string;
  members: GroupOrderMember[];
  status: 'open' | 'locked' | 'ordered';
  totalAmount: number;
}
