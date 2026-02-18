import React from 'react';
import { Role, BaseUser } from '../types';
import { Car, LogOut } from 'lucide-react';

interface HeaderProps {
  user: BaseUser;
  role: Role;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, role, onLogout }) => {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Car className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">RentIt</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold text-slate-800 dark:text-white">{user.name}</p>
              <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{role} Portal</p>
            </div>
            <img className="h-10 w-10 rounded-full object-cover" src={user.profilePictureUrl} alt="User" />
            <button
              onClick={onLogout}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-200"
              aria-label="Logout"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;