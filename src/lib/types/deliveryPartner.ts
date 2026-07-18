export interface EarningsBreakdown {
  date: string;
  amount: number;
  trips: number;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'bicycle' | 'car';
  rating: number;
  earningsBreakdown: EarningsBreakdown[];
  currentLocation?: { lat: number; lng: number };
  photoUrl?: string;
  vehicleDetails?: {
    model: string;
    plateNumber: string;
  };
}
