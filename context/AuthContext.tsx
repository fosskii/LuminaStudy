
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  allUsers: User[];
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, name: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, studyHours: number) => Promise<void>;
  upgradeToPremium: () => void;
  cancelPremium: () => void;
  updateUserRole: (userId: string, newRole: UserRole) => Promise<void>;
  toggleUserStatus: (userId: string) => Promise<void>;
  flagUser: (userId: string) => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'admin-1', name: 'Ahmed Admin', email: 'ahmedokovic@gmail.com', role: UserRole.ADMIN, createdAt: '2023-01-01', status: 'active', isFlagged: false, studyHoursPerDay: 6 },
  { id: 'mod-1', name: 'Ima Moderator', email: 'imacow47@gmail.com', role: UserRole.MODERATOR, createdAt: '2023-02-15', status: 'active', isFlagged: false, studyHoursPerDay: 4 },
  { id: 'user-1', name: 'Standard Student', email: 'student@example.com', role: UserRole.USER, createdAt: '2023-10-01', status: 'active', isFlagged: false, studyHoursPerDay: 3 },
];

const determineRoleFromEmail = (email: string): UserRole => {
  const normalizedEmail = email.toLowerCase().trim();
  if (normalizedEmail === 'ahmedokovic@gmail.com') return UserRole.ADMIN;
  if (normalizedEmail === 'imacow47@gmail.com') return UserRole.MODERATOR;
  return UserRole.USER;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedAllUsers = localStorage.getItem('lumina_all_users');
    const initialUsers = savedAllUsers ? JSON.parse(savedAllUsers) : INITIAL_USERS;
    setAllUsers(initialUsers);

    const savedCurrentUser = localStorage.getItem('lumina_user');
    if (savedCurrentUser) {
      const parsed = JSON.parse(savedCurrentUser);
      // Ensure current user data is synced with the "allUsers" db
      const syncedUser = initialUsers.find((u: User) => u.email === parsed.email);
      if (syncedUser) {
        if (syncedUser.status === 'disabled') {
          localStorage.removeItem('lumina_user');
          setUser(null);
        } else {
          setUser(syncedUser);
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('lumina_all_users', JSON.stringify(allUsers));
    }
  }, [allUsers, loading]);

  const login = async (email: string, pass: string) => {
    await new Promise(r => setTimeout(r, 800));
    
    const existingUser = allUsers.find(u => u.email === email);
    if (existingUser) {
      if (existingUser.status === 'disabled') {
        throw new Error('Your account has been disabled. Please contact admin.');
      }
      setUser(existingUser);
      localStorage.setItem('lumina_user', JSON.stringify(existingUser));
    } else {
      // Auto-register for demo purposes if not in INITIAL_USERS but matches specific emails
      const role = determineRoleFromEmail(email);
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role,
        createdAt: new Date().toISOString(),
        status: 'active',
        isFlagged: false,
        studyHoursPerDay: 4
      };
      setAllUsers(prev => [...prev, newUser]);
      setUser(newUser);
      localStorage.setItem('lumina_user', JSON.stringify(newUser));
    }
  };

  const register = async (email: string, name: string, pass: string) => {
    await new Promise(r => setTimeout(r, 800));
    const role = determineRoleFromEmail(email);
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
      status: 'active',
      isFlagged: false,
      studyHoursPerDay: 4
    };
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('lumina_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
  };

  const updateProfile = async (name: string, studyHours: number) => {
    if (!user) return;
    const updatedUser = { ...user, name, studyHoursPerDay: studyHours };
    setUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    localStorage.setItem('lumina_user', JSON.stringify(updatedUser));
  };

  const upgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, role: UserRole.PREMIUM };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      localStorage.setItem('lumina_user', JSON.stringify(updatedUser));
    }
  };

  const cancelPremium = () => {
    if (user && user.role === UserRole.PREMIUM) {
      const updatedUser = { ...user, role: UserRole.USER };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      localStorage.setItem('lumina_user', JSON.stringify(updatedUser));
    }
  };

  // Admin/Moderator Methods
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (user?.role !== UserRole.ADMIN) throw new Error('Unauthorized');
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const toggleUserStatus = async (userId: string) => {
    if (user?.role !== UserRole.ADMIN) throw new Error('Unauthorized');
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u));
  };

  const flagUser = async (userId: string) => {
    if (![UserRole.ADMIN, UserRole.MODERATOR].includes(user?.role as UserRole)) throw new Error('Unauthorized');
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isFlagged: !u.isFlagged } : u));
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isModerator = user?.role === UserRole.MODERATOR || user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ 
      user, allUsers, loading, login, register, logout, updateProfile, 
      upgradeToPremium, cancelPremium, updateUserRole, toggleUserStatus, flagUser, 
      isAdmin, isModerator 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
