
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, VehicleType, VerificationStatus } from '../types';
import { X, Info, Car, Hash, MapPin, IndianRupee, FileText, ShieldAlert } from 'lucide-react';

interface ManageVehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (vehicle: Vehicle) => void;
}

const ManageVehicleModal: React.FC<ManageVehicleModalProps> = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState<Vehicle>(vehicle);

  useEffect(() => {
    setFormData(vehicle);
  }, [vehicle]);

  const isNew = vehicle.id === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // New vehicles or edited registration details should reset verification to PENDING in a real app.
    // For this demo, we'll let the parent handler decide status, but we can alert.
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl relative my-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
                <X size={24} />
            </button>
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{isNew ? 'Add New Vehicle' : `Manage ${vehicle.make} ${vehicle.model}`}</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    {isNew ? 'Add vehicle details. Admin verification required before listing.' : "Update your vehicle's details and status."}
                </p>
                
                {formData.verificationStatus === VerificationStatus.PENDING && !isNew && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700 mb-6 flex items-start gap-3">
                        <ShieldAlert className="text-yellow-600 dark:text-yellow-400 shrink-0" size={20} />
                        <div>
                            <h4 className="font-bold text-yellow-800 dark:text-yellow-300">Verification Pending</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">This vehicle is currently under review by admins and is not visible to users.</p>
                        </div>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Basic Details Section */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Car size={20} className="text-primary-500" /> Vehicle Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Make</label>
                                <input type="text" name="make" value={formData.make} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. Toyota" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
                                <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. Innova" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Year</label>
                                <input type="number" name="year" value={formData.year} onChange={handleNumericChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. 2023" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md">
                                    {Object.values(VehicleType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Seating Capacity</label>
                                <input type="number" name="seatingCapacity" value={formData.seatingCapacity} onChange={handleNumericChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. 5" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Registration Number</label>
                                <input type="text" name="registration" value={formData.registration} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. TN-01-AB-1234" />
                            </div>
                        </div>
                    </div>

                     {/* Documents Section (Simulated) */}
                    <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <FileText size={20} className="text-primary-500" /> Verification Documents
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RC Document (URL)</label>
                                <input type="text" name="rcDocumentUrl" value={formData.rcDocumentUrl || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Link to RC Doc" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance Document (URL)</label>
                                <input type="text" name="insuranceDocumentUrl" value={formData.insuranceDocumentUrl || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Link to Insurance Doc" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Insurance Expiry</label>
                                <input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                            </div>
                        </div>
                    </div>

                    {/* Operational Details Section */}
                    <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Info size={20} className="text-primary-500" /> Rental Info
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price Per Day (INR)</label>
                                <div className="relative">
                                    <IndianRupee size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input type="number" name="pricePerDayInr" value={formData.pricePerDayInr} onChange={handleNumericChange} required className="w-full pl-9 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. 2000" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Location</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full pl-9 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="e.g. Chennai" />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
                                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="https://..." />
                            </div>
                        </div>
                    </div>
                    
                    {/* Status Section */}
                     <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <Hash size={20} className="text-primary-500" /> Status
                        </h3>
                        <div>
                            <select 
                                name="status"
                                value={formData.status} 
                                onChange={handleChange} 
                                className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md"
                            >
                                <option value={VehicleStatus.AVAILABLE}>Available</option>
                                <option value={VehicleStatus.IN_SERVICE}>In Service</option>
                                <option value={VehicleStatus.BOOKED} disabled>Booked (Automatic)</option>
                            </select>
                        </div>

                        {formData.status === VehicleStatus.IN_SERVICE && (
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Service Schedule</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
                                        <input type="date" name="serviceStartDate" value={formData.serviceStartDate || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Date</label>
                                        <input type="date" name="serviceEndDate" value={formData.serviceEndDate || ''} onChange={handleChange} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service Notes</label>
                                    <textarea name="serviceDetails" value={formData.serviceDetails || ''} onChange={handleChange} rows={2} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Describe the issue or maintenance required..." />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 font-semibold shadow-md transition-all transform hover:scale-105">{isNew ? 'Submit for Verification' : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ManageVehicleModal;
