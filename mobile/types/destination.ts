export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  price: number;
  rating: number;
  tags: string[];
  duration: string; // e.g. "5-7 days"
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