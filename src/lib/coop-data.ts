export type CoopWorker = {
  id: string;
  name: string;
  service: string;
  city: string;
  rating: number;
  jobs: number;
  hourlyRate: number;
  status: "Active" | "Pending" | "Suspended";
  verified: boolean;
  skills: string[];
  certifications: string[];
  insurance: "Active" | "Lapsed" | "Not enrolled";
  earnings: number;
};

export type VerificationRequest = {
  id: string;
  workerName: string;
  service: string;
  document: string;
  submitted: string;
  note?: string;
};

export type CoopService = {
  id: string;
  name: string;
  workers: number;
  minRate: number;
  maxRate: number;
  suggestedRate: number;
  active: boolean;
};

export type CoopBooking = {
  id: string;
  customer: string;
  worker: string;
  service: string;
  date: string;
  slot: string;
  amount: number;
  status: "Requested" | "In progress" | "Completed" | "Cancelled";
  payment: "Paid" | "Pending" | "Refunded";
};

export type CoopComplaint = {
  id: string;
  from: "Customer" | "Worker";
  raisedBy: string;
  against: string;
  bookingId: string;
  reason: string;
  opened: string;
  status: "Open" | "Investigating" | "Resolved";
};

export const coopWorkers: CoopWorker[] = [
  {
    id: "w1",
    name: "Amara Okafor",
    service: "Home Cleaning",
    city: "Koramangala",
    rating: 4.9,
    jobs: 640,
    hourlyRate: 22,
    status: "Active",
    verified: true,
    skills: ["Deep clean", "Eco products", "Pet-safe"],
    certifications: ["ISSA Cleaning Technician"],
    insurance: "Active",
    earnings: 14080,
  },
  {
    id: "w4",
    name: "Daniel Boateng",
    service: "Plumbing",
    city: "HSR Layout",
    rating: 4.8,
    jobs: 511,
    hourlyRate: 32,
    status: "Active",
    verified: true,
    skills: ["Leak repair", "Water heater", "Drainage"],
    certifications: ["NSDC Plumbing Level 3"],
    insurance: "Active",
    earnings: 16352,
  },
  {
    id: "w6",
    name: "Kenji Watanabe",
    service: "Electrical",
    city: "Indiranagar",
    rating: 5,
    jobs: 297,
    hourlyRate: 38,
    status: "Active",
    verified: true,
    skills: ["Rewiring", "Smart home", "Panel work"],
    certifications: ["Licensed Electrician Grade A"],
    insurance: "Lapsed",
    earnings: 11286,
  },
  {
    id: "w8",
    name: "Marco Silva",
    service: "Painting",
    city: "Jayanagar",
    rating: 4.7,
    jobs: 388,
    hourlyRate: 24,
    status: "Active",
    verified: true,
    skills: ["Emulsion", "Texture", "Exterior"],
    certifications: [],
    insurance: "Active",
    earnings: 9312,
  },
  {
    id: "w12",
    name: "Tomas Almeida",
    service: "Painting",
    city: "Whitefield",
    rating: 4.3,
    jobs: 96,
    hourlyRate: 22,
    status: "Pending",
    verified: false,
    skills: ["Wall putty", "Enamel"],
    certifications: [],
    insurance: "Not enrolled",
    earnings: 2112,
  },
  {
    id: "w10",
    name: "Peter Novak",
    service: "Appliance Repair",
    city: "Hebbal",
    rating: 4.4,
    jobs: 164,
    hourlyRate: 27,
    status: "Suspended",
    verified: true,
    skills: ["AC service", "Washer"],
    certifications: ["Appliance Safety Basics"],
    insurance: "Active",
    earnings: 4428,
  },
];

export const initialVerificationRequests: VerificationRequest[] = [
  {
    id: "VR-881",
    workerName: "Tomas Almeida",
    service: "Painting",
    document: "Police verification certificate",
    submitted: "2026-08-28",
    note: "Re-uploaded after blurry first scan.",
  },
  {
    id: "VR-884",
    workerName: "Grace Lin",
    service: "Electrical",
    document: "Government ID + address proof",
    submitted: "2026-08-29",
  },
  {
    id: "VR-887",
    workerName: "Hana Yusuf",
    service: "Carpentry",
    document: "Skill certificate (Modular fittings)",
    submitted: "2026-08-30",
  },
];

