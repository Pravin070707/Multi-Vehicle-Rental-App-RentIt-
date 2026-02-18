
import React, { useState } from 'react';
import { Driver, VerificationStatus } from '../types';
import { X, UserPlus, FileText, User, Phone, Mail, Shield } from 'lucide-react';

interface RegisterDriverModalProps {
  onClose: () => void;
  onRegister: (driver: Partial<Driver>) => void;
}

const RegisterDriverModal: React.FC<RegisterDriverModalProps> = ({ onClose, onRegister }) => {
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      mobile: '',
      licenseUrl: '',
      aadharUrl: '',
      experience: 1,
      location: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDriver: Partial<Driver> = {
        ...formData,
        rating: 0,
        isVerified: false,
        verificationStatus: VerificationStatus.PENDING,
        availability: true,
        profilePictureUrl: `https://ui-avatars.com/api/?name=${formData.name}&background=random`,
        idUrl: '' // Placeholder
    };
    onRegister(newDriver);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg relative my-8">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 z-10">
                <X size={24} />
            </button>
            <div className="p-8">
                <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white flex items-center gap-2">
                    <UserPlus className="text-accent-500" /> Register New Driver
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">
                    Onboard a new driver. Details will be sent to Admin for verification.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase">Personal Info</h3>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full pl-9 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Full Name" />
                        </div>
                         <div className="relative">
                            <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-9 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Email Address" />
                        </div>
                         <div className="relative">
                            <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full pl-9 px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Mobile Number" />
                        </div>
                         <div>
                             <input type="number" name="experience" min="0" value={formData.experience} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Years of Experience" />
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase">Verification Docs</h3>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Driving License (URL/Number)</label>
                            <input type="text" name="licenseUrl" value={formData.licenseUrl} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Enter License No. or Doc Link" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Aadhar Card (URL/Number)</label>
                            <input type="text" name="aadharUrl" value={formData.aadharUrl} onChange={handleChange} required className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md" placeholder="Enter Aadhar No. or Doc Link" />
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-xs text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <Shield className="shrink-0" size={16}/>
                        <p>This driver account will remain <strong>Pending</strong> until an Administrator verifies the submitted documents.</p>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 font-semibold transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 font-semibold shadow-md transition-all">Submit Request</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default RegisterDriverModal;
