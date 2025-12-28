
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Settings & Transparency</h2>
        <p className="text-slate-700 dark:text-slate-400 mt-1 font-bold">Control your data and understand how our AI works.</p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm transition-colors">
        <div className="p-8">
           <h3 className="font-bold text-slate-900 dark:text-white mb-2">Data Privacy</h3>
           <p className="text-sm text-slate-700 dark:text-slate-400 mb-6 font-bold leading-relaxed">
             Your individual diagnostic results are private. We only share aggregated, anonymous trend data with your institution faculty to help them adjust curriculum.
           </p>
           <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border dark:border-slate-800">
             <div className="w-12 h-7 bg-emerald-600 rounded-full relative cursor-pointer border-2 border-emerald-700">
               <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
             </div>
             <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Allow Anonymous Trend Contribution</span>
           </div>
        </div>

        <div className="p-8">
           <h3 className="font-bold text-slate-900 dark:text-white mb-2">AI Transparency</h3>
           <p className="text-sm text-slate-700 dark:text-slate-400 font-bold leading-relaxed">
             We use Google Gemini Pro to analyze your patterns. The AI does not assign "grades". It identifies logical gaps and suggests growth trajectories based on forensic performance analysis.
           </p>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-950 transition-colors">
           <button className="text-red-700 dark:text-red-500 text-sm font-bold hover:underline">
             Permanently Delete my Profile & Diagnostic Data
           </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
