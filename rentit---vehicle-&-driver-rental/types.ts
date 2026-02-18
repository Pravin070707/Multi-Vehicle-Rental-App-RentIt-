
export enum Role {
  USER = 'User',
  DRIVER = 'Driver',
  OWNER = 'Vehicle Owner',
  ADMIN = 'Admin',
}

export enum VehicleType {
  CAR = 'Car',
  BIKE = 'Bike',
  VAN = 'Van',
  TRUCK = 'Truck',
  SUV = 'SUV',
  AUTO_RICKSHAW = 'Auto Rickshaw',
  TEMPO_TRAVELLER = 'Tempo Traveller',
  LORRY = 'Lorry',
  CONTAINER_LORRY = 'Container Lorry',
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected',
}

export interface BaseUser {
  id: number;
  name: string;
  email: string;
  profilePictureUrl: string;
  mobile?: string;
}

export interface User extends BaseUser {}

export interface Driver extends BaseUser {
  experience: number; // in years
  rating: number; // 1-5
  licenseUrl: string;
  aadharUrl?: string;
  idUrl: string;
  isVerified: boolean; // Keeping for backward compat, but verificationStatus is primary now
  verificationStatus: VerificationStatus;
  availability: boolean;
}

export interface VehicleOwner extends BaseUser {}

export interface Admin extends BaseUser {}

export enum VehicleStatus {
  AVAILABLE = 'Available',
  BOOKED = 'Booked',
  IN_SERVICE = 'In Service',
}

export interface Vehicle {
  id: number;
  ownerId: number;
  make: string;
  model: string;
  year: number;
  type: VehicleType;
  seatingCapacity: number;
  imageUrl: string;
  pricePerDayInr: number;
  location: string;
  status: VehicleStatus;
  verificationStatus: VerificationStatus;
  registration: string;
  rcDocumentUrl?: string;
  insuranceDocumentUrl?: string;
  insuranceExpiry: string; // YYYY-MM-DD
  serviceStartDate?: string; // YYYY-MM-DD
  serviceEndDate?: string; // YYYY-MM-DD
  serviceDetails?: string;
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Booking {
  id: number;
  userId: number;
  vehicleId?: number;
  driverId?: number;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endDate: string; // YYYY-MM-DD
  endTime: string; // HH:MM
  totalCostInr: number;
  status: BookingStatus;
  pickupLocation: string;
  dropoffLocation: string;
  distanceKm?: number;
  withDriver?: boolean;
}

export enum ComplaintStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved',
}

export interface Complaint {
  id: number;
  reporterId: number;
  reporterRole: Role;
  bookingId: number;
  subject: string;
  description: string;
  status: ComplaintStatus;
  createdAt: string; // YYYY-MM-DD
}

export interface Review {
  id: number;
  bookingId: number;
  reviewerId: number;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
