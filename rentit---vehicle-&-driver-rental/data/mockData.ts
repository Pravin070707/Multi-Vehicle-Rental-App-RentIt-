
import { User, Driver, VehicleOwner, Admin, Vehicle, Booking, VehicleType, BookingStatus, Role, Complaint, ComplaintStatus, VehicleStatus, Review, VerificationStatus } from '../types';

export const mockUsers: User[] = [
  { id: 1, name: 'Ram', email: 'person@gmail.com', mobile: '9876543210', profilePictureUrl: 'https://picsum.photos/seed/user1/200' },
  { id: 2, name: 'Arjun Sharma', email: 'arjun@example.com', mobile: '9123456789', profilePictureUrl: 'https://picsum.photos/seed/user2/200' },
];

export const mockDrivers: Driver[] = [
  { id: 101, name: 'Ravi Kumar', email: 'ravi@gmail.com', mobile: '9988776655', experience: 7, rating: 4.9, licenseUrl: 'LIC-123', aadharUrl: 'AAD-123', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: true, profilePictureUrl: 'https://picsum.photos/seed/driver1/200' },
  { id: 102, name: 'Suresh Menon', email: 'suresh@gmail.com', mobile: '8877665544', experience: 10, rating: 4.8, licenseUrl: 'LIC-456', aadharUrl: 'AAD-456', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: false, profilePictureUrl: 'https://picsum.photos/seed/driver2/200' },
  { id: 103, name: 'Karthik Raja', email: 'karthik@gmail.com', mobile: '7766554433', experience: 3, rating: 4.6, licenseUrl: 'LIC-789', aadharUrl: 'AAD-789', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: true, profilePictureUrl: 'https://picsum.photos/seed/driver3/200' },
  { id: 104, name: 'Ganesh Pillai', email: 'ganesh@gmail.com', mobile: '6655443322', experience: 5, rating: 4.7, licenseUrl: 'LIC-101', aadharUrl: 'AAD-101', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: true, profilePictureUrl: 'https://picsum.photos/seed/driver4/200' },
  { id: 105, name: 'Muthu Krishnan', email: 'muthu@gmail.com', mobile: '5544332211', experience: 12, rating: 4.9, licenseUrl: 'LIC-202', aadharUrl: 'AAD-202', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: false, profilePictureUrl: 'https://picsum.photos/seed/driver5/200' },
  { id: 106, name: 'Saravanan Bala', email: 'saravanan@gmail.com', mobile: '4433221100', experience: 2, rating: 4.3, licenseUrl: 'LIC-303', aadharUrl: 'AAD-303', idUrl: '#', isVerified: true, verificationStatus: VerificationStatus.VERIFIED, availability: true, profilePictureUrl: 'https://picsum.photos/seed/driver6/200' },
  // Pending Driver Example
  { id: 107, name: 'New Driver Request', email: 'newdriver@example.com', mobile: '9999999999', experience: 1, rating: 0, licenseUrl: 'PENDING-LIC', aadharUrl: 'PENDING-AAD', idUrl: '#', isVerified: false, verificationStatus: VerificationStatus.PENDING, availability: false, profilePictureUrl: 'https://picsum.photos/seed/driverPending/200' },
];

export const mockOwners: VehicleOwner[] = [
  { id: 201, name: 'Pravin', email: 'owner@rentit.com', mobile: '9000011111', profilePictureUrl: 'https://picsum.photos/seed/owner1/200' },
  { id: 202, name: 'Vikram Singh', email: 'vikram@example.com', mobile: '9000022222', profilePictureUrl: 'https://picsum.photos/seed/owner2/200' },
];

export const mockAdmins: Admin[] = [
  { id: 901, name: 'Admin', email: 'admin@rentit.com', mobile: '1001001001', profilePictureUrl: 'https://picsum.photos/seed/admin1/200' },
];

