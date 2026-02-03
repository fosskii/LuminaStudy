
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, StudyBlock, StudyPlan } from '../types';

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  currentPlan: StudyPlan | null;
  setPlan: (blocks: StudyBlock[]) => void;
  clearPlan: () => void;
  resetData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentPlan, setCurrentPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('lumina_tasks');
    const savedPlan = localStorage.getItem('lumina_plan');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedPlan) setCurrentPlan(JSON.parse(savedPlan));
  }, []);

  useEffect(() => {
    localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (currentPlan) localStorage.setItem('lumina_plan', JSON.stringify(currentPlan));
    else localStorage.removeItem('lumina_plan');
  }, [currentPlan]);

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask = { ...taskData, id: `task-${Date.now()}` };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const setPlan = (blocks: StudyBlock[]) => {
    const newPlan: StudyPlan = {
      id: `plan-${Date.now()}`,
      userId: 'user-123', // In a real app, this would be the logged in user ID
      title: `Plan generated on ${new Date().toLocaleDateString()}`,
      createdAt: new Date().toISOString(),
      blocks
    };
    setCurrentPlan(newPlan);
  };

  const clearPlan = () => setCurrentPlan(null);

  const resetData = () => {
    setTasks([]);
    setCurrentPlan(null);
    localStorage.removeItem('lumina_tasks');
    localStorage.removeItem('lumina_plan');
  };

  return (
    <AppContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, currentPlan, setPlan, clearPlan, resetData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
