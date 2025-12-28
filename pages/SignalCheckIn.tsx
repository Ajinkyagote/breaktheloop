
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignalCheckIn: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'confidence' | 'checkpoint'>('confidence');
  const [value, setValue] = useState(50);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save signal
    setSubmitted(true);
    setTimeout(() => navigate('/'), 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Signal Captured!</h2>
        <p className="text-slate-500">Your readiness trajectory is being updated...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Micro Check-in</h2>
        <p className="text-slate-500">Log a quick learning signal to update your trajectory.</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">What are you learning right now?</label>
          <input 
            required
            type="text" 
            placeholder="e.g. Asynchronous JavaScript, Database Normalization..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => setType('confidence')}
            className={`p-4 rounded-xl border transition-all text-left ${type === 'confidence' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${type === 'confidence' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="font-bold text-sm text-slate-800">Self Confidence</p>
            <p className="text-xs text-slate-500 mt-1">How well do you think you know this?</p>
          </button>
          
          <button 
            type="button"
            onClick={() => setType('checkpoint')}
            className={`p-4 rounded-xl border transition-all text-left ${type === 'checkpoint' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${type === 'checkpoint' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <p className="font-bold text-sm text-slate-800">Skill Checkpoint</p>
            <p className="text-xs text-slate-500 mt-1">Based on a quiz or lab performance.</p>
          </button>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">Select Score</label>
            <span className="text-2xl font-bold text-indigo-600">{value}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={value} 
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Mastery</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          Submit Learning Signal
        </button>
      </form>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
        <div className="text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-amber-800">
          <strong>Why this matters:</strong> These signals help detect if you're hitting a plateau early, allowing the faculty to provide support before final exams.
        </p>
      </div>
    </div>
  );
};

export default SignalCheckIn;
