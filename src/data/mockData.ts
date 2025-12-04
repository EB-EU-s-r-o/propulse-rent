// RENT Dashboard 2026 - Mock Data

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: {
    city: string;
    district: string;
    address: string;
  };
  type: 'Condo' | 'Villa' | 'Apartment' | 'House';
  status: 'Active' | 'Maintenance' | 'Sold';
  priceRange: { min: number; max: number };
  image: string;
  features: string[];
  stats: {
    totalUnits: number;
    occupancyRate: number;
  };
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  unitNumber: string;
  price: number;
  size: number;
  floor: number;
  beds: number;
  baths: number;
  status: 'Available' | 'Occupied' | 'Reserved' | 'Maintenance';
  availableFrom: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  interestPropertyIds: string[];
  stage: 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
  source: 'WP_API' | 'WalkIn' | 'Facebook' | 'Referral' | 'Google';
  value: number;
  avatar: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  leaseId: string;
  tenant: string;
  unit: string;
  date: string;
  amount: number;
  method: 'Stripe' | 'Bank Transfer' | 'Cash';
  status: 'Paid' | 'Pending' | 'Overdue';
  invoice: string;
}

export interface DashboardStats {
  totalProperties: number;
  activeUnits: number;
  totalLeads: number;
  monthlyRevenue: number;
  occupancyRate: number;
  pendingPayments: number;
}

export const properties: Property[] = [
  {
    id: 'prop_001',
    title: 'The Riverview Millennium',
    slug: 'riverview-millennium-bkk',
    description: 'Luxury high-rise condominium overlooking the Chao Phraya river with stunning panoramic views.',
    location: { city: 'Bangkok', district: 'Khlong San', address: '123 Charoen Nakhon Rd' },
    type: 'Condo',
    status: 'Active',
    priceRange: { min: 25000, max: 85000 },
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    features: ['Pool', 'Gym', 'Concierge', 'River View', 'Parking'],
    stats: { totalUnits: 120, occupancyRate: 0.92 },
    createdAt: '2024-10-15T08:00:00Z'
  },
  {
    id: 'prop_002',
    title: 'Siam Royal Villa',
    slug: 'siam-royal-villa-pattaya',
    description: 'Exclusive pool villa community with private beach access and 24/7 security.',
    location: { city: 'Pattaya', district: 'Pratumnak', address: '456 Kasetsin Soi 5' },
    type: 'Villa',
    status: 'Active',
    priceRange: { min: 120000, max: 250000 },
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    features: ['Private Pool', 'Garden', 'Security', 'Pet Friendly', 'Beach Access'],
    stats: { totalUnits: 24, occupancyRate: 0.88 },
    createdAt: '2024-11-01T09:30:00Z'
  },
  {
    id: 'prop_003',
    title: 'Hua Hin Horizon',
    slug: 'hua-hin-horizon',
    description: 'Modern apartments close to the night market and railway station with sea views.',
    location: { city: 'Hua Hin', district: 'City Center', address: '789 Phetkasem Rd' },
    type: 'Apartment',
    status: 'Maintenance',
    priceRange: { min: 15000, max: 30000 },
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    features: ['Parking', 'WiFi', 'Balcony', 'Sea View'],
    stats: { totalUnits: 48, occupancyRate: 0.75 },
    createdAt: '2024-09-20T14:15:00Z'
  },
  {
    id: 'prop_004',
    title: 'Sukhumvit Prime Tower',
    slug: 'sukhumvit-prime-tower',
    description: 'Premium living in the heart of Bangkok with direct BTS access.',
    location: { city: 'Bangkok', district: 'Thong Lor', address: '55 Sukhumvit Soi 55' },
    type: 'Condo',
    status: 'Active',
    priceRange: { min: 35000, max: 120000 },
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['Sky Lounge', 'Co-working', 'BTS Access', 'Rooftop Pool'],
    stats: { totalUnits: 200, occupancyRate: 0.95 },
    createdAt: '2024-08-10T11:00:00Z'
  },
  {
    id: 'prop_005',
    title: 'Chiang Mai Gardens',
    slug: 'chiang-mai-gardens',
    description: 'Serene living surrounded by nature in Northern Thailand.',
    location: { city: 'Chiang Mai', district: 'Nimman', address: '88 Nimmanhaemin Rd' },
    type: 'House',
    status: 'Active',
    priceRange: { min: 18000, max: 45000 },
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    features: ['Garden', 'Mountain View', 'Parking', 'Quiet Area'],
    stats: { totalUnits: 32, occupancyRate: 0.84 },
    createdAt: '2024-07-05T09:00:00Z'
  },
  {
    id: 'prop_006',
    title: 'Phuket Sunset Bay',
    slug: 'phuket-sunset-bay',
    description: 'Beachfront luxury villas with infinity pools and sunset views.',
    location: { city: 'Phuket', district: 'Kamala', address: '12 Kamala Beach Rd' },
    type: 'Villa',
    status: 'Active',
    priceRange: { min: 180000, max: 350000 },
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    features: ['Infinity Pool', 'Ocean View', 'Private Beach', 'Butler Service'],
    stats: { totalUnits: 16, occupancyRate: 0.94 },
    createdAt: '2024-06-20T10:30:00Z'
  }
];

