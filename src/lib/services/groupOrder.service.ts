import { GroupOrder } from '../types/groupOrder';

const groupOrders: GroupOrder[] = [];

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(): Promise<GroupOrder[]> {
  await delay();
  return [...groupOrders];
}

export async function getById(id: string): Promise<GroupOrder | undefined> {
  await delay();
  return groupOrders.find(g => g.id === id);
}

export async function create(data: Omit<GroupOrder, 'id'>): Promise<GroupOrder> {
  await delay();
  const newGroupOrder: GroupOrder = { ...data, id: `go${Date.now()}` };
  groupOrders.push(newGroupOrder);
  return newGroupOrder;
}

export async function update(id: string, data: Partial<GroupOrder>): Promise<GroupOrder> {
  await delay();
  const index = groupOrders.findIndex(g => g.id === id);
  if (index === -1) throw new Error('GroupOrder not found');
  const updated = { ...groupOrders[index], ...data };
  groupOrders[index] = updated;
  return updated;
}
