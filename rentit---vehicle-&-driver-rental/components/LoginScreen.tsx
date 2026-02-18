
import React, { useState } from 'react';
import { Role, VerificationStatus, Driver, VehicleOwner, Vehicle, VehicleStatus, VehicleType } from '../types';
import { User, Loader2, Eye, EyeOff, Car, ShieldCheck, Briefcase, ArrowLeft, FileText } from 'lucide-react';
import { mockUsers, mockDrivers, mockOwners, mockAdmins, mockVehicles } from '../data/mockData';

interface LoginScreenProps {
  onLogin: (role: Role, email: string) => void;
}

type ViewState = 'login' | 'register-driver' | 'register-owner';
type LoginStep = 'email' | 'password' | 'otp';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [view, setView] = useState<ViewState>('login');
  
  // Login State
  const [loginStep, setLoginStep] = useState<LoginStep>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Registration State
  const [regFormData, setRegFormData] = useState<any>({});

  // --- Login Logic ---
  const getRoleFromEmail = (inputEmail: string): Role | null => {
    const normalized = inputEmail.toLowerCase();
    if (mockUsers.some(u => u.email.toLowerCase() === normalized)) return Role.USER;
    if (mockDrivers.some(d => d.email.toLowerCase() === normalized)) return Role.DRIVER;
    if (mockOwners.some(o => o.email.toLowerCase() === normalized)) return Role.OWNER;
    if (mockAdmins.some(a => a.email.toLowerCase() === normalized)) return Role.ADMIN;
    return null;
  };

  const handleLoginNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (loginStep === 'email') {
        const role = getRoleFromEmail(email);
        if (role) {
          setLoginStep('password');
        } else {
          setError("Couldn't find your Account");
        }
      } else if (loginStep === 'password') {
        if (password === '123456') {
            setLoginStep('otp');
        } else {
            setError('Wrong password. Try again.');
        }
      } else if (loginStep === 'otp') {
          if (otp.length >= 4) {
             const role = getRoleFromEmail(email);
             if (role) onLogin(role, email);
          } else {
              setError('Invalid OTP code.');
          }
      }
    }, 800);
  };

  const handleBack = () => {
      setError(null);
      setLoginStep('email');
      setPassword('');
      setOtp('');
  }

  // --- Registration Logic ---
  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setRegFormData({ ...regFormData, [e.target.name]: e.target.value });
  }

  const submitDriverRegistration = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
          const newDriver: Driver = {
              id: Math.floor(Math.random() * 10000),
              name: regFormData.name,
              email: regFormData.email,
              mobile: regFormData.mobile,
              experience: Number(regFormData.experience),
              rating: 0,
              licenseUrl: regFormData.licenseUrl || 'Pending Doc',
              aadharUrl: regFormData.aadharUrl || 'Pending Doc',
              idUrl: '',
              isVerified: false,
              verificationStatus: VerificationStatus.PENDING,
              availability: false,
              profilePictureUrl: `https://ui-avatars.com/api/?name=${regFormData.name}&background=random`
          };
          mockDrivers.push(newDriver);
          setIsLoading(false);
          alert("Application Submitted! Please wait for Admin verification.");
          setView('login');
          setRegFormData({});
      }, 1500);
  }

  const submitOwnerRegistration = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
          // 1. Create Owner
          const newOwner: VehicleOwner = {
              id: Math.floor(Math.random() * 10000),
              name: regFormData.name,
              email: regFormData.email,
              mobile: regFormData.mobile,
              profilePictureUrl: `https://ui-avatars.com/api/?name=${regFormData.name}&background=random`
          };
          mockOwners.push(newOwner);

          // 2. Create Vehicle (Linked to Owner)
          const newVehicle: Vehicle = {
              id: Math.floor(Math.random() * 10000),
              ownerId: newOwner.id,
              make: regFormData.vehicleMake,
              model: regFormData.vehicleModel,
              year: Number(regFormData.vehicleYear) || new Date().getFullYear(),
              type: regFormData.vehicleType || VehicleType.CAR,
              seatingCapacity: Number(regFormData.vehicleSeats) || 4,
              imageUrl: 'https://images.unsplash.com/photo-1568605117029-5f81852bd3e1?auto=format&fit=crop&w=800&q=80', // Placeholder
              pricePerDayInr: 0, // Owner sets later
              location: regFormData.city || 'Unknown',
              status: VehicleStatus.AVAILABLE,
              verificationStatus: VerificationStatus.PENDING,
              registration: regFormData.vehicleReg,
              rcDocumentUrl: regFormData.rcUrl,
              insuranceDocumentUrl: regFormData.insuranceUrl,
              insuranceExpiry: '2025-12-31' 
          };
          mockVehicles.push(newVehicle);

          setIsLoading(false);
          alert("Registration Successful! Your account and vehicle are under verification.");
          setView('login');
          setRegFormData({});
      }, 1500);
  }

  // --- Renderers ---

  if (view === 'register-driver') {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
                  <button onClick={() => setView('login')} className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
                      <ArrowLeft size={20} className="mr-2"/> Back to Login
                  </button>
                  
                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-full">
                          <Car size={32} className="text-accent-600 dark:text-accent-400" />
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join as Driver</h2>
                          <p className="text-sm text-slate-500">Earn money by driving with RentIt</p>
                      </div>
                  </div>

                  <form onSubmit={submitDriverRegistration} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <input type="text" name="name" placeholder="Full Name" required onChange={handleRegChange} className="col-span-2 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                          <input type="email" name="email" placeholder="Email Address" required onChange={handleRegChange} className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                          <input type="tel" name="mobile" placeholder="Mobile Number" required onChange={handleRegChange} className="p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                          <input type="number" name="experience" placeholder="Experience (Years)" required onChange={handleRegChange} className="col-span-2 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                      </div>
                      
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                          <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">Documents (URLs/Numbers)</h3>
                          <div className="space-y-3">
                             <div className="relative">
                                <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input type="text" name="licenseUrl" placeholder="Driving License Number/Link" required onChange={handleRegChange} className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                             </div>
                             <div className="relative">
                                <FileText size={18} className="absolute left-3 top-3 text-slate-400" />
                                <input type="text" name="aadharUrl" placeholder="Aadhar Card Number/Link" required onChange={handleRegChange} className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg outline-none focus:ring-2 focus:ring-accent-500" />
                             </div>
                          </div>
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all mt-4 flex justify-center items-center gap-2">
                          {isLoading ? <Loader2 className="animate-spin" /> : 'Submit Application'}
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  if (view === 'register-owner') {
      return (
          <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                  <button onClick={() => setView('login')} className="flex items-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white mb-6 transition-colors">
                      <ArrowLeft size={20} className="mr-2"/> Back to Login
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                          <Briefcase size={32} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Become a Partner</h2>
                          <p className="text-sm text-slate-500">List your vehicle and earn with RentIt</p>
                      </div>
                  </div>

                  <form onSubmit={submitOwnerRegistration} className="space-y-6">
                      {/* Personal Info */}
                      <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Owner Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input type="text" name="name" placeholder="Owner Name" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="email" name="email" placeholder="Email Address" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="tel" name="mobile" placeholder="Mobile Number" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="text" name="aadharUrl" placeholder="Aadhar Number" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                          </div>
                      </div>

                      {/* Vehicle Info */}
                      <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Vehicle Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <input type="text" name="vehicleMake" placeholder="Make (e.g. Toyota)" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="text" name="vehicleModel" placeholder="Model (e.g. Innova)" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="text" name="vehicleReg" placeholder="Registration No." required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <select name="vehicleType" onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg">
                                  <option value={VehicleType.CAR}>Car</option>
                                  <option value={VehicleType.SUV}>SUV</option>
                                  <option value={VehicleType.BIKE}>Bike</option>
                                  <option value={VehicleType.TEMPO_TRAVELLER}>Tempo Traveller</option>
                                  <option value={VehicleType.TRUCK}>Truck</option>
                              </select>
                              <input type="text" name="city" placeholder="City / Location" required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                          </div>
                      </div>

                      {/* Docs */}
                      <div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2 mb-3">Documents</h3>
                          <div className="space-y-3">
                              <input type="text" name="rcUrl" placeholder="RC Document Link/No." required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="text" name="insuranceUrl" placeholder="Insurance Document Link/No." required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                              <input type="text" name="taxUrl" placeholder="Tax Document Link/No." required onChange={handleRegChange} className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
                          </div>
                      </div>

                      <button type="submit" disabled={isLoading} className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all mt-4 flex justify-center items-center gap-2">
                          {isLoading ? <Loader2 className="animate-spin" /> : 'Register & Submit Docs'}
                      </button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-md w-full max-w-[450px] border border-slate-200 dark:border-slate-700 flex flex-col items-center">
        
        {/* Logo Header */}
        <div className="mb-6 flex flex-col items-center">
           <div className="flex items-center gap-2 mb-4 text-primary-600 dark:text-primary-400">
               <Car size={32} strokeWidth={2.5} />
           </div>
           <h1 className="text-2xl font-medium text-slate-900 dark:text-white">
               {loginStep === 'email' ? 'Sign in' : `Welcome`}
           </h1>
           {loginStep === 'email' ? (
             <p className="text-base text-slate-600 dark:text-slate-400 mt-2">to continue to RentIt</p>
           ) : (
             <button onClick={handleBack} className="mt-2 flex items-center gap-1 border border-slate-200 dark:border-slate-600 rounded-full px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                <User size={14} /> {email}
             </button>
           )}
        </div>

        <form onSubmit={handleLoginNext} className="w-full space-y-6">
            {loginStep === 'email' && (
                <div className="relative">
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`peer w-full h-14 px-3 pt-4 rounded border-2 outline-none bg-transparent transition-colors text-slate-900 dark:text-white ${error ? 'border-red-500 focus:border-red-600' : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 dark:focus:border-blue-500'}`}
                        placeholder=" "
                        required
                    />
                    <label 
                        htmlFor="email" 
                        className={`absolute left-3 top-1 text-xs ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'} font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-500 pointer-events-none bg-white dark:bg-slate-800 px-1`}
                    >
                        Email or phone
                    </label>
                     {error && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
                            <div className="mt-0.5">!</div>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            {loginStep === 'password' && (
                <div className="relative">
                    <div className="relative">
                         <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`peer w-full h-14 px-3 pt-4 rounded border-2 outline-none bg-transparent transition-colors text-slate-900 dark:text-white ${error ? 'border-red-500 focus:border-red-600' : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 dark:focus:border-blue-500'}`}
                            placeholder=" "
                            autoFocus
                            required
                        />
                        <label 
                            htmlFor="password" 
                            className={`absolute left-3 top-1 text-xs ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'} font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-500 pointer-events-none bg-white dark:bg-slate-800 px-1`}
                        >
                            Enter your password
                        </label>
                    </div>
                    {error && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
                            <div className="mt-0.5">!</div>
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="mt-4 flex items-center">
                         <input 
                            type="checkbox" 
                            id="showPass" 
                            checked={showPassword} 
                            onChange={() => setShowPassword(!showPassword)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                         />
                         <label htmlFor="showPass" className="ml-2 text-sm text-slate-700 dark:text-slate-300">Show password</label>
                    </div>
                </div>
            )}

             {loginStep === 'otp' && (
                <div className="relative">
                    <div className="text-center mb-6">
                         <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
                            <ShieldCheck size={24} />
                         </div>
                         <h3 className="text-lg font-medium text-slate-900 dark:text-white">2-Step Verification</h3>
                         <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                             Enter the OTP sent to your phone ending in ••88
                         </p>
                    </div>

                    <div className="relative">
                         <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                            className={`peer w-full h-14 px-3 pt-4 rounded border-2 outline-none bg-transparent transition-colors text-slate-900 dark:text-white tracking-[0.5em] font-mono text-center text-xl ${error ? 'border-red-500 focus:border-red-600' : 'border-slate-300 dark:border-slate-600 focus:border-blue-600 dark:focus:border-blue-500'}`}
                            placeholder=" "
                            autoFocus
                            maxLength={6}
                            required
                        />
                        <label 
                            htmlFor="otp" 
                            className={`absolute left-3 top-1 text-xs ${error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'} font-medium transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-500 pointer-events-none bg-white dark:bg-slate-800 px-1 w-full text-left`}
                        >
                            Enter Code (e.g. 1234)
                        </label>
                    </div>
                     {error && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
                            <div className="mt-0.5">!</div>
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            )}

            <div className="flex items-center justify-between pt-6">
                {loginStep === 'email' ? (
                     <button type="button" className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 text-sm">
                         Create account
                     </button>
                ) : (
                     <button type="button" onClick={() => setLoginStep('email')} className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 text-sm">
                        Forgot password?
                    </button>
                )}
                
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isLoading && <Loader2 size={18} className="animate-spin"/>}
                    {loginStep === 'email' || loginStep === 'password' ? 'Next' : 'Verify'}
                </button>
            </div>
        </form>
      </div>

      {/* Registration Options */}
      {loginStep === 'email' && (
          <div className="mt-8 w-full max-w-[450px] space-y-3">
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">Or join our platform as</p>
              <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setView('register-driver')}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center transition-colors group"
                  >
                      <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                          <Car className="text-accent-600 dark:text-accent-400" size={24}/>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white text-sm">Join as Driver</span>
                      <span className="text-xs text-slate-500 mt-1">Submit License & Start</span>
                  </button>

                  <button 
                    onClick={() => setView('register-owner')}
                    className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center text-center transition-colors group"
                  >
                      <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mb-2 group-hover:scale-110 transition-transform">
                          <Briefcase className="text-primary-600 dark:text-primary-400" size={24}/>
                      </div>
                      <span className="font-bold text-slate-800 dark:text-white text-sm">Become a Partner</span>
                      <span className="text-xs text-slate-500 mt-1">List Vehicles & Earn</span>
                  </button>
              </div>
          </div>
      )}
        
        {/* Demo Hint Footer */}
      <div className="mt-8 text-center text-slate-400 text-xs max-w-md">
         <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-left space-y-1">
             <strong className="block mb-2">Demo Credentials (Pass: 123456)</strong>
             <div>User: person@gmail.com</div>
             <div className="grid grid-cols-2 gap-x-4">
                 <span>Drivers:</span>
                 <span className="col-span-2">ravi@gmail.com</span>
                 <span className="col-span-2">karthik@gmail.com</span>
                 <span className="col-span-2">ganesh@gmail.com</span>
                 <span className="col-span-2">saravanan@gmail.com</span>
             </div>
             <div className="mt-1">Owner: owner@rentit.com</div>
             <div>Admin: admin@rentit.com</div>
         </div>
      </div>
    </div>
  );
};

export default LoginScreen;
