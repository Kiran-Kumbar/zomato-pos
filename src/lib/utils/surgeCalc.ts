export type SurgeBreakdownReason = 'High Demand' | 'Fewer Riders' | 'Rain' | 'Festival' | 'Late Night';

export interface SurgeDetail {
  reason: SurgeBreakdownReason;
  amount: number;
  message: string;
}

export interface SurgeResult {
  amount: number;
  details: SurgeDetail[];
}

/**
 * Mocks dynamic surge pricing based on current time or demand zones.
 */
export function calculateSurge(): SurgeResult {
  const currentHour = new Date().getHours();
  let amount = 0;
  const details: SurgeDetail[] = [];

  // Mock conditions
  if (currentHour >= 12 && currentHour <= 14) {
    details.push({ reason: 'High Demand', amount: 15, message: '3 restaurants near you are at capacity' });
  }
  
  if (currentHour >= 20 && currentHour <= 22) {
    details.push({ reason: 'High Demand', amount: 15, message: 'Higher than usual orders in your area' });
    details.push({ reason: 'Fewer Riders', amount: 5, message: '12 delivery partners active in your zone' });
  }

  if (currentHour >= 23 || currentHour < 5) {
    details.push({ reason: 'Late Night', amount: 30, message: 'Late night delivery operations' });
  }

  const randomFactor = Math.random();
  if (randomFactor > 0.8) {
    details.push({ reason: 'Rain', amount: 25, message: 'Rainy weather slows down riders' });
  } else if (randomFactor > 0.6 && randomFactor <= 0.8) {
    details.push({ reason: 'Festival', amount: 10, message: 'Holiday season high demand' });
  }
  
  // Guarantee a surge exists for demo visibility
  if (details.length === 0) {
     details.push({ reason: 'High Demand', amount: 12, message: 'High order volume in your area' });
  }

  amount = details.reduce((acc, curr) => acc + curr.amount, 0);

  return { amount, details };
}
