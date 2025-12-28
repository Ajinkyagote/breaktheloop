
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
          <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">Select a diagnostic module to judge your level and generate your roadmap.</p>
        </div>
        
        {user && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 transition-all">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
              {user.currentLevel}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Initial Level</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{getLevelLabel(user.currentLevel)}</p>
            </div>
          </div>
        )}
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Diagnostic */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-800 dark:to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100 dark:shadow-none col-span-1 md:col-span-2 transition-all">
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-4 backdrop-blur-sm border border-white/20">
              Required Step
            </div>
            <h3 className="text-2xl font-bold mb-2">Level-Judgement Assessment</h3>
            <p className="text-indigo-100 dark:text-indigo-200 mb-8 max-w-md leading-relaxed font-medium">
              A comprehensive multi-layer analysis that confirms your proficiency and builds your personalized Action Plan.
            </p>
            <Link 
              to="/check-in" 
              className="bg-white text-indigo-600 dark:text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
            >
              {hasAssessment ? "Retake Diagnostic" : "Start First Assessment (15m)"}
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${hasAssessment ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
              {hasAssessment ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Action Plan Status</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
              {hasAssessment ? "Your roadmap is unlocked and active." : "Action Plan will generate upon assessment completion."}
            </p>
          </div>
          
          <div className="mt-6">
            {hasAssessment ? (
              <Link to="/plan" className="text-sm font-bold text-indigo-600 underline">View My Roadmap →</Link>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Locked</span>
                  <span>0%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-300 w-0 transition-all duration-500"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-6">Recent Diagnostics</h3>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">
            <div>Type</div>
            <div>Date</div>
            <div>Focus</div>
            <div>Result</div>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
            {hasAssessment ? (
              <div className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <div className="font-bold text-slate-800 dark:text-slate-200">Level Diagnostic</div>
                <div className="text-slate-500 dark:text-slate-400">Completed</div>
                <div className="text-slate-600 dark:text-slate-300 font-medium">{user?.domain}</div>
                <div>
                   <span className="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs font-bold border border-emerald-100">
                     Lvl {user?.currentLevel} Unlocked
                   </span>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-slate-400 italic">No previous assessment history found.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentHub;
