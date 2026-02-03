
import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Sparkles, 
  UserCircle, 
  ShieldCheck, 
  Settings2,
  LogOut,
  Menu,
  X,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Layout: React.FC = () => {
  const { user, logout, isAdmin, isModerator } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Planner', href: '/planner', icon: CalendarDays },
    { name: 'AI Assistant', href: '/ai-assistant', icon: Sparkles },
    { name: 'Profile', href: '/profile', icon: UserCircle },
    ...(isModerator ? [{ name: 'Moderator', href: '/moderator', icon: Settings2 }] : []),
    ...(isAdmin ? [{ name: 'Admin', href: '/admin', icon: ShieldCheck }] : []),
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900 tracking-tight">LuminaStudy</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6 hidden md:flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">LuminaStudy</span>
          </div>

          <nav className="flex-1 px-4 space-y-1 py-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center p-3 mb-2 rounded-xl bg-gray-50">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                {/* Fix: Added PREMIUM specific styling to the role badge for visual consistency */}
                <p className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  user?.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                  user?.role === UserRole.MODERATOR ? 'bg-blue-100 text-blue-700' :
                  user?.role === UserRole.PREMIUM ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {user?.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 bg-gray-50 overflow-auto">
        <div className="max-w-7xl mx-auto w-full p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;