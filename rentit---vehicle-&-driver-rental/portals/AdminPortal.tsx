
import React, { useState, useReducer } from 'react';
import { Admin, User, Driver, Vehicle, Booking, BookingStatus, Complaint, ComplaintStatus, VerificationStatus, Role } from '../types';
import { mockUsers, mockDrivers, mockOwners, mockVehicles, mockBookings, mockComplaints, mockReviews } from '../data/mockData';
import { Users, HardHat, Car, IndianRupee, CheckCircle, XCircle, AlertTriangle, BookOpen, MessageSquare, Trash2, Star, FileText, ShieldCheck, Clock, ExternalLink, Search } from 'lucide-react';
import BookingDetailsModal from '../components/BookingDetailsModal';

interface AdminPortalProps {
  admin: Admin;
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

const AdminPortal: React.FC<AdminPortalProps> = ({ admin }) => {
  const [activeTab, setActiveTab] = useState('verifications');
  const [verificationSubTab, setVerificationSubTab] = useState<'vehicles' | 'drivers'>('vehicles');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [_, forceUpdate] = useReducer(x => x + 1, 0);

  const totalRevenue = mockBookings.filter(b => b.status === BookingStatus.COMPLETED).reduce((sum, b) => sum + b.totalCostInr, 0);

  const handleComplaintStatusChange = (complaintId: number, newStatus: ComplaintStatus) => {
    const complaint = mockComplaints.find(c => c.id === complaintId);
    if (complaint) {
        complaint.status = newStatus;
        forceUpdate();
    }
  };

  const handleDeleteReview = (reviewId: number) => {
      if(window.confirm('Are you sure you want to delete this review?')) {
          const index = mockReviews.findIndex(r => r.id === reviewId);
          if (index > -1) {
              mockReviews.splice(index, 1);
              forceUpdate();
          }
      }
  }
  
  const handleVerification = (type: 'vehicle' | 'driver', id: number, status: VerificationStatus) => {
      if (type === 'vehicle') {
          const v = mockVehicles.find(v => v.id === id);
          if (v) v.verificationStatus = status;
      } else {
          const d = mockDrivers.find(d => d.id === id);
          if (d) {
              d.verificationStatus = status;
              d.isVerified = status === VerificationStatus.VERIFIED;
          }
      }
      forceUpdate();
  };

  const getReporterName = (complaint: Complaint) => {
    switch (complaint.reporterRole) {
        case Role.USER: return mockUsers.find(u => u.id === complaint.reporterId)?.name;
        case Role.DRIVER: return mockDrivers.find(d => d.id === complaint.reporterId)?.name;
        case Role.OWNER: return mockOwners.find(o => o.id === complaint.reporterId)?.name;
        default: return 'Unknown';
    }
  };

  const statusColorMap = {
      [ComplaintStatus.OPEN]: 'text-red-500',
      [ComplaintStatus.IN_PROGRESS]: 'text-yellow-500',
      [ComplaintStatus.RESOLVED]: 'text-green-500',
  }

  // Filter lists for Verifications
  // Show Pending first, then others if needed, but for this tab we focus on Pending/Rejected mostly, or all with a filter.
  // For this view let's show All but sort Pending to top.
  const sortVerification = (a: {verificationStatus: VerificationStatus}, b: {verificationStatus: VerificationStatus}) => {
      if (a.verificationStatus === VerificationStatus.PENDING && b.verificationStatus !== VerificationStatus.PENDING) return -1;
      if (a.verificationStatus !== VerificationStatus.PENDING && b.verificationStatus === VerificationStatus.PENDING) return 1;
      return 0;
  };

  const sortedVehicles = [...mockVehicles].sort(sortVerification);
  const sortedDrivers = [...mockDrivers].sort(sortVerification);

  const pendingCount = mockVehicles.filter(v => v.verificationStatus === VerificationStatus.PENDING).length + mockDrivers.filter(d => d.verificationStatus === VerificationStatus.PENDING).length;

  return (
    <div className="container mx-auto">
      {selectedBooking && <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />}
      <h1 className="text-4xl font-extrabold mb-6 text-slate-900 dark:text-white">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} icon={<IndianRupee size={28} />} />
        <StatCard title="Pending Verifications" value={pendingCount.toString()} icon={<ShieldCheck size={28} />} />
        <StatCard title="Active Complaints" value={mockComplaints.filter(c => c.status !== ComplaintStatus.RESOLVED).length.toString()} icon={<AlertTriangle size={28} />} />
        <StatCard title="Platform Users" value={(mockUsers.length + mockDrivers.length + mockOwners.length).toString()} icon={<Users size={28} />} />
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-200 dark:border-slate-700">
        <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                 <button onClick={() => setActiveTab('verifications')} className={`${activeTab === 'verifications' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    Verifications <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-1">{pendingCount}</span>
                </button>
                 <button onClick={() => setActiveTab('complaints')} className={`${activeTab === 'complaints' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    Manage Complaints
                </button>
                 <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    All Bookings
                </button>
                <button onClick={() => setActiveTab('drivers')} className={`${activeTab === 'drivers' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    Manage Drivers
                </button>
                <button onClick={() => setActiveTab('reviews')} className={`${activeTab === 'reviews' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                    User Reviews
                </button>
            </nav>
        </div>
        <div className="p-0">
            <div className="overflow-x-auto">
                
                {activeTab === 'verifications' && (
                    <div>
                         <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30">
                             <button onClick={() => setVerificationSubTab('vehicles')} className={`flex-1 py-3 text-sm font-medium ${verificationSubTab === 'vehicles' ? 'text-primary-600 bg-white dark:bg-slate-800 border-t-2 border-t-primary-500' : 'text-slate-500'}`}>
                                 Vehicles ({mockVehicles.filter(v => v.verificationStatus === VerificationStatus.PENDING).length} Pending)
                             </button>
                             <button onClick={() => setVerificationSubTab('drivers')} className={`flex-1 py-3 text-sm font-medium ${verificationSubTab === 'drivers' ? 'text-primary-600 bg-white dark:bg-slate-800 border-t-2 border-t-primary-500' : 'text-slate-500'}`}>
                                 Drivers ({mockDrivers.filter(d => d.verificationStatus === VerificationStatus.PENDING).length} Pending)
                             </button>
                         </div>
                         
                         {verificationSubTab === 'vehicles' && (
                             <table className="min-w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Vehicle</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Owner</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {sortedVehicles.map(vehicle => {
                                        const owner = mockOwners.find(o => o.id === vehicle.ownerId);
                                        return (
                                            <tr key={vehicle.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <img className="h-10 w-10 rounded-md object-cover" src={vehicle.imageUrl} alt="" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{vehicle.make} {vehicle.model}</div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">{vehicle.registration}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-900 dark:text-white">{owner?.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{owner?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col gap-1 text-xs">
                                                        <span className="flex items-center gap-1 text-blue-500 hover:underline cursor-pointer"><FileText size={12}/> RC: {vehicle.rcDocumentUrl || 'N/A'}</span>
                                                        <span className="flex items-center gap-1 text-blue-500 hover:underline cursor-pointer"><FileText size={12}/> Ins: {vehicle.insuranceDocumentUrl || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${vehicle.verificationStatus === VerificationStatus.VERIFIED ? 'bg-green-100 text-green-800' : 
                                                          vehicle.verificationStatus === VerificationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                                                          'bg-red-100 text-red-800'}`}>
                                                        {vehicle.verificationStatus}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {vehicle.verificationStatus === VerificationStatus.PENDING && (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleVerification('vehicle', vehicle.id, VerificationStatus.VERIFIED)} className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1 rounded"><CheckCircle size={18} /></button>
                                                            <button onClick={() => handleVerification('vehicle', vehicle.id, VerificationStatus.REJECTED)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded"><XCircle size={18} /></button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                             </table>
                         )}

                         {verificationSubTab === 'drivers' && (
                             <table className="min-w-full">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Driver</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Documents</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {sortedDrivers.map(driver => (
                                        <tr key={driver.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-full object-cover" src={driver.profilePictureUrl} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{driver.name}</div>
                                                        <div className="text-sm text-slate-500 dark:text-slate-400">Exp: {driver.experience} yrs</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-slate-900 dark:text-white">{driver.email}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">{driver.mobile}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <span className="flex items-center gap-1 text-blue-500 hover:underline cursor-pointer"><FileText size={12}/> Lic: {driver.licenseUrl}</span>
                                                    <span className="flex items-center gap-1 text-blue-500 hover:underline cursor-pointer"><FileText size={12}/> Aadhar: {driver.aadharUrl}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${driver.verificationStatus === VerificationStatus.VERIFIED ? 'bg-green-100 text-green-800' : 
                                                      driver.verificationStatus === VerificationStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                                                      'bg-red-100 text-red-800'}`}>
                                                    {driver.verificationStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {driver.verificationStatus === VerificationStatus.PENDING && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleVerification('driver', driver.id, VerificationStatus.VERIFIED)} className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1 rounded"><CheckCircle size={18} /></button>
                                                        <button onClick={() => handleVerification('driver', driver.id, VerificationStatus.REJECTED)} className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded"><XCircle size={18} /></button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                         )}
                    </div>
                )}

                {activeTab === 'complaints' && (
                    <table className="min-w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Complaint ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Reporter</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Booking ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {mockComplaints.map((complaint) => (
                                <tr key={complaint.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">#{complaint.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-900 dark:text-white">{complaint.subject}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-xs">{complaint.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900 dark:text-white">{getReporterName(complaint)}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400">{complaint.reporterRole}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select 
                                            value={complaint.status} 
                                            onChange={(e) => handleComplaintStatusChange(complaint.id, e.target.value as ComplaintStatus)}
                                            className={`text-sm font-semibold rounded-md border-slate-200 dark:border-slate-700 bg-transparent ${statusColorMap[complaint.status]}`}
                                        >
                                            <option value={ComplaintStatus.OPEN}>Open</option>
                                            <option value={ComplaintStatus.IN_PROGRESS}>In Progress</option>
                                            <option value={ComplaintStatus.RESOLVED}>Resolved</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline cursor-pointer" onClick={() => {
                                        const booking = mockBookings.find(b => b.id === complaint.bookingId);
                                        if(booking) setSelectedBooking(booking);
                                    }}>
                                        #{complaint.bookingId}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'bookings' && (
                    <table className="min-w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Booking</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {mockBookings.map((booking) => {
                                const user = mockUsers.find(u => u.id === booking.userId);
                                const vehicle = booking.vehicleId ? mockVehicles.find(v => v.id === booking.vehicleId) : null;
                                const driver = booking.driverId ? mockDrivers.find(d => d.id === booking.driverId) : null;
                                return (
                                    <tr key={booking.id} onClick={() => setSelectedBooking(booking)} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">#{booking.id}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400">{vehicle ? `${vehicle.make} ${vehicle.model}` : (driver ? `Driver: ${driver.name}` : 'N/A')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{user?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                            {booking.startDate} - {booking.endDate}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">₹{booking.totalCostInr}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${booking.status === BookingStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                                                  booking.status === BookingStatus.CANCELLED ? 'bg-red-100 text-red-800' : 
                                                  'bg-blue-100 text-blue-800'}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                
                {activeTab === 'drivers' && (
                     <table className="min-w-full">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Driver</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Trips</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Availability</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                             {mockDrivers.map(driver => (
                                 <tr key={driver.id}>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-8 w-8 rounded-full object-cover mr-3" src={driver.profilePictureUrl} alt="" />
                                            <div>
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{driver.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{driver.email}</div>
                                            </div>
                                        </div>
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                         <Star size={14} className="fill-yellow-400 text-yellow-400"/> {driver.rating}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                         {mockBookings.filter(b => b.driverId === driver.id && b.status === BookingStatus.COMPLETED).length}
                                     </td>
                                     <td className="px-6 py-4 whitespace-nowrap">
                                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${driver.availability ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                             {driver.availability ? 'Online' : 'Offline'}
                                         </span>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                )}

                {activeTab === 'reviews' && (
                    <div className="p-6 space-y-4">
                        {mockReviews.length > 0 ? mockReviews.map(review => {
                            const user = mockUsers.find(u => u.id === review.reviewerId);
                            const booking = mockBookings.find(b => b.id === review.bookingId);
                            return (
                                <div key={review.id} className="flex items-start justify-between bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="flex gap-3">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full h-fit">
                                            <MessageSquare size={20} className="text-blue-600 dark:text-blue-400"/>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-slate-900 dark:text-white">{user?.name}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">via Booking #{review.bookingId}</span>
                                                <div className="flex items-center ml-2 bg-yellow-100 dark:bg-yellow-900/30 px-1.5 rounded text-xs">
                                                    <Star size={10} className="fill-yellow-500 text-yellow-500 mr-1"/> {review.rating}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">"{review.comment}"</p>
                                            <p className="text-xs text-slate-400 mt-1">{review.createdAt}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteReview(review.id)} className="text-slate-400 hover:text-red-500 p-2 transition-colors" title="Delete Review">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            );
                        }) : (
                            <div className="text-center py-12 text-slate-500 dark:text-slate-400">No reviews found.</div>
                        )}
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
