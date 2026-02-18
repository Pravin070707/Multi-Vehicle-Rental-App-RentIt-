
import React, { useState, useReducer, useEffect } from 'react';
import { User, Vehicle, Driver, Booking, VehicleType, BookingStatus, Role, ComplaintStatus, Complaint, VehicleStatus, Review } from '../types';
import { mockVehicles, mockDrivers, mockBookings, mockComplaints, mockReviews } from '../data/mockData';
import { MapPin, IndianRupee, Star, Calendar, Car, User as UserIcon, X, AlertTriangle, ShieldCheck, Eye, MessageSquare, Clock, ArrowRight, CheckCircle, RotateCw } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';
import DriverDetailsModal from '../components/DriverDetailsModal';
import ReviewModal from '../components/ReviewModal';
import VehicleDetailsModal from '../components/VehicleDetailsModal';
import BookingSuccessModal from '../components/BookingSuccessModal';

interface UserPortalProps {
  user: User;
}

// --- Sub-components ---

const VehicleCard: React.FC<{ vehicle: Vehicle; onBook: (v: Vehicle) => void; onViewDetails: (v: Vehicle) => void }> = ({ vehicle, onBook, onViewDetails }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow duration-300">
    <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={() => onViewDetails(vehicle)}>
      <img 
        src={vehicle.imageUrl} 
        alt={`${vehicle.make} ${vehicle.model}`} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 shadow-sm">
        <Star size={12} className="text-yellow-500 fill-yellow-500" /> 4.8
      </div>
    </div>
    <div className="p-5 flex flex-col flex-grow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{vehicle.make} {vehicle.model}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 bg-slate-100 dark:bg-slate-700 inline-block px-2 py-0.5 rounded">{vehicle.type}</p>
        </div>
        <div className="text-right">
          <span className="block text-lg font-bold text-primary-600 dark:text-primary-400">₹{vehicle.pricePerDayInr}</span>
          <span className="text-xs text-slate-400">/day</span>
        </div>
      </div>
      
      <div className="mt-2 space-y-1 mb-4">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={14} className="mr-2 text-slate-400" /> {vehicle.location}
        </div>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <UserIcon size={14} className="mr-2 text-slate-400" /> {vehicle.seatingCapacity} Seater
        </div>
      </div>

      <div className="mt-auto flex gap-2">
        <button 
          onClick={() => onViewDetails(vehicle)}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          Details
        </button>
        <button 
          onClick={() => onBook(vehicle)}
          className="flex-1 px-3 py-2 rounded-lg bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-colors shadow-sm"
        >
          Book Now
        </button>
      </div>
    </div>
  </div>
);

const DriverCard: React.FC<{ driver: Driver; onHire: (d: Driver) => void; onViewDetails: (d: Driver) => void }> = ({ driver, onHire, onViewDetails }) => (
  <div 
    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden relative group h-80 cursor-pointer"
    onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
    onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
  >
    <img src={driver.profilePictureUrl} alt={driver.name} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
       <div className="transform transition-transform duration-300 group-hover:-translate-y-12">
            <h3 className="text-white text-xl font-bold flex items-center gap-2">
                {driver.name}
                {driver.isVerified && <ShieldCheck size={18} className="text-green-400" />}
            </h3>
            <div className="flex items-center text-white/80 text-sm mt-1">
                 <Star size={14} className="text-yellow-400 fill-yellow-400 mr-1" />
                 <span className="font-bold text-white mr-1">{driver.rating}</span>
                 <span>• {driver.experience} Years Exp</span>
            </div>
       </div>
    </div>
    
    {/* Slide up details */}
    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-800 p-5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out shadow-inner">
        <div className="flex justify-between items-center mb-3">
            <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 mb-1"><CheckCircle size={14} className="text-green-500"/> Verified License</div>
                <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> Background Check</div>
            </div>
        </div>
        <div className="flex gap-2">
             <button onClick={() => onViewDetails(driver)} className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-600">
                View Details
            </button>
            <button onClick={() => onHire(driver)} className="flex-1 py-2 bg-accent-500 text-white rounded-lg font-bold text-sm hover:bg-accent-600">
                Hire Driver
            </button>
        </div>
    </div>
  </div>
);