export const units: Unit[] = [
  { id: 'unit_101', propertyId: 'prop_001', unitNumber: '12A', price: 45000, size: 65, floor: 12, beds: 2, baths: 2, status: 'Available', availableFrom: '2025-01-01' },
  { id: 'unit_102', propertyId: 'prop_001', unitNumber: '12B', price: 55000, size: 85, floor: 12, beds: 2, baths: 2, status: 'Occupied', availableFrom: '2026-03-01' },
  { id: 'unit_103', propertyId: 'prop_001', unitNumber: '15C', price: 90000, size: 120, floor: 15, beds: 3, baths: 2, status: 'Reserved', availableFrom: '2025-02-15' },
  { id: 'unit_201', propertyId: 'prop_002', unitNumber: 'V-01', price: 150000, size: 350, floor: 1, beds: 4, baths: 3, status: 'Available', availableFrom: '2024-12-20' },
  { id: 'unit_202', propertyId: 'prop_002', unitNumber: 'V-02', price: 180000, size: 400, floor: 1, beds: 5, baths: 4, status: 'Occupied', availableFrom: null },
  { id: 'unit_301', propertyId: 'prop_003', unitNumber: '304', price: 18000, size: 45, floor: 3, beds: 1, baths: 1, status: 'Maintenance', availableFrom: '2025-01-10' },
];

