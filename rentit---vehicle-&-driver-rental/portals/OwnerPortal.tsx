
import React, { useState, useReducer } from 'react';
import { VehicleOwner, Vehicle, Booking, BookingStatus, Role, Complaint, ComplaintStatus, VehicleStatus, VehicleType, Driver, VerificationStatus } from '../types';
import { mockVehicles, mockBookings, mockUsers, mockComplaints, mockReviews, mockDrivers } from '../data/mockData';
import { IndianRupee, Car, Wrench, PlusCircle, MapPin, AlertTriangle, X, Calendar, Star, MessageSquare, User, UserPlus, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';
import ManageVehicleModal from '../components/ManageVehicleModal';
import RegisterDriverModal from '../components/RegisterDriverModal';

interface OwnerPortalProps {
  owner: VehicleOwner;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md flex items-center space-x-4 border border-slate-200 dark:border-slate-700">
        <div className="bg-primary-100 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase font-semibold">{title}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        </div>
    </div>
);

const MyVehicleCard: React.FC<{ vehicle: Vehicle; onManage: (vehicle: Vehicle) => void; }> = ({ vehicle, onManage }) => {
    const statusClasses: {[key in VehicleStatus]: string} = {
        [VehicleStatus.AVAILABLE]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [VehicleStatus.BOOKED]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [VehicleStatus.IN_SERVICE]: 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-300',
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-4 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            {vehicle.verificationStatus === VerificationStatus.PENDING && (
                <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                    <Clock size={12} /> Verifying
                </div>
            )}
            {vehicle.verificationStatus === VerificationStatus.REJECTED && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1 z-10">
                    <X size={12} /> Rejected
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <img src={vehicle.imageUrl} alt={vehicle.model} className="w-24 h-16 rounded-md object-cover" />
                    <div>
                        <p className="font-bold text-slate-900 dark:text-white">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{vehicle.registration}</p>
                         <span className={`mt-1 inline-block px-2 py-0.5 text-xs font-semibold rounded-full ${statusClasses[vehicle.status]}`}>
                            {vehicle.status}
                        </span>
                    </div>
                </div>
                <button onClick={() => onManage(vehicle)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 font-semibold">
                    Manage
                </button>
            </div>
            {vehicle.status === VehicleStatus.IN_SERVICE && vehicle.serviceStartDate && vehicle.serviceEndDate && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-slate-400" />
                    <span>In service until {vehicle.serviceEndDate}. Details: {vehicle.serviceDetails}</span>
                </div>
            )}
        </div>
    );
};

const BookingInfoCard: React.FC<{ booking: Booking, onClick: () => void }> = ({ booking, onClick }) => {
    const user = mockUsers.find(u => u.id === booking.userId);
    const vehicle = mockVehicles.find(v => v.id === booking.vehicleId);
     const statusClasses: {[key in BookingStatus]: string} = {
        [BookingStatus.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [BookingStatus.COMPLETED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };

    return (
        <button onClick={onClick} className="w-full text-left bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
            <div>
                <p className="font-bold text-slate-900 dark:text-white">Booking #{booking.id} for {vehicle?.make} {vehicle?.model}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Renter: {user?.name}</p>
                 <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-1"><MapPin size={14} className="mr-2" /> {booking.pickupLocation} to {booking.dropoffLocation}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusClasses[booking.status]}`}>
                {booking.status}
            </span>
        </button>
    );
};

const ComplaintModal: React.FC<{ bookingId: number; owner: VehicleOwner; onClose: () => void; onComplaintSubmitted: () => void }> = ({ bookingId, owner, onClose, onComplaintSubmitted }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!subject || !description) return;

        const newComplaint: Complaint = {
            id: Math.max(...mockComplaints.map(c => c.id), 0) + 1,
            reporterId: owner.id,
            reporterRole: Role.OWNER,
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
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

const OwnerPortal: React.FC<OwnerPortalProps> = ({ owner }) => {
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews'>('dashboard');
  const [complaintModalBookingId, setComplaintModalBookingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isRegisteringDriver, setIsRegisteringDriver] = useState(false);

  const myVehicles = mockVehicles.filter(v => v.ownerId === owner.id);
  const myVehicleIds = myVehicles.map(v => v.id);
  const myBookings = mockBookings.filter(b => b.vehicleId && myVehicleIds.includes(b.vehicleId));
  const pendingRequests = myBookings.filter(b => b.status === BookingStatus.PENDING);
  
  const handleReportIssue = (bookingId: number) => {
      setComplaintModalBookingId(bookingId);
  }

  const handleComplaintSubmitted = () => {
      setComplaintModalBookingId(null);
      forceUpdate();
      alert('Complaint submitted successfully.');
  }

  const handleAddNewVehicle = () => {
      const newVehicle: Vehicle = {
          id: 0, // Temp ID for new vehicle
          ownerId: owner.id,
          make: '',
          model: '',
          year: new Date().getFullYear(),
          type: VehicleType.CAR,
          seatingCapacity: 4,
          imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80',
          pricePerDayInr: 0,
          location: '',
          status: VehicleStatus.AVAILABLE,
          verificationStatus: VerificationStatus.PENDING, // New vehicles are pending
          registration: '',
          insuranceExpiry: '',
      };
      setEditingVehicle(newVehicle);
  };

  const handleSaveVehicle = (updatedVehicle: Vehicle) => {
      if (updatedVehicle.id === 0) {
          // Create new
          const newId = Math.max(...mockVehicles.map(v => v.id), 0) + 1;
          const finalVehicle = { ...updatedVehicle, id: newId, verificationStatus: VerificationStatus.PENDING };
          mockVehicles.push(finalVehicle);
          alert('Vehicle added and sent for verification.');
      } else {
          // Update existing
          const index = mockVehicles.findIndex(v => v.id === updatedVehicle.id);
          if (index !== -1) {
              mockVehicles[index] = updatedVehicle;
          }
      }
      setEditingVehicle(null);
      forceUpdate();
  };

  const handleRegisterDriver = (driverData: Partial<Driver>) => {
      const newId = Math.max(...mockDrivers.map(d => d.id), 0) + 1;
      const newDriver = {
          ...driverData,
          id: newId,
      } as Driver;
      mockDrivers.push(newDriver);
      alert('Driver request submitted to Admin for verification.');
      setIsRegisteringDriver(false);
      forceUpdate();
  };
  
  const totalEarnings = myBookings
    .filter(b => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + b.totalCostInr, 0);

  const vehiclesInService = myVehicles.filter(v => v.status === VehicleStatus.IN_SERVICE).length;

  // Reviews
  const myBookingIds = myBookings.map(b => b.id);
  const myReviews = mockReviews.filter(r => myBookingIds.includes(r.bookingId));

  return (
    <div className="container mx-auto">
      {complaintModalBookingId && <ComplaintModal bookingId={complaintModalBookingId} owner={owner} onClose={() => setComplaintModalBookingId(null)} onComplaintSubmitted={handleComplaintSubmitted} />}
      {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
      {editingVehicle && <ManageVehicleModal vehicle={editingVehicle} onClose={() => setEditingVehicle(null)} onSave={handleSaveVehicle} />}
      {isRegisteringDriver && <RegisterDriverModal onClose={() => setIsRegisteringDriver(false)} onRegister={handleRegisterDriver} />}

      <h1 className="text-4xl font-extrabold mb-6 text-slate-900 dark:text-white">Owner Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} icon={<IndianRupee size={28} />} />
        <StatCard title="Your Vehicles" value={myVehicles.length.toString()} icon={<Car size={28} />} />
        <StatCard title="Vehicles In Service" value={vehiclesInService.toString()} icon={<Wrench size={28} />} />
        <StatCard title="Pending Requests" value={pendingRequests.length.toString()} icon={<Calendar size={28} />} />
      </div>

       {/* Navigation Tabs */}
       <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
         <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-accent-500 text-accent-600 dark:text-accent-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} py-4 px-1 border-b-2 font-medium text-sm`}>
                Manage Fleet
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`${activeTab === 'reviews' ? 'border-accent-500 text-accent-600 dark:text-accent-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} py-4 px-1 border-b-2 font-medium text-sm`}>
                Vehicle Reviews
            </button>
         </nav>
      </div>

      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Manage Your Vehicles</h2>
                <div className="space-y-4">
                    {myVehicles.map(vehicle => <MyVehicleCard key={vehicle.id} vehicle={vehicle} onManage={setEditingVehicle} />)}
                    
                    <div className="flex gap-3 mt-4">
                         <button onClick={handleAddNewVehicle} className="flex-1 bg-accent-500 text-white p-3 rounded-lg hover:bg-accent-600 transition-colors font-semibold flex items-center justify-center gap-2">
                            <PlusCircle size={20} /> Add New Vehicle
                        </button>
                        <button onClick={() => setIsRegisteringDriver(true)} className="flex-1 bg-primary-600 text-white p-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2">
                            <UserPlus size={20} /> Register Driver
                        </button>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Booking Requests & History</h2>
                <div className="space-y-4">
                    {myBookings.length > 0 ? (
                        myBookings.map(req => (
                            <div key={req.id} className="flex items-center gap-2">
                                <div className="flex-grow">
                                    <BookingInfoCard booking={req} onClick={() => setSelectedBooking(req)} />
                                </div>
                                <button onClick={() => handleReportIssue(req.id)} className="p-2 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400" title="Report an issue">
                                    <AlertTriangle size={18} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">No booking requests found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {activeTab === 'reviews' && (
          <div>
              <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">User Feedback</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myReviews.length > 0 ? (
                      myReviews.map(review => {
                          const booking = mockBookings.find(b => b.id === review.bookingId);
                          const vehicle = mockVehicles.find(v => v.id === booking?.vehicleId);
                          const user = mockUsers.find(u => u.id === review.reviewerId);
                          
                          return (
                              <div key={review.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                                  <div className="flex justify-between items-start mb-4">
                                      <div className="flex items-center gap-3">
                                          <div className="bg-primary-100 dark:bg-slate-700 p-2 rounded-full">
                                              <User size={20} className="text-primary-600 dark:text-primary-400"/>
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 dark:text-white">{user?.name || 'User'}</p>
                                              <p className="text-xs text-slate-500 dark:text-slate-400">For {vehicle?.make} {vehicle?.model} • {review.createdAt}</p>
                                          </div>
                                      </div>
                                      <div className="flex bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-lg">
                                          {[...Array(5)].map((_, i) => (
                                              <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"} />
                                          ))}
                                      </div>
                                  </div>
                                  <div className="relative">
                                      <MessageSquare size={16} className="absolute top-1 left-0 text-slate-300 dark:text-slate-600" />
                                      <p className="text-slate-700 dark:text-slate-300 pl-6 italic">"{review.comment}"</p>
                                  </div>
                              </div>
                          );
                      })
                  ) : (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No reviews yet.</p>
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default OwnerPortal;
