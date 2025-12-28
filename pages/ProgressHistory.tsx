
import React, { useEffect, useState } from 'react';
import { ProgressReport, SkillProgressState } from '../types';
import { Link } from 'react-router-dom';

const ProgressHistory: React.FC = () => {
  const [report, setReport] = useState<ProgressReport | null>(null);

  useEffect(() => {
    const storedReport = localStorage.getItem('btl_progress_report');
    if (storedReport) {
      setReport(JSON.parse(storedReport));
    }
  }, []);

  if (!report) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-500 transition-colors">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">No Progress Data Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Complete tasks in your <Link to="/plan" className="text-indigo-600 dark:text-indigo-400 font-bold underline">Action Plan</Link> to generate skill signals.
        </p>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'Improving': return <span className="text-emerald-500">▲</span>;
      case 'Regressing': return <span className="text-red-500">▼</span>;
      default: return <span className="text-slate-400">─</span>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Mastered': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Validating': return 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Practicing': return 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Progress Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold">Real-time skill signal analysis.</p>
      </header>

      {report.alerts.length > 0 && report.alerts.some(a => a.type !== 'None') && (
        <div className="space-y-2">
          {report.alerts.filter(a => a.type !== 'None').map((alert, i) => (
            <div key={i} className={`p-4 rounded-xl border flex gap-3 items-start transition-colors ${
              alert.type === 'Stall' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300' :
              alert.type === 'Overload' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300' :
              'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/40 text-blue-800 dark:text-blue-300'
            }`}>
              <span className="font-bold uppercase text-xs mt-1 px-2 py-0.5 bg-white/50 dark:bg-slate-900/50 rounded border dark:border-slate-700">{alert.type}</span>
              <p className="text-sm font-bold">{alert.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-slate-900 dark:bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center gap-8 border dark:border-slate-800 transition-colors">
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Readiness Movement</h3>
          <p className="text-xl font-medium leading-relaxed font-bold">
            "{report.readinessMovement.description}"
          </p>
        </div>
        <div className="text-center bg-white/10 dark:bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm min-w-[160px] border border-white/20 dark:border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-bold mb-2">Direction</p>
          <p className={`text-2xl font-bold ${
            report.readinessMovement.direction === 'Forward' ? 'text-emerald-400' :
            report.readinessMovement.direction === 'Backward' ? 'text-red-400' : 'text-slate-300'
          }`}>
            {report.readinessMovement.direction}
          </p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 flex justify-between items-center transition-colors">
          <span>Active Skills Being Tracked</span>
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border dark:border-slate-700">
            {report.activeSkills.length} Skills
          </span>
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {report.activeSkills.map((skill, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">{skill.skillName}</h4>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg transition-colors border dark:border-slate-700">
                   {getTrendIcon(skill.trend)}
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full border transition-colors ${getStatusColor(skill.status)}`}>
                  {skill.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                  {skill.evidenceCount} signals
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-colors shadow-sm">
        <div className="text-center md:text-left">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">Next Validation Checkpoint</h4>
          <p className="text-sm text-indigo-800 dark:text-indigo-400 mt-1 font-bold">{report.nextCheckpoint}</p>
        </div>
        <Link 
          to="/check-in"
          className="bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 dark:shadow-none transition-all"
        >
          Run Full Diagnostics
        </Link>
      </div>
    </div>
  );
};

export default ProgressHistory;
