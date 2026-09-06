export type Service = {
  id: string;
  name: string;
  icon: string;
  from: number;
  blurb: string;
};

export type Worker = {
  id: string;
  name: string;
  serviceId: string;
  rating: number;
  reviews: number;
  pricePerHour: number;
  distanceKm: number;
  skills: string[];
  verified: boolean;
  jobs: number;
};

export type Booking = {
  id: string;
  workerId: string;
  workerName: string;
  serviceName: string;
  date: string;
  slot: string;
  hours: number;
  amount: number;
  status: "Upcoming" | "Completed" | "Cancelled";
  paid: boolean;
  rating?: number;
  review?: string;
  complaint?: string;
};

export const services: Service[] = [
  { id: "cleaning", name: "Home Cleaning", icon: "Sparkles", from: 18, blurb: "Deep & regular cleaning" },
  { id: "plumbing", name: "Plumbing", icon: "Wrench", from: 26, blurb: "Leaks, fittings, drainage" },
  { id: "electrical", name: "Electrical", icon: "Zap", from: 30, blurb: "Wiring, fixtures, repairs" },
  { id: "painting", name: "Painting", icon: "Paintbrush", from: 22, blurb: "Interior & exterior walls" },
  { id: "carpentry", name: "Carpentry", icon: "Hammer", from: 28, blurb: "Furniture & fittings" },
  { id: "appliance", name: "Appliance Repair", icon: "Refrigerator", from: 24, blurb: "AC, washer, fridge" },
];

export const workers: Worker[] = [
  { id: "w1", name: "Amara Okafor", serviceId: "cleaning", rating: 4.9, reviews: 214, pricePerHour: 22, distanceKm: 1.2, skills: ["Deep clean", "Eco products", "Pet-safe"], verified: true, jobs: 640 },
  { id: "w2", name: "Ravi Menon", serviceId: "cleaning", rating: 4.7, reviews: 128, pricePerHour: 18, distanceKm: 2.8, skills: ["Kitchen", "Bathroom", "Sofa shampoo"], verified: true, jobs: 402 },
  { id: "w3", name: "Lucia Ferrari", serviceId: "cleaning", rating: 4.6, reviews: 87, pricePerHour: 20, distanceKm: 4.5, skills: ["Move-out clean", "Windows"], verified: true, jobs: 233 },
  { id: "w4", name: "Daniel Boateng", serviceId: "plumbing", rating: 4.8, reviews: 156, pricePerHour: 32, distanceKm: 1.9, skills: ["Leak repair", "Water heater", "Drainage"], verified: true, jobs: 511 },
  { id: "w5", name: "Sofia Reyes", serviceId: "plumbing", rating: 4.5, reviews: 64, pricePerHour: 26, distanceKm: 5.1, skills: ["Fittings", "Tap replacement"], verified: true, jobs: 180 },
  { id: "w6", name: "Kenji Watanabe", serviceId: "electrical", rating: 5.0, reviews: 98, pricePerHour: 38, distanceKm: 3.4, skills: ["Rewiring", "Smart home", "Panel work"], verified: true, jobs: 297 },
  { id: "w7", name: "Grace Lin", serviceId: "electrical", rating: 4.6, reviews: 73, pricePerHour: 30, distanceKm: 6.2, skills: ["Lighting", "Sockets", "Fans"], verified: true, jobs: 205 },
  { id: "w8", name: "Marco Silva", serviceId: "painting", rating: 4.7, reviews: 141, pricePerHour: 24, distanceKm: 2.2, skills: ["Emulsion", "Texture", "Exterior"], verified: true, jobs: 388 },
  { id: "w9", name: "Hana Yusuf", serviceId: "carpentry", rating: 4.8, reviews: 112, pricePerHour: 29, distanceKm: 3.9, skills: ["Modular", "Doors", "Cabinets"], verified: true, jobs: 341 },
  { id: "w10", name: "Peter Novak", serviceId: "appliance", rating: 4.4, reviews: 59, pricePerHour: 27, distanceKm: 7.8, skills: ["AC service", "Washer", "Microwave"], verified: true, jobs: 164 },
  { id: "w11", name: "Isabel Cruz", serviceId: "appliance", rating: 4.9, reviews: 133, pricePerHour: 34, distanceKm: 2.6, skills: ["Refrigerator", "Inverter AC", "Diagnostics"], verified: true, jobs: 421 },
  { id: "w12", name: "Tomas Almeida", serviceId: "painting", rating: 4.3, reviews: 41, pricePerHour: 22, distanceKm: 8.4, skills: ["Wall putty", "Enamel"], verified: true, jobs: 96 },
];

export const timeSlots = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
];

export const initialBookings: Booking[] = [
  {
    id: "BK-2041",
    workerId: "w1",
    workerName: "Amara Okafor",
    serviceName: "Home Cleaning",
    date: "2026-08-12",
    slot: "10:00 – 12:00",
    hours: 2,
    amount: 44,
    status: "Completed",
    paid: true,
    rating: 5,
    review: "Spotless work, arrived early.",
  },
  {
    id: "BK-2078",
    workerId: "w4",
    workerName: "Daniel Boateng",
    serviceName: "Plumbing",
    date: "2026-08-24",
    slot: "14:00 – 16:00",
    hours: 1,
    amount: 32,
    status: "Completed",
    paid: true,
  },
];

export const currency = (n: number) => `$${n.toFixed(2)}`;
