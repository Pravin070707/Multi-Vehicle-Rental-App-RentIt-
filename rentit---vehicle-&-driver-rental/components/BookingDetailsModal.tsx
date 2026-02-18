
import React from 'react';
import { Booking, BookingStatus, User, Driver, Vehicle, VehicleType } from '../types';
import { mockUsers, mockDrivers, mockVehicles, mockReviews } from '../data/mockData';
import { X, Calendar, User as UserIcon, Car, MapPin, IndianRupee, ArrowRight, Star, MessageSquare } from 'lucide-react';

interface BookingDetailsModalProps {
  booking: Booking;
  onClose: () => void;
}

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 w-6 h-6 text-slate-500 dark:text-slate-400">{icon}</div>
        <div className="ml-3">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const EntityCard: React.FC<{ title: string; entity?: User | Driver | Vehicle }> = ({ title, entity }) => {
    if (!entity) return null;
    
    const isVehicle = 'make' in entity;
    const imageUrl = isVehicle ? entity.imageUrl : entity.profilePictureUrl;
    const name = isVehicle ? `${entity.make} ${entity.model}` : entity.name;
    const subtext = isVehicle ? entity.registration : (entity as Driver).rating ? `${(entity as Driver).rating} ★` : entity.email;

    return (
        <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg flex items-center space-x-3">
            <img src={imageUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</p>
                <p className="font-bold text-slate-800 dark:text-white">{name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{subtext}</p>
            </div>
        </div>
    );
};

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  const user = mockUsers.find(u => u.id === booking.userId);
  const driver = booking.driverId ? mockDrivers.find(d => d.id === booking.driverId) : null;
  const vehicle = booking.vehicleId ? mockVehicles.find(v => v.id === booking.vehicleId) : null;
  
  // Retrieve reviews from User
  const userReview = mockReviews.find(r => r.bookingId === booking.id && r.reviewerId === booking.userId);

  const statusClasses: {[key in BookingStatus]: string} = {
    [BookingStatus.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    [BookingStatus.COMPLETED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };

  const calculateFareDetails = () => {
    if (!vehicle) return null;

    const startDateTime = new Date(`${booking.startDate}T${booking.startTime}`);
    const endDateTime = new Date(`${booking.endDate}T${booking.endTime}`);
    const durationMs = endDateTime.getTime() - startDateTime.getTime();
    const totalDays = durationMs / (1000 * 60 * 60 * 24);

    const baseRent = totalDays * vehicle.pricePerDayInr;
    const distanceCharge = (booking.distanceKm || 0) * 10;
    const driverFee = booking.withDriver ? (800 * totalDays) : 0;

    let surcharges = 0;
    let vehicleTypeMultiplier = 1.0;
    switch (vehicle.type) {
        case VehicleType.SUV: vehicleTypeMultiplier = 1.15; break;
        case VehicleType.TRUCK: vehicleTypeMultiplier = 1.25; break;
        case VehicleType.LORRY:
        case VehicleType.CONTAINER_LORRY: vehicleTypeMultiplier = 1.4; break;
        case VehicleType.TEMPO_TRAVELLER: vehicleTypeMultiplier = 1.3; break;
        case VehicleType.BIKE: vehicleTypeMultiplier = 0.9; break;
    }
    surcharges += baseRent * (vehicleTypeMultiplier - 1);
            
    if (vehicle.seatingCapacity > 5) {
        surcharges += (vehicle.seatingCapacity - 5) * 100 * totalDays;
    }

    return { baseRent, distanceCharge, surcharges, driverFee };
  }

  const fareDetails = calculateFareDetails();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" style={{ animation: 'fadeIn 0.3s ease-out forwards' }} onClick={onClose}>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={24} />
            </button>
            <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Booking #{booking.id}</h2>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[booking.status]}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {user && <EntityCard title="User" entity={user} />}
                    {driver && <EntityCard title="Driver" entity={driver} />}
                    {vehicle && <EntityCard title="Vehicle" entity={vehicle} />}
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Trip Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                        <DetailItem 
                            icon={<Calendar />} 
                            label="Trip Period" 
                            value={`${booking.startDate} at ${booking.startTime} to ${booking.endDate} at ${booking.endTime}`}
                        />
                         <div className="md:col-span-2">
                             <DetailItem 
                                icon={<MapPin />} 
                                label="Route" 
                                value={
                                    <div className="flex items-center font-semibold text-slate-800 dark:text-slate-100">
                                        <span>{booking.pickupLocation}</span>
                                        <ArrowRight size={16} className="mx-2 text-primary-500" />
                                        <span>{booking.dropoffLocation}</span>
                                        {booking.distanceKm && <span className="ml-2 text-sm font-normal text-slate-500 dark:text-slate-400">({booking.distanceKm} km)</span>}
                                    </div>
                                }
                            />
                        </div>
                        {booking.withDriver && (
                            <div className="md:col-span-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium">
                                    <UserIcon size={16} /> Includes Chauffeur Service
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {fareDetails && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Fare Breakdown</h3>
                         <div className="space-y-2 text-sm bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Base Rent</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100">₹{fareDetails.baseRent.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Distance Charge</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100">₹{fareDetails.distanceCharge.toFixed(2)}</span>
                            </div>
                            {fareDetails.driverFee > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-300">Driver Charges</span>
                                    <span className="font-medium text-slate-800 dark:text-slate-100">₹{fareDetails.driverFee.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-slate-600 dark:text-slate-300">Surcharges</span>
                                <span className="font-medium text-slate-800 dark:text-slate-100">₹{fareDetails.surcharges.toFixed(2)}</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-600 flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                <span>Total Cost</span>
                                <span>₹{booking.totalCostInr.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                )}

                {userReview && (
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Trip Feedback</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/30">
                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">User Review</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className={i < userReview.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">{userReview.createdAt}</span>
                                </div>
                                <p className="text-slate-800 dark:text-slate-200 text-sm flex gap-2 items-start">
                                    <MessageSquare size={16} className="mt-0.5 text-slate-400 shrink-0" />
                                    <span>"{userReview.comment}"</span>
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        <style>{`
          @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes slideUp { 0% { transform: translateY(20px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        `}</style>
    </div>
  );
};

export default BookingDetailsModal;
