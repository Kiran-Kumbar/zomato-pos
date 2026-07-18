export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  avatarUrl?: string;
  isPremium?: boolean;
}
