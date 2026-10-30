export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  price: number;
  currency?: string;
  durationDays?: number;
  duration: string; // e.g. "5-7 days"
  tags: string[];
  rating: number;
  isActive?: boolean;
  brand?: string | null;
}

export interface WishlistItem {
  id: string;
  userId: string;
  brandId: string;
  destinationId: string;
  createdAt: string;
  destination: Destination;
}

export interface Trip {
  id: string;
  destinationId: string;
  destinationName: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes?: string;
}