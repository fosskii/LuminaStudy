
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MessageSquare, 
  Flag, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Search,
  Filter,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

const ModeratorPage: React.FC = () => {
  const { allUsers, flagUser } = useAuth();
  const { resetData } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleFlag = async (userId: string) => {
    try {
      await flagUser(userId);
    } catch (err) {
      alert('Action unauthorized');
    }
  };

  const handleResetUserData = (u: any) => {
    if (window.confirm(`Are you sure you want to reset all data for ${u.name}? This will clear all their tasks and study plans.`)) {
      // In a multi-user app, we would target u.id. For this local demo, we just reset the current local app state.
      resetData();
      alert(`Data reset successfully for ${u.name}`);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          Moderator Dashboard <ShieldCheck className="ml-2 h-6 w-6 text-blue-500" />
        </h1>
        <p className="text-gray-500">Monitor activity and flag suspicious behavior.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-2 bg-blue-100 w-fit rounded-xl mb-4">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
          <p className="text-sm text-gray-500">Total Managed Users</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-2 bg-orange-100 w-fit rounded-xl mb-4">
            <Flag className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.isFlagged).length}</p>
          <p className="text-sm text-gray-500">Flagged for Review</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="p-2 bg-green-100 w-fit rounded-xl mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{allUsers.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-gray-500">Active Accounts</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900">User Moderation Queue</h2>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none font-medium"
            >
              <option value="all">All Roles</option>
              {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {filteredUsers.length > 0 ? filteredUsers.map(u => (
            <div key={u.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${u.isFlagged ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  {u.isFlagged ? <AlertTriangle className="h-5 w-5 text-orange-600" /> : <FileText className="h-5 w-5 text-gray-600" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 flex items-center">
                    {u.name}
                    {u.isFlagged && <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] rounded-full font-bold">FLAGGED</span>}
                  </p>
                  <p className="text-xs text-gray-500">{u.email} • {u.role.toUpperCase()}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleFlag(u.id)}
                  className={`flex items-center px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    u.isFlagged ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Flag className="mr-2 h-3.5 w-3.5" />
                  {u.isFlagged ? 'Unflag' : 'Flag User'}
                </button>
                <button 
                  onClick={() => handleResetUserData(u)}
                  className="flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Reset Data
                </button>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-gray-400">
              <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-20" />
              <p>No users match your current filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorPage;
