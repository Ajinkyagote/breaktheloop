
import React, { useState, useEffect } from 'react';
import ReadinessRadar from '../components/ReadinessRadar';
import { ReadinessProfile, DiagnosisReport } from '../types';
import { generateDiagnosis } from '../services/geminiService';
import { Link } from 'react-router-dom';

const MOCK_PROFILE: ReadinessProfile = {
  studentId: 'user_init',
  timestamp: Date.now(),
  dimensions: {
    concepts: 0,
    application: 0,
    problemSolving: 0,
    technicalFluency: 0,
    discipline: 0,
    selfAwareness: 0
  },
  status: 'Foundation Building',
  benchmarks: [
    { role: 'Not Assessed', matchPercentage: 0 }
  ],
  positioningStatement: "No assessment data available.",
  gapClarity: "Take the diagnostic to reveal your industry readiness."
};

const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<ReadinessProfile>(MOCK_PROFILE);
  const [diagnosis, setDiagnosis] = useState<DiagnosisReport['geminiInsight'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const storedProfile = localStorage.getItem('btl_readiness_profile');
      if (storedProfile) {
        setLoading(true);
        const activeProfile = JSON.parse(storedProfile);
        setProfile(activeProfile);
        setHasData(true);

        const result = await generateDiagnosis(activeProfile, []);
        setDiagnosis(result);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Absolute Clarity Positioning */}
      <div className="bg-slate-900 dark:bg-indigo-950 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden transition-colors duration-200">
        <div className="absolute top-0 right-0 p-8 opacity-20 hidden md:block">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
           </svg>
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block bg-indigo-900/40 text-indigo-200 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-400/30 mb-6">
            Readiness Positioning
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            {profile.positioningStatement}
          </h2>
          <p className="text-slate-300 dark:text-slate-400 text-lg">
            <span className="text-white font-bold">Benchmark Gap:</span> {profile.gapClarity}
          </p>
          {!hasData && (
             <div className="mt-6">
               <Link to="/check-in" className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all">
                 Start Assessment
               </Link>
             </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-center mb-2">Technical Dimensions</h3>
            <ReadinessRadar scores={profile.dimensions} />
            
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-around text-center">
              <div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Role Match</p>
                <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{profile.benchmarks[0]?.matchPercentage}%</p>
              </div>
              <div className="border-l border-slate-100 dark:border-slate-800 pl-4">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">Distance</p>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{diagnosis?.distanceFromGoal || (hasData ? 'Calculating...' : 'Unknown')}</p>
              </div>
            </div>
          </div>
          
          <Link 
            to="/check-in" 
            className="block w-full bg-indigo-700 hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white p-5 rounded-2xl font-bold text-center shadow-lg shadow-indigo-100 dark:shadow-none transition-all"
          >
            {hasData ? "Update Diagnostics" : "Start First Diagnostic"}
          </Link>
        </div>

        {/* Right Diagnosis */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] transition-colors duration-200">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold">
                Σ
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gap Evaluation</h3>
            </div>

            {loading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="pt-8 space-y-3">
                  <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded-xl"></div>
                </div>
              </div>
            ) : diagnosis ? (
              <div className="space-y-10">
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border-l-4 border-indigo-600">
                  <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2 tracking-widest">Industry Analyst View</h4>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-bold">
                    {diagnosis.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">Action Priorities</h4>
                    <div className="space-y-3">
                      {diagnosis.priorities.map((p, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-900 dark:text-slate-100 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl">
                          <span className="text-indigo-700 dark:text-indigo-400 font-bold">{i+1}.</span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-widest">De-prioritize</h4>
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.avoidForNow.map((a, i) => (
                        <span key={i} className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg text-xs font-bold line-through opacity-80 border border-slate-300 dark:border-slate-700">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center h-64 text-center">
                 <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                 </div>
                 <p className="text-slate-700 dark:text-slate-300 font-bold">No diagnostic data yet.</p>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Complete your first assessment to unlock detailed gap analysis.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
