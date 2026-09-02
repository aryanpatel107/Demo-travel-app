import type { Destination } from "../type/destination";

export const destinations: Destination[] = [
  {
    id: "bali-indonesia",
    name: "Bali",
    country: "Indonesia",
    description: "Lush rice terraces, sacred temples, and world-class surf breaks.",
    longDescription:
      "Bali blends spiritual tradition with tropical escape. Explore the terraced rice paddies of Ubud, surf the swells off Uluwatu, and unwind on white-sand beaches. The island's temples, like Tanah Lot, offer stunning sunset views and a glimpse into centuries-old Balinese Hindu culture.",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
    price: 899,
    rating: 4.8,
    tags: ["beach", "culture", "nature"],
    duration: "7-10 days",
  },
  {
    id: "santorini-greece",
    name: "Santorini",
    country: "Greece",
    description: "Whitewashed villages perched above the deep blue Aegean Sea.",
    longDescription:
      "Santorini's caldera views, cliffside architecture, and volcanic beaches make it one of the most photographed destinations on earth. Wander Oia's narrow streets at sunset, sample local wines grown in volcanic soil, and sail around the caldera to hidden coves.",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff",
    price: 1299,
    rating: 4.9,
    tags: ["beach", "romance", "island"],
    duration: "5-7 days",
  },
  {
    id: "kyoto-japan",
    name: "Kyoto",
    country: "Japan",
    description: "Historic temples, bamboo groves, and serene Zen gardens.",
    longDescription:
      "Kyoto was once Japan's imperial capital and remains its cultural heart. Walk through the thousands of vermillion torii gates at Fushimi Inari, stroll the Arashiyama bamboo grove, and experience traditional tea ceremonies in a city where the past feels alive.",
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    price: 1099,
    rating: 4.7,
    tags: ["culture", "history", "nature"],
    duration: "6-8 days",
  },
  {
    id: "patagonia-argentina",
    name: "Patagonia",
    country: "Argentina",
    description: "Dramatic peaks, glaciers, and windswept wilderness trails.",
    longDescription:
      "Patagonia rewards travelers with some of the most rugged, untouched landscapes on the planet. Trek beneath the granite spires of Fitz Roy, watch the Perito Moreno glacier calve into turquoise lakes, and camp under some of the clearest night skies in the Southern Hemisphere.",
    imageUrl: "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca",
    price: 1599,
    rating: 4.9,
    tags: ["adventure", "nature", "hiking"],
    duration: "10-14 days",
  },
];

export function getDestinationById(id: string): Destination | undefined {
  return destinations.find((d) => d.id === id);
}
