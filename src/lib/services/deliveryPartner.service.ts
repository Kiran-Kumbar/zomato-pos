import { DeliveryPartner } from '../types/deliveryPartner';
import { deliveryPartners } from '../mock-data';

const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

export async function list(): Promise<DeliveryPartner[]> {
  await delay();
  return [...deliveryPartners];
}

export async function getById(id: string): Promise<DeliveryPartner | undefined> {
  await delay();
  return deliveryPartners.find(d => d.id === id);
}

export async function create(data: Omit<DeliveryPartner, 'id'>): Promise<DeliveryPartner> {
  await delay();
  const newDeliveryPartner: DeliveryPartner = { ...data, id: `dp${Date.now()}` };
  deliveryPartners.push(newDeliveryPartner);
  return newDeliveryPartner;
}

export async function update(id: string, data: Partial<DeliveryPartner>): Promise<DeliveryPartner> {
  await delay();
  const index = deliveryPartners.findIndex(d => d.id === id);
  if (index === -1) throw new Error('DeliveryPartner not found');
  const updated = { ...deliveryPartners[index], ...data };
  deliveryPartners[index] = updated;
  return updated;
}
