export type PaymentMethod = 'upi' | 'credit_card' | 'debit_card' | 'wallet' | 'cash_on_delivery';

export interface Payment {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}
