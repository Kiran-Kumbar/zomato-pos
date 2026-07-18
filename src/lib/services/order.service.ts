import { Order } from '../types/order';
import { orders } from '../mock-data';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(userId?: string): Promise<Order[]> {
  await delay();
  if (userId) {
    return orders.filter(o => o.userId === userId);
  }
  return [...orders];
}

export async function getById(id: string): Promise<Order | undefined> {
  await delay();
  return orders.find(o => o.id === id);
}

export async function create(data: Omit<Order, 'id'>): Promise<Order> {
  await delay();
  const newOrder: Order = { ...data, id: `o${Date.now()}` };
  orders.push(newOrder);
  return newOrder;
}

export async function update(id: string, data: Partial<Order>): Promise<Order> {
  await delay();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) throw new Error('Order not found');
  const updated = { ...orders[index], ...data };
  orders[index] = updated;
  return updated;
}