const BookingModal: React.FC<{ 
  vehicle: Vehicle; 
  user: User; 
  onClose: () => void; 
  onConfirm: (bookingData: Partial<Booking>) => void 
}> = ({ vehicle, user, onClose, onConfirm }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('18:00');
  const [withDriver, setWithDriver] = useState(false);

  // Calculated values
  const [estimatedDistance, setEstimatedDistance] = useState(0);
  const [fareBreakdown, setFareBreakdown] = useState<{ baseRent: number, distanceCharge: number, surcharges: number, driverFee: number, total: number } | null>(null);

  useEffect(() => {
      // Simulate distance calculation when locations change
      if (pickup && dropoff) {
          const dist = Math.floor(Math.random() * 50) + 10; // Mock distance 10-60km
          setEstimatedDistance(dist);
      } else {
          setEstimatedDistance(0);
      }
  }, [pickup, dropoff]);

  useEffect(() => {
      if (startDate && endDate && startTime && endTime) {
          const start = new Date(`${startDate}T${startTime}`);
          const end = new Date(`${endDate}T${endTime}`);
          
          if (end > start) {
              const durationMs = end.getTime() - start.getTime();
              const durationDays = durationMs / (1000 * 60 * 60 * 24);

              // 1. Base Rent Calculation
              const baseRent = vehicle.pricePerDayInr * durationDays;

              // 2. Distance Charge (Simulated ₹10/km)
              const distanceCharge = estimatedDistance * 10;

              // 3. Driver Fee (₹800 per day if selected)
              const driverFee = withDriver ? (800 * durationDays) : 0;

              // 4. Surcharges
              let surcharges = 0;
              
              // Vehicle Type Surcharge
              let typeMultiplier = 1.0;
              if (vehicle.type === VehicleType.SUV) typeMultiplier = 1.15;
              if (vehicle.type === VehicleType.TEMPO_TRAVELLER) typeMultiplier = 1.3;
              if (vehicle.type === VehicleType.TRUCK || vehicle.type === VehicleType.LORRY) typeMultiplier = 1.4;
              
              surcharges += baseRent * (typeMultiplier - 1);

              // Capacity Surcharge
              if (vehicle.seatingCapacity > 5) {
                  surcharges += (vehicle.seatingCapacity - 5) * 100 * durationDays; // ₹100 per extra seat per day
              }

              const total = baseRent + distanceCharge + surcharges + driverFee;

              setFareBreakdown({
                  baseRent,
                  distanceCharge,
                  surcharges,
                  driverFee,
                  total
              });
          } else {
              setFareBreakdown(null);
          }
      } else {
          setFareBreakdown(null);
      }
  }, [startDate, endDate, startTime, endTime, estimatedDistance, vehicle, withDriver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fareBreakdown) {
        onConfirm({
            startDate,
            startTime,
            endDate,
            endTime,
            pickupLocation: pickup,
            dropoffLocation: dropoff,
            totalCostInr: Math.round(fareBreakdown.total),
            distanceKm: estimatedDistance,
            withDriver: withDriver
        });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={24} />
        </button>
        <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Book {vehicle.make} {vehicle.model}</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Fill in the details to get a fare estimate.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Start</label>
                        <input type="date" required className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={startDate} onChange={e => setStartDate(e.target.value)} />
                        <input type="time" required className="w-full p-2 mt-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">End</label>
                        <input type="date" required className="w-full p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={endDate} onChange={e => setEndDate(e.target.value)} />
                        <input type="time" required className="w-full p-2 mt-1 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Pickup Location</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400"/>
                        <input type="text" required placeholder="Enter pickup address" className="w-full pl-9 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={pickup} onChange={e => setPickup(e.target.value)} />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 uppercase">Dropoff Location</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400"/>
                        <input type="text" required placeholder="Enter dropoff address" className="w-full pl-9 p-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-sm" value={dropoff} onChange={e => setDropoff(e.target.value)} />
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                         <div className="bg-white dark:bg-slate-600 p-2 rounded-full">
                             <UserIcon size={18} className="text-slate-600 dark:text-slate-300" />
                         </div>
                         <div>
                             <p className="font-semibold text-sm text-slate-800 dark:text-white">Hire a Driver?</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">Get a verified chauffeur for ₹800/day</p>
                         </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={withDriver} onChange={() => setWithDriver(!withDriver)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                    </label>
                </div>

                {/* Live Fare Calculator */}
                {fareBreakdown ? (
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 mt-4">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
                            <IndianRupee size={14}/> Fare Breakdown
                        </h3>
                        <div className="space-y-1 text-sm">
                             <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>Base Rent ({vehicle.pricePerDayInr}/day)</span>
                                <span>₹{fareBreakdown.baseRent.toFixed(0)}</span>
                             </div>
                             <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>Est. Distance ({estimatedDistance} km)</span>
                                <span>₹{fareBreakdown.distanceCharge.toFixed(0)}</span>
                             </div>
                             {fareBreakdown.driverFee > 0 && (
                                 <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                    <span>Driver Charges</span>
                                    <span>₹{fareBreakdown.driverFee.toFixed(0)}</span>
                                 </div>
                             )}
                             <div className="flex justify-between text-slate-600 dark:text-slate-300">
                                <span>Vehicle Surcharges</span>
                                <span>₹{fareBreakdown.surcharges.toFixed(0)}</span>
                             </div>
                             <div className="border-t border-slate-300 dark:border-slate-500 mt-2 pt-2 flex justify-between font-bold text-lg text-primary-600 dark:text-primary-400">
                                <span>Total Estimate</span>
                                <span>₹{Math.round(fareBreakdown.total).toLocaleString('en-IN')}</span>
                             </div>
                        </div>
                    </div>
                ) : (
                   <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                       Enter valid dates and locations to see fare estimate.
                   </div>
                )}

                <button 
                    type="submit" 
                    disabled={!fareBreakdown}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed mt-4 transition-all"
                >
                    Confirm Booking
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

const ComplaintModal: React.FC<{ bookingId: number; user: User; onClose: () => void; onComplaintSubmitted: () => void }> = ({ bookingId, user, onClose, onComplaintSubmitted }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!subject || !description) return;

        const newComplaint: Complaint = {
            id: Math.max(...mockComplaints.map(c => c.id), 0) + 1,
            reporterId: user.id,
            reporterRole: Role.USER,
            bookingId: bookingId,
            subject,
            description,
            status: ComplaintStatus.OPEN,
            createdAt: new Date().toISOString().split('T')[0],
        };
        mockComplaints.push(newComplaint);
        onComplaintSubmitted();
    }

    return (
        <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X size={24} /></button>
                <div className="p-8">
                    <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Report an Issue</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">Report an issue for Booking #{bookingId}.</p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                        </div>
                        <button type="submit" className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 font-semibold shadow-lg">Submit Complaint</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

const BookingHistoryItem: React.FC<{ booking: Booking; onClick: () => void; onReport: () => void; onRate: () => void }> = ({ booking, onClick, onReport, onRate }) => {
    const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
    const driver = booking.driverId ? mockDrivers.find(d => d.id === booking.driverId) : null;
    
    const userReview = mockReviews.find(r => r.bookingId === booking.id && r.reviewerId === booking.userId);
    const hasRated = !!userReview;

    const statusColor = {
        [BookingStatus.CONFIRMED]: 'text-green-600 bg-green-100 dark:bg-green-900/30',
        [BookingStatus.COMPLETED]: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        [BookingStatus.PENDING]: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
        [BookingStatus.CANCELLED]: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    };

    return (
        <div onClick={onClick} className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
            <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {vehicle ? <img src={vehicle.imageUrl} alt="v" className="w-full h-full object-cover"/> : (driver ? <img src={driver.profilePictureUrl} alt="d" className="w-full h-full object-cover"/> : <Car className="text-slate-400" />)}
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor[booking.status]}`}>{booking.status}</span>
                         <span className="text-xs text-slate-400">#{booking.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                        {vehicle ? `${vehicle.make} ${vehicle.model}` : (driver ? `Driver: ${driver.name}` : 'Trip')}
                    </h4>
                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar size={14}/> {booking.startDate} <ArrowRight size={12}/> {booking.endDate}
                    </div>
                     <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        ₹{booking.totalCostInr.toLocaleString('en-IN')}
                    </div>
                    {hasRated && userReview?.comment && (
                        <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-700/50 rounded text-xs text-slate-600 dark:text-slate-300 italic border-l-2 border-yellow-400">
                             "{userReview.comment}"
                        </div>
                    )}
                </div>
            </div>
            
            <div className="flex flex-row gap-2 justify-end items-center sm:items-end">
                <button 
                    onClick={(e) => { e.stopPropagation(); onReport(); }}
                    className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                >
                    <AlertTriangle size={14}/> Report
                </button>

                {booking.status === BookingStatus.COMPLETED && !hasRated && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRate(); }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-yellow-400 text-yellow-900 hover:bg-yellow-500 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                    >
                        <Star size={14}/> Rate Your Journey
                    </button>
                )}
                {booking.status === BookingStatus.COMPLETED && hasRated && (
                     <div className="flex-1 sm:flex-none px-3 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-600 h-[34px]">
                        <Star size={14} className="fill-yellow-400 text-yellow-400"/> {userReview?.rating}/5
                     </div>
                )}
            </div>
        </div>
    );
};

// --- Main Portal Component ---

const UserPortal: React.FC<UserPortalProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'drivers' | 'history'>('vehicles');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('All');
  const [searchLocation, setSearchLocation] = useState('');
  
  // Modal States
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);
  const [viewDriver, setViewDriver] = useState<Driver | null>(null);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [reviewBookingId, setReviewBookingId] = useState<number | null>(null);
  const [complaintBookingId, setComplaintBookingId] = useState<number | null>(null);
  
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  // Handlers
  const handleBookVehicle = (vehicle: Vehicle) => {
      setSelectedVehicleForBooking(vehicle);
  }

  const confirmBooking = (bookingData: Partial<Booking>) => {
      if (selectedVehicleForBooking) {
          const newBooking: Booking = {
              id: Math.floor(Math.random() * 10000) + 1000,
              userId: user.id,
              vehicleId: selectedVehicleForBooking.id,
              startDate: bookingData.startDate!,
              startTime: bookingData.startTime!,
              endDate: bookingData.endDate!,
              endTime: bookingData.endTime!,
              totalCostInr: bookingData.totalCostInr!,
              status: BookingStatus.CONFIRMED, // Auto confirm for demo
              pickupLocation: bookingData.pickupLocation!,
              dropoffLocation: bookingData.dropoffLocation!,
              distanceKm: bookingData.distanceKm,
              withDriver: bookingData.withDriver
          };
          
          mockBookings.unshift(newBooking);
          mockVehicles.find(v => v.id === selectedVehicleForBooking.id)!.status = VehicleStatus.BOOKED;
          
          setSelectedVehicleForBooking(null);
          setSuccessBooking(newBooking);
          forceUpdate();
      }
  };

  const handleHireDriver = (driver: Driver) => {
      // Simplified hire logic without full fare calc for now, or re-use modal? 
      // For this demo, we'll let the parent handler decide status, but we can alert.
      // Ideally, we'd pop up the same BookingModal but contextually for a driver. 
      alert(`Request sent to ${driver.name}. Check 'Booking History' for updates.`);
      const newBooking: Booking = {
        id: Math.floor(Math.random() * 10000) + 1000,
        userId: user.id,
        driverId: driver.id,
        startDate: '2024-08-25',
        startTime: '09:00',
        endDate: '2024-08-25',
        endTime: '18:00',
        totalCostInr: 1500, // Base driver fee
        status: BookingStatus.PENDING,
        pickupLocation: 'My Location',
        dropoffLocation: 'Destination',
      };
      mockBookings.unshift(newBooking);
      forceUpdate();
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
      if (reviewBookingId) {
          const newReview: Review = {
              id: Date.now(),
              bookingId: reviewBookingId,
              reviewerId: user.id,
              rating,
              comment,
              createdAt: new Date().toISOString().split('T')[0]
          };
          mockReviews.push(newReview);
          setReviewBookingId(null);
          alert("Review submitted!");
          forceUpdate();
      }
  };

  const handleComplaintSubmit = () => {
      setComplaintBookingId(null);
      alert("Issue reported to admin.");
      forceUpdate();
  };

  // Data filtering
  const availableVehicles = mockVehicles.filter(v => 
      v.status === VehicleStatus.AVAILABLE && 
      v.verificationStatus === 'Verified' &&
      (selectedVehicleType === 'All' || v.type === selectedVehicleType) &&
      (searchLocation === '' || v.location.toLowerCase().includes(searchLocation.toLowerCase()))
  );

  const availableDrivers = mockDrivers.filter(d => 
      d.availability && d.verificationStatus === 'Verified'
  );

  const userBookings = mockBookings.filter(b => b.userId === user.id).sort((a, b) => b.id - a.id);

  // Get reviewee name for the modal
  const getRevieweeName = (bookingId: number | null) => {
      if (!bookingId) return undefined;
      const booking = mockBookings.find(b => b.id === bookingId);
      if (!booking) return undefined;
      
      if (booking.vehicleId) {
          const v = mockVehicles.find(veh => veh.id === booking.vehicleId);
          return v ? `${v.make} ${v.model}` : undefined;
      }
      if (booking.driverId) {
          const d = mockDrivers.find(drv => drv.id === booking.driverId);
          return d ? d.name : undefined;
      }
      return undefined;
  }

  return (
    <div className="container mx-auto">
      {/* Modals */}
      {selectedVehicleForBooking && (
          <BookingModal 
             vehicle={selectedVehicleForBooking} 
             user={user} 
             onClose={() => setSelectedVehicleForBooking(null)} 
             onConfirm={confirmBooking}
          />
      )}
      {viewVehicle && <VehicleDetailsModal vehicle={viewVehicle} onClose={() => setViewVehicle(null)} onBook={() => { setViewVehicle(null); handleBookVehicle(viewVehicle); }} />}
      {viewDriver && <DriverDetailsModal driver={viewDriver} onClose={() => setViewDriver(null)} onHire={() => { setViewDriver(null); handleHireDriver(viewDriver); }} />}
      {viewBooking && <BookingDetailsModal booking={viewBooking} onClose={() => setViewBooking(null)} />}
      {successBooking && <BookingSuccessModal booking={successBooking} onClose={() => setSuccessBooking(null)} />}
      {reviewBookingId && <ReviewModal bookingId={reviewBookingId} revieweeName={getRevieweeName(reviewBookingId)} title="Rate Your Journey" onClose={() => setReviewBookingId(null)} onSubmit={handleReviewSubmit} />}
      {complaintBookingId && <ComplaintModal bookingId={complaintBookingId} user={user} onClose={() => setComplaintBookingId(null)} onComplaintSubmitted={handleComplaintSubmit} />}

      <div className="flex flex-col items-center mb-8 gap-4 text-center">
        <div>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">RentIt <span className="text-primary-600">Portal</span></h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.name}.</p>
        </div>
      </div>

      {/* Premium Full-Width Navigation Bar - Black Base with Blur Buttons */}
      <div className="sticky top-[64px] z-30 -mx-4 md:-mx-8 mb-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)] bg-black shadow-2xl border-b border-slate-800">
        <div className="w-full flex max-w-7xl mx-auto">
            {[
                { id: 'vehicles', label: 'Vehicles', icon: Car },
                { id: 'drivers', label: 'Drivers', icon: UserIcon },
                { id: 'history', label: 'History', icon: Clock }
            ].map(tab => (
                 <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`
                        flex-1 relative py-6 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden group flex items-center justify-center gap-3
                        ${activeTab === tab.id
                            ? 'text-white bg-white/10 backdrop-blur-md shadow-[inset_0_-2px_20px_rgba(255,255,255,0.1)] border-b-2 border-primary-500' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        }
                    `}
                 >
                    {/* Animated background glow for active tab */}
                    {activeTab === tab.id && (
                        <span className="absolute inset-0 bg-gradient-to-t from-primary-500/20 to-transparent opacity-50 animate-pulse" />
                    )}
                    
                    <tab.icon size={18} className={`relative z-10 transition-transform duration-300 ${activeTab === tab.id ? 'scale-125 text-primary-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]' : 'group-hover:scale-110 group-hover:text-slate-200'}`} />
                    <span className={`relative z-10 transition-all duration-300 ${activeTab === tab.id ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`}>{tab.label}</span>
                 </button>
            ))}
        </div>
      </div>

      {activeTab === 'vehicles' && (
        <div className="animate-in fade-in duration-500">
           {/* Filters */}
           <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
               <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Location</label>
                   <div className="relative">
                       <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                       <input 
                          type="text" 
                          placeholder="Where do you want to rent?" 
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                       />
                   </div>
               </div>
               <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Vehicle Type</label>
                    <select 
                        value={selectedVehicleType}
                        onChange={(e) => setSelectedVehicleType(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="All">All Types</option>
                        {Object.values(VehicleType).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
               </div>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {availableVehicles.map(vehicle => (
                    <VehicleCard 
                        key={vehicle.id} 
                        vehicle={vehicle} 
                        onBook={handleBookVehicle} 
                        onViewDetails={setViewVehicle}
                    />
                ))}
                {availableVehicles.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <div className="bg-slate-100 dark:bg-slate-800 inline-block p-6 rounded-full mb-4"><Car size={48} className="text-slate-400"/></div>
                        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">No vehicles found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search location.</p>
                    </div>
                )}
           </div>
        </div>
      )}

      {activeTab === 'drivers' && (
          <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Verified Drivers for Hire</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {availableDrivers.map(driver => (
                      <DriverCard 
                          key={driver.id} 
                          driver={driver} 
                          onHire={() => { setViewDriver(driver); }} 
                          onViewDetails={setViewDriver} 
                      />
                  ))}
              </div>
          </div>
      )}

      {activeTab === 'history' && (
          <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Booking History</h2>
                 <button onClick={() => forceUpdate()} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
                     <RotateCw size={16} /> Refresh
                 </button>
              </div>
              <div className="space-y-4">
                  {userBookings.length > 0 ? userBookings.map(booking => (
                      <BookingHistoryItem 
                        key={booking.id} 
                        booking={booking} 
                        onClick={() => setViewBooking(booking)}
                        onRate={() => setReviewBookingId(booking.id)}
                        onReport={() => setComplaintBookingId(booking.id)}
                      />
                  )) : (
                      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-500 dark:text-slate-400 text-lg">You haven't made any bookings yet.</p>
                          <button onClick={() => setActiveTab('vehicles')} className="mt-4 text-primary-600 font-bold hover:underline">Browse Vehicles</button>
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default UserPortal;
