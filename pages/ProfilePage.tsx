
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  Crown, 
  Check, 
  Settings, 
  Bell, 
  Lock, 
  Database,
  Mail,
  Zap,
  Save,
  Loader2,
  Trash2,
  ListTodo,
  Calendar
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateProfile, upgradeToPremium, cancelPremium } = useAuth();
  const { tasks, currentPlan, resetData } = useApp();
  
  const [name, setName] = useState(user?.name || '');
  const [studyHours, setStudyHours] = useState(user?.studyHoursPerDay || 4);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('General');

  const isPremium = user?.role === UserRole.PREMIUM || user?.role === UserRole.ADMIN;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(name, studyHours);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Delete all your study tasks and current generated plan? This cannot be undone.')) {
      resetData();
      alert('Your study data has been cleared.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500">Personalize your LuminaStudy experience and manage data.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-100">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              {isPremium && (
                <div className="absolute -top-1 -right-1 bg-amber-400 p-1.5 rounded-full border-4 border-white">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-xl font-bold text-gray-900 truncate">{user?.name}</h2>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <div className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isPremium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isPremium ? <Crown className="h-3 w-3 mr-1" /> : null}
              {user?.role}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest text-center">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><ListTodo className="h-4 w-4 mr-2" /> Tasks</span>
                <span className="font-bold text-gray-900">{tasks.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 flex items-center"><Calendar className="h-4 w-4 mr-2" /> Active Plan</span>
                <span className={`font-bold ${currentPlan ? 'text-green-600' : 'text-gray-400'}`}>{currentPlan ? 'YES' : 'NO'}</span>
              </div>
            </div>
          </div>

          <nav className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {[
              { label: 'General', icon: Settings },
              { label: 'Notifications', icon: Bell },
              { label: 'Security', icon: Lock },
              { label: 'Data & Privacy', icon: Database },
            ].map(item => (
              <button 
                key={item.label} 
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === item.label ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="md:col-span-2 space-y-6">
          {activeTab === 'General' ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                Profile Information <Settings className="ml-2 h-4 w-4 text-gray-400" />
              </h3>
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Average Study Capacity ({studyHours}h)
                    </label>
                    <input 
                      type="range" 
                      min="1" 
                      max="12" 
                      step="1"
                      value={studyHours}
                      onChange={(e) => setStudyHours(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email (Primary)</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input type="text" readOnly value={user?.email} className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500 outline-none" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Save className="h-5 w-5 mr-2" />}
                  Save Changes
                </button>
              </form>
            </div>
          ) : activeTab === 'Data & Privacy' ? (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Data Management</h3>
              <p className="text-sm text-gray-500 mb-8">Manage how LuminaStudy stores your academic records.</p>
              
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-red-50 border border-red-100">
                  <h4 className="font-bold text-red-900 flex items-center mb-2">
                    <Trash2 className="h-4 w-4 mr-2" /> Danger Zone
                  </h4>
                  <p className="text-xs text-red-700 mb-4">This action will permanently delete all your tasks, study subjects, and AI generated plans from this device.</p>
                  <button 
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl hover:bg-red-700 transition-colors"
                  >
                    Reset Application Data
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl text-center border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">This section ({activeTab}) is under development.</p>
            </div>
          )}

          {!isPremium && (
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold">Lumina Premium</h3>
                  <p className="text-indigo-100 text-sm mt-1">Unlock the full power of AI-driven success.</p>
                </div>
                <Zap className="h-12 w-12 text-amber-400 fill-amber-400" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Unlimited AI Study Plans',
                  'Priority Task Optimization',
                  'Advanced Productivity Analytics',
                  'Export Plans to PDF/Calendar',
                ].map(feature => (
                  <div key={feature} className="flex items-center text-sm">
                    <div className="p-0.5 bg-indigo-500 rounded-full mr-3">
                      <Check className="h-3 w-3" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                onClick={upgradeToPremium}
                className="w-full py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-lg"
              >
                Upgrade to Premium - $9.99/mo
              </button>
            </div>
          )}

          {user?.role === UserRole.PREMIUM && (
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
              <div className="flex items-center mb-4">
                <Crown className="h-8 w-8 text-amber-500 mr-4" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900">Premium Active</h3>
                  <p className="text-sm text-amber-700">Thank you for supporting LuminaStudy!</p>
                </div>
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                You currently have access to all premium features including unlimited AI generations and deep analytics. 
                Your next billing date is {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
              </p>
              <button 
                onClick={cancelPremium}
                className="mt-6 text-sm font-semibold text-amber-700 underline underline-offset-4 hover:text-amber-900 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
