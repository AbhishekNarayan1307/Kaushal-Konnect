export type WorkerProfile = {
  name: string;
  headline: string;
  service: string;
  city: string;
  phone: string;
  hourlyRate: number;
  experienceYears: number;
  bio: string;
  skills: string[];
  certifications: { id: string; name: string; issuer: string; year: number }[];
};

export type VerificationDoc = {
  id: string;
  label: string;
  status: "Verified" | "Under review" | "Missing";
  fileName?: string;
};

export type JobRequest = {
  id: string;
  customer: string;
  service: string;
  date: string;
  slot: string;
  hours: number;
  amount: number;
  address: string;
  note?: string;
};

export type WorkerBooking = {
  id: string;
  customer: string;
  service: string;
  date: string;
  slot: string;
  hours: number;
  amount: number;
  status: "Upcoming" | "Completed" | "Rejected";
  payout: "Paid" | "Pending";
  rating?: number;
};

export const workerProfile: WorkerProfile = {
  name: "Amara Okafor",
  headline: "Deep-clean specialist · Eco-friendly products",
  service: "Home Cleaning",
  city: "Koramangala, Bengaluru",
  phone: "+91 98450 22114",
  hourlyRate: 22,
  experienceYears: 7,
  bio: "Seven years of residential cleaning across 640+ jobs. Pet-safe, eco-certified products and a same-day rework guarantee.",
  skills: ["Deep clean", "Eco products", "Pet-safe", "Move-out clean", "Sofa shampoo"],
  certifications: [
    { id: "c1", name: "Certified Cleaning Technician", issuer: "ISSA", year: 2021 },
    { id: "c2", name: "Workplace Safety Level 2", issuer: "NSDC", year: 2023 },
  ],
};

export const initialDocs: VerificationDoc[] = [
  { id: "d1", label: "Government ID", status: "Verified", fileName: "aadhaar-front.pdf" },
  { id: "d2", label: "Address proof", status: "Verified", fileName: "utility-bill.pdf" },
  { id: "d3", label: "Police verification", status: "Under review", fileName: "police-clearance.pdf" },
  { id: "d4", label: "Skill certificate", status: "Missing" },
];

export const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const workerSlots = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "18:00 – 20:00",
];

export const initialRequests: JobRequest[] = [
  {
    id: "RQ-3312",
    customer: "Dyllan Rhodes",
    service: "Home Cleaning",
    date: "2026-09-02",
    slot: "10:00 – 12:00",
    hours: 2,
    amount: 44,
    address: "4th Block, Koramangala",
    note: "Two bedrooms + kitchen deep clean.",
  },
  {
    id: "RQ-3318",
    customer: "Neha Sharma",
    service: "Home Cleaning",
    date: "2026-09-03",
    slot: "14:00 – 16:00",
    hours: 3,
    amount: 66,
    address: "HSR Layout Sector 2",
  },
];

export const initialWorkerBookings: WorkerBooking[] = [
  {
    id: "BK-2041",
    customer: "Dyllan Rhodes",
    service: "Home Cleaning",
    date: "2026-08-12",
    slot: "10:00 – 12:00",
    hours: 2,
    amount: 44,
    status: "Completed",
    payout: "Paid",
    rating: 5,
  },
  {
    id: "BK-2065",
    customer: "Arjun Rao",
    service: "Home Cleaning",
    date: "2026-08-19",
    slot: "16:00 – 18:00",
    hours: 3,
    amount: 66,
    status: "Completed",
    payout: "Paid",
    rating: 4,
  },
  {
    id: "BK-2101",
    customer: "Meera Iyer",
    service: "Home Cleaning",
    date: "2026-09-06",
    slot: "08:00 – 10:00",
    hours: 2,
    amount: 44,
    status: "Upcoming",
    payout: "Pending",
  },
];

export const welfare = [
  { id: "i1", label: "Accident insurance", provider: "SecureLife", status: "Active", detail: "Cover up to $10,000 · renews 12 Feb 2027" },
  { id: "i2", label: "Health top-up", provider: "CareFirst", status: "Active", detail: "OPD + hospitalisation for 2 dependants" },
  { id: "i3", label: "Pension contribution", provider: "HomeHands Welfare Fund", status: "Enrolled", detail: "2% of each payout matched monthly" },
  { id: "i4", label: "Paid leave wallet", provider: "HomeHands", status: "3 days left", detail: "Accrues 1 day per 20 completed jobs" },
];