export const initialCoopServices: CoopService[] = [
  { id: "cleaning", name: "Home Cleaning", workers: 34, minRate: 16, maxRate: 28, suggestedRate: 20, active: true },
  { id: "plumbing", name: "Plumbing", workers: 21, minRate: 24, maxRate: 40, suggestedRate: 30, active: true },
  { id: "electrical", name: "Electrical", workers: 18, minRate: 28, maxRate: 44, suggestedRate: 34, active: true },
  { id: "painting", name: "Painting", workers: 26, minRate: 20, maxRate: 32, suggestedRate: 24, active: true },
  { id: "carpentry", name: "Carpentry", workers: 15, minRate: 24, maxRate: 38, suggestedRate: 29, active: true },
  { id: "appliance", name: "Appliance Repair", workers: 12, minRate: 22, maxRate: 40, suggestedRate: 28, active: false },
];

export const coopBookings: CoopBooking[] = [
  { id: "BK-2101", customer: "Meera Iyer", worker: "Amara Okafor", service: "Home Cleaning", date: "2026-09-06", slot: "08:00 – 10:00", amount: 44, status: "Requested", payment: "Pending" },
  { id: "BK-2098", customer: "Arjun Rao", worker: "Daniel Boateng", service: "Plumbing", date: "2026-08-31", slot: "10:00 – 12:00", amount: 64, status: "In progress", payment: "Paid" },
  { id: "BK-2078", customer: "Dyllan Rhodes", worker: "Daniel Boateng", service: "Plumbing", date: "2026-08-24", slot: "14:00 – 16:00", amount: 32, status: "Completed", payment: "Paid" },
  { id: "BK-2065", customer: "Neha Sharma", worker: "Marco Silva", service: "Painting", date: "2026-08-19", slot: "16:00 – 18:00", amount: 72, status: "Completed", payment: "Paid" },
  { id: "BK-2044", customer: "Rahul Bose", worker: "Peter Novak", service: "Appliance Repair", date: "2026-08-14", slot: "12:00 – 14:00", amount: 54, status: "Cancelled", payment: "Refunded" },
  { id: "BK-2041", customer: "Dyllan Rhodes", worker: "Amara Okafor", service: "Home Cleaning", date: "2026-08-12", slot: "10:00 – 12:00", amount: 44, status: "Completed", payment: "Paid" },
];

export const initialCoopComplaints: CoopComplaint[] = [
  {
    id: "CP-512",
    from: "Customer",
    raisedBy: "Rahul Bose",
    against: "Peter Novak",
    bookingId: "BK-2044",
    reason: "Worker did not arrive — no call before the slot.",
    opened: "2026-08-15",
    status: "Investigating",
  },
  {
    id: "CP-517",
    from: "Worker",
    raisedBy: "Marco Silva",
    against: "Neha Sharma",
    bookingId: "BK-2065",
    reason: "Extra rooms added on site without revised payment.",
    opened: "2026-08-20",
    status: "Open",
  },
  {
    id: "CP-503",
    from: "Customer",
    raisedBy: "Meera Iyer",
    against: "Amara Okafor",
    bookingId: "BK-2041",
    reason: "Billing mismatch of $6 on the final invoice.",
    opened: "2026-08-13",
    status: "Resolved",
  },
];

export const platformStats = [
  { id: "s1", label: "Jobs completed this month", value: "1,284", delta: "+12.4%" },
  { id: "s2", label: "Gross booking value", value: "$58,420", delta: "+9.1%" },
  { id: "s3", label: "Average worker rating", value: "4.72", delta: "+0.06" },
  { id: "s4", label: "Repeat customer rate", value: "63%", delta: "+4.2%" },
  { id: "s5", label: "Cancellation rate", value: "3.1%", delta: "-0.8%" },
  { id: "s6", label: "Avg. payout time", value: "1.8 days", delta: "-0.3" },
];