export const leads: Lead[] = [
  { id: 'lead_001', name: 'Somchai Prakarn', email: 'somchai.p@email.com', phone: '+66812345678', company: 'TechCorp Thailand', interestPropertyIds: ['prop_001'], stage: 'New', source: 'WP_API', value: 45000, avatar: 'https://i.pravatar.cc/150?u=1', createdAt: '2025-12-03T10:00:00Z' },
  { id: 'lead_002', name: 'Emily Carter', email: 'emily.travels@uk.co', phone: '+447700900000', company: 'Expat Consultancy', interestPropertyIds: ['prop_002'], stage: 'Proposal', source: 'WalkIn', value: 180000, avatar: 'https://i.pravatar.cc/150?u=2', createdAt: '2025-12-02T16:20:00Z' },
  { id: 'lead_003', name: 'Kittisak S.', email: 'kittisak@tech.th', phone: '+66899998888', company: 'Digital Nomad Co', interestPropertyIds: ['prop_001', 'prop_003'], stage: 'Negotiation', source: 'Facebook', value: 55000, avatar: 'https://i.pravatar.cc/150?u=3', createdAt: '2025-11-28T09:45:00Z' },
  { id: 'lead_004', name: 'Hans Muller', email: 'h.muller@de.com', phone: '+491511234567', company: 'German Engineering', interestPropertyIds: ['prop_002'], stage: 'Qualified', source: 'Referral', value: 250000, avatar: 'https://i.pravatar.cc/150?u=4', createdAt: '2025-12-01T11:00:00Z' },
  { id: 'lead_005', name: 'Maria Santos', email: 'maria.s@brazil.net', phone: '+5511999887766', interestPropertyIds: ['prop_004'], stage: 'New', source: 'Google', value: 75000, avatar: 'https://i.pravatar.cc/150?u=5', createdAt: '2025-12-04T08:30:00Z' },
  { id: 'lead_006', name: 'James Wilson', email: 'j.wilson@aus.com', phone: '+61412345678', company: 'Wilson Properties', interestPropertyIds: ['prop_006'], stage: 'Won', source: 'Referral', value: 350000, avatar: 'https://i.pravatar.cc/150?u=6', createdAt: '2025-11-15T14:00:00Z' },
  { id: 'lead_007', name: 'Yuki Tanaka', email: 'yuki.t@japan.co', phone: '+81901234567', interestPropertyIds: ['prop_005'], stage: 'Qualified', source: 'WP_API', value: 32000, avatar: 'https://i.pravatar.cc/150?u=7', createdAt: '2025-11-30T12:15:00Z' },
  { id: 'lead_008', name: 'Chen Wei', email: 'chen.w@china.net', phone: '+8613912345678', company: 'Global Investments', interestPropertyIds: ['prop_001', 'prop_004'], stage: 'Proposal', source: 'Facebook', value: 120000, avatar: 'https://i.pravatar.cc/150?u=8', createdAt: '2025-11-25T10:00:00Z' },
  { id: 'lead_009', name: 'Sarah Johnson', email: 'sarah.j@usa.com', phone: '+12025551234', interestPropertyIds: ['prop_003'], stage: 'Lost', source: 'Google', value: 25000, avatar: 'https://i.pravatar.cc/150?u=9', createdAt: '2025-11-20T09:00:00Z' },
];

export const payments: Payment[] = [
  { id: 'pay_001', leaseId: 'lease_001', tenant: 'John Smith', unit: '12B - Riverview', date: '2025-12-01', amount: 55000, method: 'Stripe', status: 'Paid', invoice: '#INV-2025-1001' },
  { id: 'pay_002', leaseId: 'lease_002', tenant: 'Emily Carter', unit: 'V-02 - Siam Royal', date: '2025-12-01', amount: 180000, method: 'Bank Transfer', status: 'Paid', invoice: '#INV-2025-1002' },
  { id: 'pay_003', leaseId: 'lease_003', tenant: 'Michael Chen', unit: '15C - Riverview', date: '2025-12-01', amount: 90000, method: 'Stripe', status: 'Pending', invoice: '#INV-2025-1003' },
  { id: 'pay_004', leaseId: 'lease_004', tenant: 'Anna Lee', unit: '304 - Hua Hin', date: '2025-11-15', amount: 18000, method: 'Cash', status: 'Overdue', invoice: '#INV-2025-0998' },
  { id: 'pay_005', leaseId: 'lease_005', tenant: 'Robert Taylor', unit: '22A - Prime Tower', date: '2025-12-01', amount: 65000, method: 'Stripe', status: 'Paid', invoice: '#INV-2025-1004' },
  { id: 'pay_006', leaseId: 'lease_006', tenant: 'Lisa Wang', unit: 'V-01 - Sunset Bay', date: '2025-12-01', amount: 220000, method: 'Bank Transfer', status: 'Paid', invoice: '#INV-2025-1005' },
  { id: 'pay_007', leaseId: 'lease_007', tenant: 'David Kim', unit: 'G-05 - CM Gardens', date: '2025-12-01', amount: 28000, method: 'Stripe', status: 'Pending', invoice: '#INV-2025-1006' },
];

export const dashboardStats: DashboardStats = {
  totalProperties: 24,
  activeUnits: 185,
  totalLeads: 42,
  monthlyRevenue: 4250000,
  occupancyRate: 0.89,
  pendingPayments: 8
};
