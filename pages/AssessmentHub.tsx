
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from '../types';

const AssessmentHub: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('btl_user_profile');
    const storedReadiness = localStorage.getItem('btl_readiness_profile');
    
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedReadiness) setHasAssessment(true);
  }, []);

  const getLevelLabel = (lvl: number) => {
    switch(lvl) {
      case 1: return "Foundational";
      case 2: return "Fullstack (MERN)";
      case 3: return "Industrial Ready";
      default: return "Analyzing...";
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Assessment Hub</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Explore diagnostics or view your direct action plan based on your level.</p>
        </div>
        
        {user && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.currentLevel}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Active Level</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{getLevelLabel(user.currentLevel)}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Diagnostic */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none col-span-1 md:col-span-2 transition-all">
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm border border-white/20">
              Optional Verification
            </div>
            <h3 className="text-2xl font-bold mb-2">Technical Level Diagnostics</h3>
            <p className="text-indigo-100 dark:text-indigo-200 mb-8 max-w-md leading-relaxed font-medium">
              Verify your proficiency through a multi-layer analysis to fine-tune your roadmap gaps and distance from industry benchmarks.
            </p>
            <Link 
              to="/check-in" 
              className="bg-white text-indigo-600 dark:text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              {hasAssessment ? "Retake Diagnostic" : "Start Technical Diagnostic (15m)"}
            </Link>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-64 w-64" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
        </div>

        {/* Roadmap Lock/Unlock Status */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Action Plan: Active</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
              Your roadmap is open based on your Level {user?.currentLevel} baseline. Explore 3 industrial projects now.
            </p>
          </div>
          
          <div className="mt-6">
            <Link to="/plan" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 group">
              View My Projects 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Learning Signals</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">
            <div>Pathway</div>
            <div>Status</div>
            <div>Focus Domain</div>
            <div>Access</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            <div className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="font-bold text-slate-800 dark:text-white">Industrial Projects</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold">UNLOCKED</div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">{user?.domain}</div>
              <div>
                 <Link to="/plan" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase hover:underline">Launch Lab</Link>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="font-bold text-slate-800 dark:text-white">Diagnostic History</div>
              <div className="text-slate-500 dark:text-slate-400 italic">{hasAssessment ? "Available" : "No Records"}</div>
              <div className="text-slate-600 dark:text-slate-400 font-medium">{user?.domain}</div>
              <div>
                 <Link to="/history" className="text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase hover:underline">Details</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHub;
