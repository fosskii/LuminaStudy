
import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  TrendingUp, 
  MoreVertical, 
  Search,
  CheckCircle,
  XCircle,
  BarChart3,
  UserPlus,
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { UserRole, User } from '../types';
import { useAuth } from '../context/AuthContext';

const AdminPage: React.FC = () => {
  const { allUsers, updateUserRole, toggleUserStatus } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = [
    { label: 'Total Users', value: allUsers.length, change: '+2', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Premium Subs', value: allUsers.filter(u => u.role === UserRole.PREMIUM).length, change: '+1', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-100' },
    { label: 'System Admins', value: allUsers.filter(u => u.role === UserRole.ADMIN).length, change: '0', icon: ShieldAlert, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Status', value: allUsers.filter(u => u.status === 'active').length, change: '100%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const handleRoleChange = async (userId: string, role: UserRole) => {
    if (!window.confirm(`Change user role to ${role}?`)) return;
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, role);
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'Disable' : 'Enable';
    if (!window.confirm(`${action} this user account?`)) return;
    setUpdatingId(userId);
    try {
      await toggleUserStatus(userId);
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
          <p className="text-gray-500">Full control over users, roles, and system security.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Manual User
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">Global User Database</h2>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Access Level</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className={`hover:bg-gray-50 transition-colors ${updatingId === u.id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm mr-4 shadow-sm">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 flex items-center">
                          {u.name}
                          {u.isFlagged && <ShieldAlert className="ml-2 h-3.5 w-3.5 text-amber-500" />}
                        </div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(u.id, u.status)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {u.status === 'active' ? <CheckCircle className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                      {u.status.toUpperCase()}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-2 text-gray-400" />
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-gray-100">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
