
import React from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Circle, Clock, AlertCircle, ListTodo, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { tasks, toggleTask, currentPlan } = useApp();
  const { user } = useAuth();

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingTasks = tasks.filter(t => !t.completed);
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todaysStudy = currentPlan?.blocks.filter(b => b.day === today) || [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}! 👋</h1>
        <p className="text-gray-500">Here's what's on your agenda for today.</p>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">Overall Progress</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{progress}%</p>
              <p className="text-sm text-gray-500">{completedCount} of {tasks.length} tasks done</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Next Goal</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 truncate">
              {pendingTasks[0]?.title || "All clear!"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {pendingTasks[0] ? `Due: ${new Date(pendingTasks[0].dueDate).toLocaleDateString()}` : "No upcoming deadlines"}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Sparkles className="h-6 w-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">AI Assistant</span>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Need a better plan? Let our AI help you structure your week.</p>
            <Link to="/ai-assistant" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700">
              Generate Now <Sparkles className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Tasks */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ListTodo className="mr-2 h-5 w-5 text-indigo-500" />
              Recent Tasks
            </h2>
            <Link to="/planner" className="text-sm font-medium text-indigo-600">View Planner</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {tasks.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">No tasks created yet.</p>
              </div>
            ) : (
              tasks.slice(0, 5).map(task => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <button onClick={() => toggleTask(task.id)} className="text-gray-400 hover:text-indigo-600">
                      {task.completed ? <CheckCircle2 className="h-6 w-6 text-indigo-600" /> : <Circle className="h-6 w-6" />}
                    </button>
                    <div>
                      <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{task.title}</p>
                      <p className="text-xs text-gray-500">{task.subject} • {task.difficulty}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.priority >= 4 && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <span className="text-xs font-medium text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-500" />
              Today's Study Schedule
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {todaysStudy.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <Calendar className="h-12 w-12 text-gray-200 mx-auto" />
                <p className="text-gray-400">No scheduled sessions for today.</p>
                <Link to="/ai-assistant" className="inline-flex px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-semibold">
                  Generate AI Plan
                </Link>
              </div>
            ) : (
              todaysStudy.map((block) => (
                <div key={block.id} className="flex space-x-4 p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div className="text-center min-w-[70px]">
                    <p className="text-xs font-bold text-indigo-600">{block.startTime}</p>
                    <div className="w-px h-8 bg-indigo-200 mx-auto my-1"></div>
                    <p className="text-xs text-indigo-400">{block.endTime}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-indigo-900">{block.subject}</h3>
                    <p className="text-sm text-indigo-700">{block.topic}</p>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-white px-2 py-0.5 rounded-full mt-2 inline-block">
                      {block.durationMinutes} MINS
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
