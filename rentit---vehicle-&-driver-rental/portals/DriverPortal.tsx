
import React, { useState, useReducer } from 'react';
import { Driver, Booking, BookingStatus, Role, Complaint, ComplaintStatus, Review } from '../types';
import { mockBookings, mockUsers, mockVehicles, mockComplaints, mockReviews } from '../data/mockData';
import { IndianRupee, Star, CheckCircle, XCircle, Calendar, User, Car, MapPin, AlertTriangle, X, MessageSquare } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';

interface DriverPortalProps {
  driver: Driver;
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

const JobRequestCard: React.FC<{ booking: Booking; onAccept: (id: number) => void; onDecline: (id: number) => void; }> = ({ booking, onAccept, onDecline }) => {
    const user = mockUsers.find(u => u.id === booking.userId);
    const vehicle = booking.vehicleId ? mockVehicles.find(v => v.id === booking.vehicleId) : null;

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-slate-200 dark:border-slate-700">
            <div>
                <p className="font-bold text-lg text-slate-900 dark:text-white">Job Request #{booking.id}</p>
                <div className="text-sm text-slate-600 dark:text-slate-300 mt-2 space-y-1">
                    <p className="flex items-center"><User size={14} className="mr-2" /> Renter: {user?.name}</p>
                    {vehicle && <p className="flex items-center"><Car size={14} className="mr-2" /> Vehicle: {vehicle.make} {vehicle.model}</p>}
                    <p className="flex items-center"><Calendar size={14} className="mr-2" /> Dates: {booking.startDate} at {booking.startTime} to {booking.endDate} at {booking.endTime}</p>
                    <p className="flex items-center"><MapPin size={14} className="mr-2" /> Trip: {booking.pickupLocation} to {booking.dropoffLocation}</p>
                </div>
            </div>
            <div className="flex space-x-2 w-full sm:w-auto">
                <button onClick={() => onAccept(booking.id)} className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center gap-2 transition-colors font-semibold">
                    <CheckCircle size={18} /> Accept
                </button>
                <button onClick={() => onDecline(booking.id)} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2 transition-colors font-semibold">
                    <XCircle size={18} /> Decline
                </button>
            </div>
        </div>
    );
};

const ComplaintModal: React.FC<{ bookingId: number; driver: Driver; onClose: () => void; onComplaintSubmitted: () => void }> = ({ bookingId, driver, onClose, onComplaintSubmitted }) => {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!subject || !description) return;

        const newComplaint: Complaint = {
            id: Math.max(...mockComplaints.map(c => c.id), 0) + 1,
            reporterId: driver.id,
            reporterRole: Role.DRIVER,
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

const DriverPortal: React.FC<DriverPortalProps> = ({ driver }) => {
  const [isAvailable, setIsAvailable] = useState(driver.availability);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'reviews'>('dashboard');
  const [_, forceUpdate] = useReducer(x => x + 1, 0);
  const [complaintModalBookingId, setComplaintModalBookingId] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  const handleBookingResponse = (id: number, status: BookingStatus) => {
    const booking = mockBookings.find(b => b.id === id);
    if(booking) {
        booking.status = status;
        forceUpdate();
    }
  };

  const handleReportIssue = (bookingId: number) => {
      setComplaintModalBookingId(bookingId);
  }

  const handleComplaintSubmitted = () => {
      setComplaintModalBookingId(null);
      forceUpdate();
      alert('Complaint submitted successfully.');
  }

  const driverBookings = mockBookings.filter(b => b.driverId === driver.id);
  const pendingJobs = driverBookings.filter(b => b.status === BookingStatus.PENDING);
  const totalEarnings = driverBookings
    .filter(b => b.status === BookingStatus.COMPLETED)
    .reduce((sum, b) => sum + b.totalCostInr * 0.8, 0); // Assume 80% cut
  
  // Calculate Reviews
  const driverBookingIds = driverBookings.map(b => b.id);
  const myReviews = mockReviews.filter(r => driverBookingIds.includes(r.bookingId) && r.reviewerId !== driver.id);

  return (
    <div className="container mx-auto">
      {complaintModalBookingId && <ComplaintModal bookingId={complaintModalBookingId} driver={driver} onClose={() => setComplaintModalBookingId(null)} onComplaintSubmitted={handleComplaintSubmitted} />}
      {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}

      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Driver Dashboard</h1>
        <div className="flex items-center space-x-3 self-end sm:self-center">
            <span className={`font-medium ${isAvailable ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>
                {isAvailable ? 'Available for Jobs' : 'Unavailable'}
            </span>
            <label htmlFor="availability-toggle" className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" id="availability-toggle" className="sr-only peer" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-accent-500"></div>
            </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Earnings" value={`₹${totalEarnings.toLocaleString('en-IN')}`} icon={<IndianRupee size={28} />} />
        <StatCard title="Your Rating" value={`${driver.rating.toFixed(1)} / 5.0`} icon={<Star size={28} />} />
        <StatCard title="Completed Trips" value={driverBookings.filter(b => b.status === BookingStatus.COMPLETED).length.toString()} icon={<CheckCircle size={28} />} />
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
         <nav className="-mb-px flex space-x-8">
            <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'border-accent-500 text-accent-600 dark:text-accent-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} py-4 px-1 border-b-2 font-medium text-sm`}>
                Job Board
            </button>
            <button onClick={() => setActiveTab('reviews')} className={`${activeTab === 'reviews' ? 'border-accent-500 text-accent-600 dark:text-accent-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'} py-4 px-1 border-b-2 font-medium text-sm`}>
                My Reviews
            </button>
         </nav>
      </div>

      {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">New Job Requests</h2>
                <div className="space-y-4">
                    {pendingJobs.length > 0 ? (
                        pendingJobs.map(job => <JobRequestCard key={job.id} booking={job} onAccept={(id) => handleBookingResponse(id, BookingStatus.CONFIRMED)} onDecline={(id) => handleBookingResponse(id, BookingStatus.CANCELLED)} />)
                    ) : (
                        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-500 dark:text-slate-400 text-lg">No new job requests.</p>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Trip History</h2>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm space-y-1 p-4 border border-slate-200 dark:border-slate-700">
                    {driverBookings.filter(b => b.status !== BookingStatus.PENDING).length > 0 ? driverBookings.filter(b => b.status !== BookingStatus.PENDING).map(booking => {
                        return (
                            <div key={booking.id} onClick={() => setSelectedBooking(booking)} className="w-full text-left p-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-md transition-colors cursor-pointer">
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Booking #{booking.id}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{booking.startDate} - {booking.endDate}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${booking.status === BookingStatus.COMPLETED ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                                        {booking.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleReportIssue(booking.id); }} className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 font-medium flex items-center justify-center gap-1 px-2 py-1">
                                            <AlertTriangle size={12} /> Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p className="text-center py-8 text-slate-500 dark:text-slate-400">No past trips found.</p>}
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
                                              <p className="text-xs text-slate-500 dark:text-slate-400">Booking #{review.bookingId} • {review.createdAt}</p>
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
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No reviews yet. Complete more trips to get feedback!</p>
                    </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default DriverPortal;
