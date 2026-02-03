
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';
import { Plus, Trash2, CheckCircle2, Circle, Search, Filter, X } from 'lucide-react';

const PlannerPage: React.FC = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    subject: '',
    dueDate: new Date().toISOString().split('T')[0],
    difficulty: 'Medium',
    priority: 3
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.subject) return;
    
    addTask({
      title: newTask.title || '',
      subject: newTask.subject || '',
      dueDate: newTask.dueDate || '',
      difficulty: (newTask.difficulty as any) || 'Medium',
      priority: newTask.priority || 3,
      completed: false
    });
    setNewTask({ title: '', subject: '', dueDate: new Date().toISOString().split('T')[0], difficulty: 'Medium', priority: 3 });
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Planner</h1>
          <p className="text-gray-500">Manage your subjects and academic milestones.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks or subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </button>
      </div>

      {isAdding && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Add New Task</h2>
              <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input
                  required
                  type="text"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Final Essay Draft"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    required
                    type="text"
                    value={newTask.subject}
                    onChange={e => setNewTask({...newTask, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Psychology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    required
                    type="date"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                  <select
                    value={newTask.difficulty}
                    onChange={e => setNewTask({...newTask, difficulty: e.target.value as any})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all mt-4"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Task</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTasks.map(task => (
              <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-indigo-600">
                    {task.completed ? <CheckCircle2 className="h-5 w-5 text-indigo-500" /> : <Circle className="h-5 w-5" />}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">
                    {task.subject}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium ${
                    task.difficulty === 'Hard' ? 'text-red-600' : task.difficulty === 'Medium' ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {task.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No tasks found. Try adding a new one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlannerPage;
