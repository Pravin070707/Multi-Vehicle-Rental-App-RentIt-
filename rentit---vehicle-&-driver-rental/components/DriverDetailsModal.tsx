
import React from 'react';
import { Driver } from '../types';
import { X, ShieldCheck, Star, Award, MapPin, CheckCircle, Languages, Calendar } from 'lucide-react';
import { mockBookings, mockReviews, mockUsers } from '../data/mockData';

interface DriverDetailsModalProps {
  driver: Driver;
  onClose: () => void;
  onHire: () => void;
}

const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({ driver, onClose, onHire }) => {
  // Find reviews for this driver
  const driverBookingIds = mockBookings.filter(b => b.driverId === driver.id).map(b => b.id);
  const reviews = mockReviews.filter(r => driverBookingIds.includes(r.bookingId));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
        
        {/* Header Background */}
        <div className="h-24 bg-gradient-to-r from-primary-500 to-accent-500 shrink-0"></div>
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-1 transition-colors z-10">
            <X size={20} />
        </button>

        {/* Profile Content - Scrollable */}
        <div className="px-6 pb-8 relative overflow-y-auto flex-1">
            {/* Profile Picture */}
            <div className="absolute -top-12 left-6 p-1 bg-white dark:bg-slate-800 rounded-full">
                <img src={driver.profilePictureUrl} alt={driver.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800" />
            </div>

            {/* Verification Badge (Top Right within content) */}
            <div className="flex justify-end mt-4 h-8">
                {driver.isVerified && (
                     <span className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                        <ShieldCheck size={14} /> Verified Driver
                     </span>
                )}
            </div>

            <div className="mt-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {driver.name}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Professional Driver</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6 border-t border-b border-slate-100 dark:border-slate-700 py-4">
                <div className="text-center">
                    <div className="flex items-center justify-center text-yellow-500 font-bold text-lg">
                        <Star size={18} className="fill-current mr-1"/> {driver.rating.toFixed(1)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rating</p>
                </div>
                <div className="text-center border-l border-r border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-lg">
                        <Award size={18} className="mr-1 text-primary-500"/> {driver.experience}y
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Experience</p>
                </div>
                 <div className="text-center">
                    <div className="flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-lg">
                        <CheckCircle size={18} className="mr-1 text-green-500"/> 200+
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">Trips</p>
                </div>
            </div>

            {/* Details List */}
            <div className="mt-6 space-y-3">
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <div className="w-8 flex justify-center text-slate-400"><ShieldCheck size={18}/></div>
                    <span className="text-sm"><span className="font-semibold">License:</span> Verified Commercial</span>
                </div>
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <div className="w-8 flex justify-center text-slate-400"><Languages size={18}/></div>
                    <span className="text-sm"><span className="font-semibold">Languages:</span> English, Tamil, Hindi</span>
                </div>
                 <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <div className="w-8 flex justify-center text-slate-400"><MapPin size={18}/></div>
                    <span className="text-sm"><span className="font-semibold">Based in:</span> Chennai, Tamil Nadu</span>
                </div>
                 <div className="flex items-center text-slate-700 dark:text-slate-300">
                    <div className="w-8 flex justify-center text-slate-400"><Calendar size={18}/></div>
                    <span className="text-sm"><span className="font-semibold">Availability:</span> Immediate</span>
                </div>
            </div>
            
            {/* Reviews List */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Recent Reviews ({reviews.length})</h3>
                <div className="space-y-3">
                    {reviews.length > 0 ? reviews.slice(0, 3).map(review => (
                        <div key={review.id} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-xs text-slate-700 dark:text-slate-300">{mockUsers.find(u => u.id === review.reviewerId)?.name}</span>
                                <div className="flex"><Star size={10} className="fill-yellow-400 text-yellow-400"/><span className="text-xs ml-1">{review.rating}</span></div>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-400">"{review.comment}"</p>
                        </div>
                    )) : <p className="text-xs text-slate-500 italic">No reviews yet.</p>}
                </div>
            </div>

            {/* Action Button */}
            <div className="mt-8">
                <button onClick={onHire} className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform active:scale-95 flex items-center justify-center gap-2">
                    Hire {driver.name.split(' ')[0]}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