export const mockVehicles: Vehicle[] = [
  { id: 301, ownerId: 201, make: 'Maruti Suzuki', model: 'Swift Dzire', year: 2022, type: VehicleType.CAR, seatingCapacity: 5, imageUrl: 'https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Dzire/11387/1758802554630/front-left-side-47.jpg?tr=w-320', pricePerDayInr: 1800, location: 'Chennai, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-07-CQ-1234', insuranceExpiry: '2025-08-15' },
  { id: 302, ownerId: 201, make: 'Mahindra', model: 'Scorpio', year: 2021, type: VehicleType.SUV, seatingCapacity: 7, imageUrl: 'https://c.ndtvimg.com/2024-10/phm1qec_mahindrascorpioclassicbossedition1_625x300_23_October_24.jpg?im=FeatureCrop,algorithm=dnn,width=1200,height=738', pricePerDayInr: 2500, location: 'Coimbatore, TN', status: VehicleStatus.IN_SERVICE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-38-P-5678', insuranceExpiry: '2025-06-20', serviceStartDate: '2024-08-20', serviceEndDate: '2024-08-25', serviceDetails: 'General check-up and oil change.' },
  { id: 303, ownerId: 202, make: 'Bajaj RE', model: 'Compact', year: 2023, type: VehicleType.AUTO_RICKSHAW, seatingCapacity: 3, imageUrl: 'https://images.jdmagicbox.com/quickquotes/images_main/bajaj-re-compact-three-wheeler-auto-rickshaw-yellow-green-236-2-cc-le8ww6ww.jpg', pricePerDayInr: 800, location: 'Madurai, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-58-AZ-4321', insuranceExpiry: '2026-05-10' },
  { id: 304, ownerId: 202, make: 'Royal Enfield', model: 'Classic 350', year: 2023, type: VehicleType.BIKE, seatingCapacity: 2, imageUrl: 'https://i.cdn.newsbytesapp.com/images/l57020240413142341.png?tr=w-720', pricePerDayInr: 1500, location: 'Chennai, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-09-BU-9876', insuranceExpiry: '2026-01-30' },
  { id: 305, ownerId: 201, make: 'Tata', model: 'Ace Gold', year: 2022, type: VehicleType.TRUCK, seatingCapacity: 2, imageUrl: 'https://5.imimg.com/data5/PJ/ST/MY-59391862/tata-ace-commercial-vehicle.jpg', pricePerDayInr: 2200, location: 'Salem, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-30-X-9101', insuranceExpiry: '2025-11-05' },
  { id: 306, ownerId: 201, make: 'Force', model: 'Traveller 3050', year: 2023, type: VehicleType.TEMPO_TRAVELLER, seatingCapacity: 12, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIA8V7GxaxcMDajOCWw253Bx1FbIlCrH6AlQ&s', pricePerDayInr: 3000, location: 'Tiruchirappalli, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-45-F-7890', insuranceExpiry: '2026-03-22' },
  { id: 307, ownerId: 202, make: 'Tata', model: 'LPT 1615', year: 2021, type: VehicleType.LORRY, seatingCapacity: 2, imageUrl: 'https://assets.tractorjunction.com/truck-junction/assets/images/truck/prima-4830t-1734768227.webp', pricePerDayInr: 4500, location: 'Hosur, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-70-L-1122', insuranceExpiry: '2025-10-10' },
  { id: 308, ownerId: 201, make: 'Ashok Leyland', model: 'Container Lorry', year: 2022, type: VehicleType.CONTAINER_LORRY, seatingCapacity: 2, imageUrl: 'https://tiimg.tistatic.com/fp/0/009/594/container-truck-466.jpg', pricePerDayInr: 6000, location: 'Chennai Port, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-04-CL-3344', insuranceExpiry: '2026-02-18' },
  { id: 309, ownerId: 202, make: 'Toyota', model: 'Innova Crysta', year: 2022, type: VehicleType.SUV, seatingCapacity: 7, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT39xAmuld75hlge1ULbGgOk8DbyD6vnv-VYg&s', pricePerDayInr: 2800, location: 'Erode, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-33-AB-1234', insuranceExpiry: '2026-04-12' },
  { id: 310, ownerId: 201, make: 'Eicher', model: 'Pro 3015', year: 2021, type: VehicleType.LORRY, seatingCapacity: 2, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCQSYc-6rY4GqffZij49HQd4DWDmoeXl0ruQ&s', pricePerDayInr: 4800, location: 'Vellore, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-23-CD-5678', insuranceExpiry: '2025-09-01' },
  { id: 311, ownerId: 202, make: 'Tata', model: 'Ace "Chota Hathi"', year: 2023, type: VehicleType.TRUCK, seatingCapacity: 2, imageUrl: 'https://truckcdn.cardekho.com/in/tata/ace-ev/tata-ace-ev-92578.jpg?imwidth=360&impolicy=resize', pricePerDayInr: 2300, location: 'Thanjavur, TN', status: VehicleStatus.BOOKED, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-49-EF-9101', insuranceExpiry: '2026-07-19' },
  { id: 312, ownerId: 201, make: 'BharatBenz', model: '3128', year: 2022, type: VehicleType.CONTAINER_LORRY, seatingCapacity: 2, imageUrl: 'https://5.imimg.com/data5/PV/QW/QI/GLADMIN-3061/bharatbenz-3128c-tipper-truck-gvw-31000-kg.jpg', pricePerDayInr: 6500, location: 'Thoothukudi Port, TN', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED, registration: 'TN-69-GH-1122', insuranceExpiry: '2025-12-25' },
  
  // Pending Verification Vehicle
  { id: 313, ownerId: 201, make: 'Hyundai', model: 'Creta', year: 2024, type: VehicleType.SUV, seatingCapacity: 5, imageUrl: 'https://imgd.aeplcdn.com/1056x594/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80', pricePerDayInr: 3000, location: 'Chennai', status: VehicleStatus.AVAILABLE, verificationStatus: VerificationStatus.PENDING, registration: 'TN-NEW-01', insuranceExpiry: '2026-01-01', rcDocumentUrl: 'doc_rc_313.pdf', insuranceDocumentUrl: 'doc_ins_313.pdf' },
];

export const mockBookings: Booking[] = [
  { id: 401, userId: 1, vehicleId: 301, driverId: 101, startDate: '2024-08-01', startTime: '10:00', endDate: '2024-08-03', endTime: '18:00', totalCostInr: 10500, status: BookingStatus.COMPLETED, pickupLocation: 'Adyar, Chennai', dropoffLocation: 'Velachery, Chennai', distanceKm: 15, withDriver: true },
  { id: 402, userId: 2, vehicleId: 303, startDate: '2024-08-10', startTime: '09:00', endDate: '2024-08-12', endTime: '12:00', totalCostInr: 2400, status: BookingStatus.CONFIRMED, pickupLocation: 'Periyar Bus Stand, Madurai', dropoffLocation: 'Mattuthavani Bus Stand, Madurai', distanceKm: 8, withDriver: false },
  { id: 403, userId: 1, driverId: 102, startDate: '2024-08-15', startTime: '14:00', endDate: '2024-08-15', endTime: '19:00', totalCostInr: 2000, status: BookingStatus.PENDING, pickupLocation: 'T. Nagar, Chennai', dropoffLocation: 'Chennai International Airport', distanceKm: 12, withDriver: true },
  { id: 404, userId: 1, vehicleId: 305, startDate: '2024-08-05', startTime: '08:30', endDate: '2024-08-07', endTime: '20:00', totalCostInr: 6600, status: BookingStatus.CANCELLED, pickupLocation: 'Salem Junction', dropoffLocation: 'Yercaud Foot Hills', distanceKm: 25, withDriver: false },
  { id: 405, userId: 2, vehicleId: 309, driverId: 104, startDate: '2024-09-01', startTime: '11:00', endDate: '2024-09-05', endTime: '15:00', totalCostInr: 20000, status: BookingStatus.PENDING, pickupLocation: 'Erode Bus Stand', dropoffLocation: 'Bhavani Sagar Dam', distanceKm: 60, withDriver: true },
  { id: 406, userId: 1, driverId: 103, startDate: '2024-09-10', startTime: '08:00', endDate: '2024-09-10', endTime: '20:00', totalCostInr: 1500, status: BookingStatus.PENDING, pickupLocation: 'Anna Nagar, Chennai', dropoffLocation: 'Mahabalipuram', distanceKm: 60, withDriver: true },
  { id: 407, userId: 2, driverId: 106, startDate: '2024-08-20', startTime: '09:00', endDate: '2024-08-20', endTime: '18:00', totalCostInr: 1200, status: BookingStatus.COMPLETED, pickupLocation: 'Tambaram', dropoffLocation: 'Vandalur Zoo', distanceKm: 10, withDriver: true },
  // New completed booking for User 1 (Ram) that has NOT been rated yet
  { id: 408, userId: 1, vehicleId: 306, startDate: '2024-07-20', startTime: '08:00', endDate: '2024-07-21', endTime: '20:00', totalCostInr: 6000, status: BookingStatus.COMPLETED, pickupLocation: 'Chennai', dropoffLocation: 'Pondicherry', distanceKm: 160, withDriver: true },
];

export const mockComplaints: Complaint[] = [
    { id: 1, reporterId: 1, reporterRole: Role.USER, bookingId: 401, subject: 'Vehicle was not clean', description: 'The interior of the car was dusty and had trash from the previous rider.', status: ComplaintStatus.OPEN, createdAt: '2024-08-04' },
    { id: 2, reporterId: 101, reporterRole: Role.DRIVER, bookingId: 401, subject: 'User was late', description: 'The user arrived 30 minutes late for the pickup, which delayed my next trip.', status: ComplaintStatus.IN_PROGRESS, createdAt: '2024-08-04' },
    { id: 3, reporterId: 201, reporterRole: Role.OWNER, bookingId: 401, subject: 'Minor scratch on bumper', description: 'Found a new minor scratch on the rear bumper after the trip was completed.', status: ComplaintStatus.RESOLVED, createdAt: '2024-08-05' },
];

export const mockReviews: Review[] = [
    { id: 1, bookingId: 401, reviewerId: 1, rating: 5, comment: 'Excellent driving and very polite behavior. Highly recommended!', createdAt: '2024-08-04' },
    { id: 2, bookingId: 407, reviewerId: 2, rating: 4, comment: 'Good drive, but arrived slightly late.', createdAt: '2024-08-21' }
];
