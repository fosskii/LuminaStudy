
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { generateStudyPlan } from '../services/geminiService';
import { Sparkles, Calendar, Clock, BookOpen, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const AIAssistantPage: React.FC = () => {
  const { tasks, setPlan, currentPlan, clearPlan } = useApp();
  const { user } = useAuth();
  
  const [availableHours, setAvailableHours] = useState(4);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Fix: Explicitly cast the unique subjects list to string[] to resolve type inference issues with Set and Array.from
  const subjects = Array.from(new Set(tasks.map(t => t.subject))) as string[];

  const handleGenerate = async () => {
    if (tasks.length === 0) {
      setError("Please add some tasks in the Planner page first!");
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const planBlocks = await generateStudyPlan(subjects, availableHours, tasks, additionalNotes);
      setPlan(planBlocks);
    } catch (err: any) {
      setError(err.message || "Failed to connect to AI. Check API Key configuration.");
    } finally {
      setIsGenerating(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            AI Study Assistant <Sparkles className="ml-2 h-6 w-6 text-indigo-500 fill-indigo-100" />
          </h1>
          <p className="text-gray-500">Let Gemini optimize your academic schedule.</p>
        </div>
        {currentPlan && (
          <button 
            onClick={clearPlan}
            className="text-sm font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
          >
            Reset Plan
          </button>
        )}
      </header>

      {!currentPlan ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Plan Parameters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Daily Study Capacity <Clock className="ml-2 h-4 w-4 text-gray-400" />
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={availableHours}
                    onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <div className="flex justify-between mt-2 text-sm font-bold text-indigo-600">
                    <span>1h</span>
                    <span>{availableHours} hours / day</span>
                    <span>12h</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Focused Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {subjects.length > 0 ? subjects.map(s => (
                      <span key={s} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold">
                        {s}
                      </span>
                    )) : (
                      <div className="flex items-center text-amber-600 bg-amber-50 p-3 rounded-xl w-full">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        <span className="text-sm">No subjects found. Go to Planner to add tasks.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Considerations</label>
                  <textarea
                    placeholder="e.g., Focus more on Calculus on weekends, I have a big exam on Friday..."
                    rows={4}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  disabled={isGenerating || tasks.length === 0}
                  onClick={handleGenerate}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Designing Your Path...
                    </>
                  ) : (
                    <>
                      Generate Smart Plan
                      <Sparkles className="ml-3 h-5 w-5 fill-white/20" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
              <Sparkles className="absolute top-4 right-4 h-12 w-12 text-white/10" />
              <h3 className="text-xl font-bold mb-4">Why use AI?</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-lg mr-3 mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-indigo-100">Optimizes your mental load by balancing easy and hard subjects.</p>
                </li>
                <li className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-lg mr-3 mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-indigo-100">Ensures all deadlines are met without last-minute cramming.</p>
                </li>
                <li className="flex items-start">
                  <div className="p-1 bg-white/20 rounded-lg mr-3 mt-1">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <p className="text-sm text-indigo-100">Tailors time blocks based on your personal energy levels.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {days.map(day => {
              const dayBlocks = currentPlan.blocks.filter(b => b.day === day);
              return (
                <div key={day} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-fit">
                  <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-center justify-between">
                    <h3 className="font-bold text-indigo-900">{day}</h3>
                    <Calendar className="h-4 w-4 text-indigo-400" />
                  </div>
                  <div className="p-4 space-y-3">
                    {dayBlocks.length > 0 ? (
                      dayBlocks.map(block => (
                        <div key={block.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-indigo-200 transition-all group">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                              {block.startTime} - {block.endTime}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{block.subject}</h4>
                          <p className="text-xs text-gray-500 mt-1 italic">"{block.topic}"</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 text-center py-4">No study sessions scheduled.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPage;
