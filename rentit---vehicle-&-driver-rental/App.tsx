
import React, { useState, useCallback } from 'react';
import { Role, User, Driver, VehicleOwner, Admin } from './types';
import { mockUsers, mockDrivers, mockOwners, mockAdmins } from './data/mockData';
import LoginScreen from './components/LoginScreen';
import UserPortal from './portals/UserPortal';
import DriverPortal from './portals/DriverPortal';
import OwnerPortal from './portals/OwnerPortal';
import AdminPortal from './portals/AdminPortal';
import Header from './components/Header';

type CurrentUser = 
  | { role: Role.USER; data: User }
  | { role: Role.DRIVER; data: Driver }
  | { role: Role.OWNER; data: VehicleOwner }
  | { role: Role.ADMIN; data: Admin };

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const handleLogin = useCallback((role: Role, email: string) => {
    const normalizedEmail = email.toLowerCase();
    switch (role) {
      case Role.USER:
        const user = mockUsers.find(u => u.email.toLowerCase() === normalizedEmail);
        if (user) setCurrentUser({ role, data: user });
        break;
      case Role.DRIVER:
        const driver = mockDrivers.find(d => d.email.toLowerCase() === normalizedEmail);
        if (driver) setCurrentUser({ role, data: driver });
        break;
      case Role.OWNER:
        const owner = mockOwners.find(o => o.email.toLowerCase() === normalizedEmail);
        if (owner) setCurrentUser({ role, data: owner });
        break;
      case Role.ADMIN:
        const admin = mockAdmins.find(a => a.email.toLowerCase() === normalizedEmail);
        if (admin) setCurrentUser({ role, data: admin });
        break;
      default:
        break;
    }
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const renderPortal = () => {
    if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    const portalContent = (() => {
      switch (currentUser.role) {
        case Role.USER:
          return <UserPortal user={currentUser.data} />;
        case Role.DRIVER:
          return <DriverPortal driver={currentUser.data} />;
        case Role.OWNER:
          return <OwnerPortal owner={currentUser.data} />;
        case Role.ADMIN:
          return <AdminPortal admin={currentUser.data} />;
        default:
          return <div className="text-red-500">Error: Invalid user role.</div>;
      }
    })();

    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
        <Header user={currentUser.data} role={currentUser.role} onLogout={handleLogout} />
        <main className="flex-grow p-4 md:p-8">
          {portalContent}
        </main>
      </div>
    );
  };

  return <div className="antialiased text-slate-800 dark:text-slate-200">{renderPortal()}</div>;
};

export default App;
