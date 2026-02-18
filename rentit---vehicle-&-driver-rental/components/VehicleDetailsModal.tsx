
import React from 'react';
import { Vehicle, Review } from '../types';
import { mockBookings, mockReviews, mockUsers } from '../data/mockData';
import { X, MapPin, IndianRupee, Calendar, Star, User } from 'lucide-react';

interface VehicleDetailsModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onBook: () => void;
}

const VehicleDetailsModal: React.FC<VehicleDetailsModalProps> = ({ vehicle, onClose, onBook }) => {
  // Find all bookings for this vehicle
  const vehicleBookingIds = mockBookings.filter(b => b.vehicleId === vehicle.id).map(b => b.id);
  // Find reviews associated with those bookings
  const reviews = mockReviews.filter(r => vehicleBookingIds.includes(r.bookingId));
  
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : 'New';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl relative overflow-hidden flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/20 hover:bg-black/40 rounded-full p-1 z-10 transition-colors">
            <X size={24} />
        </button>

        {/* Image Header */}
        <div className="relative h-64 shrink-0">
            <img src={vehicle.imageUrl} alt={vehicle.model} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
                <h2 className="text-3xl font-bold">{vehicle.make} {vehicle.model}</h2>
                <p className="text-lg opacity-90">{vehicle.year} • {vehicle.type}</p>
            </div>
            <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{averageRating}</span>
                <span className="text-sm opacity-80">({reviews.length} reviews)</span>
            </div>
        </div>

        {/* Content Scrollable */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
            {/* Specs & Price */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mb-8 border-b border-slate-200 dark:border-slate-700 pb-6">
                <div className="space-y-3">
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                        <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                        <span>{vehicle.location}</span>
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                        <User className="w-5 h-5 mr-2 text-primary-500" />
                        <span>{vehicle.seatingCapacity} Seater</span>
                    </div>
                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                        <span className="w-5 h-5 mr-2 flex items-center justify-center font-bold text-primary-500 border border-primary-500 rounded text-xs">TN</span>
                        <span>{vehicle.registration}</span>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Daily Rate</p>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 flex items-center justify-end">
                        <IndianRupee size={24} /> {vehicle.pricePerDayInr.toLocaleString('en-IN')}
                    </p>
                    <button onClick={onBook} className="mt-3 bg-accent-500 hover:bg-accent-600 text-white px-6 py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95">
                        Book This Vehicle
                    </button>
                </div>
            </div>

            {/* Reviews Section */}
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    Reviews & Ratings
                </h3>
                
                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map(review => {
                            const reviewer = mockUsers.find(u => u.id === review.reviewerId);
                            return (
                                <div key={review.id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <img src={reviewer?.profilePictureUrl} alt={reviewer?.name} className="w-8 h-8 rounded-full object-cover" />
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-white text-sm">{reviewer?.name || 'User'}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{review.createdAt}</p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm italic">"{review.comment}"</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-700/30 rounded-lg">
                        No reviews yet for this vehicle.
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal;
