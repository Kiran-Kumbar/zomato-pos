import { MenuItem } from '../types/menuItem';
import { menuItems } from '../mock-data';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(restaurantId?: string): Promise<MenuItem[]> {
  await delay();
  if (restaurantId) {
    return menuItems.filter(m => m.restaurantId === restaurantId);
  }
  return [...menuItems];
}

export async function getById(id: string): Promise<MenuItem | undefined> {
  await delay();
  return menuItems.find(m => m.id === id);
}

export async function create(data: Omit<MenuItem, 'id'>): Promise<MenuItem> {
  await delay();
  const newMenuItem: MenuItem = { ...data, id: `m${Date.now()}` };
  menuItems.push(newMenuItem);
  return newMenuItem;
}

export async function update(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
  await delay();
  const index = menuItems.findIndex(m => m.id === id);
  if (index === -1) throw new Error('MenuItem not found');
  const updated = { ...menuItems[index], ...data };
  menuItems[index] = updated;
  return updated;
}
