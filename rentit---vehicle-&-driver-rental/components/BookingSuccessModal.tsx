import React from 'react';
import { Booking } from '../types';
import { mockVehicles, mockDrivers } from '../data/mockData';
import { CheckCircle, Calendar, MapPin, IndianRupee, Car, User } from 'lucide-react';

interface BookingSuccessModalProps {
  booking: Booking;
  onClose: () => void;
}

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ booking, onClose }) => {
  const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
  const driver = booking.driverId ? mockDrivers.find(d => d.id === booking.driverId) : null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden flex flex-col">
        <div className="bg-green-500 p-6 flex flex-col items-center justify-center text-white">
            <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm">
                <CheckCircle size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-green-100 text-sm">Booking ID #{booking.id}</p>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-4">
                <span>We've sent the details to your email.</span>
            </div>

            {vehicle && (
                <div className="flex items-center gap-4">
                    <img src={vehicle.imageUrl} alt={vehicle.model} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Vehicle</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{vehicle.registration}</p>
                    </div>
                </div>
            )}

            {driver && !vehicle && (
                <div className="flex items-center gap-4">
                    <img src={driver.profilePictureUrl} alt={driver.name} className="w-16 h-16 rounded-full object-cover bg-slate-100" />
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Driver</p>
                        <p className="font-bold text-slate-900 dark:text-white text-lg">{driver.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{driver.experience} years exp</p>
                    </div>
                </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 text-sm">
                 <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Calendar size={14}/> From</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.startDate}, {booking.startTime}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Calendar size={14}/> To</span>
                    <span className="font-medium text-slate-900 dark:text-white">{booking.endDate}, {booking.endTime}</span>
                 </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><MapPin size={14}/> Route</span>
                    <span className="font-medium text-slate-900 dark:text-white text-right truncate max-w-[150px]">{booking.pickupLocation} to {booking.dropoffLocation}</span>
                 </div>
            </div>

             <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Total Estimated Cost</span>
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">₹{booking.totalCostInr.toLocaleString('en-IN')}</span>
             </div>

             <button onClick={onClose} className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity mt-2 shadow-lg">
                Done
             </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
