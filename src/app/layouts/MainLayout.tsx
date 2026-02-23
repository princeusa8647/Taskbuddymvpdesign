import { Outlet, Link, useLocation } from 'react-router';
import { Home, Briefcase, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MainLayout() {
  const location = useLocation();
  const { currentUser } = useApp();
  
  const isCustomer = currentUser?.role === 'customer';
  const baseRoute = isCustomer ? '/customer' : '/provider';

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Outlet />
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 max-w-md mx-auto">
        <div className="flex justify-around items-center">
          <Link
            to={baseRoute}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              location.pathname === baseRoute
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            <Home size={24} />
            <span className="text-xs">Home</span>
          </Link>
          
          <Link
            to={`${baseRoute}${isCustomer ? '/my-jobs' : ''}`}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              location.pathname.includes('job')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            <Briefcase size={24} />
            <span className="text-xs">Jobs</span>
          </Link>
          
          <Link
            to={`${baseRoute}/profile`}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              location.pathname.includes('profile')
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600'
            }`}
          >
            <User size={24} />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
