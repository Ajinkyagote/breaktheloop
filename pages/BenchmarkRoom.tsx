
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BenchmarkTask, BenchmarkResponse, UserProfile, ReadinessProfile } from '../types';
import { getBenchmarkTasks, evaluateBenchmarkGap } from '../services/geminiService';

const BenchmarkRoom: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<BenchmarkTask[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responses, setResponses] = useState<BenchmarkResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const historyStr = localStorage.getItem('btl_diagnostic_history');
      const profileStr = localStorage.getItem('btl_user_profile');
      
      if (historyStr && profileStr) {
        const history = JSON.parse(historyStr);
        const userProfile = JSON.parse(profileStr);
        
        try {
          const fetchedTasks = await getBenchmarkTasks(history, userProfile);
          
          if (!fetchedTasks || fetchedTasks.length === 0) {
            // Fallback: Use technical analysis as final if benchmark fails
            const tempProfile = JSON.parse(localStorage.getItem('btl_temp_profile') || '{}');
            localStorage.setItem('btl_readiness_profile', JSON.stringify({
              ...tempProfile,
              positioningStatement: "Benchmark phase skipped due to service availability.",
              gapClarity: "Detailed gap analysis unavailable."
            }));
            navigate('/plan');
            return;
          }

          setTasks(fetchedTasks);
        } catch (err) {
          console.error("Benchmark initialization failed:", err);
          navigate('/hub');
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/onboarding');
      }
    };
    initialize();
  }, [navigate]);

  const handleNext = async () => {
    if (selectedOption === null || tasks.length === 0) return;

    const task = tasks[currentIndex];
    const newResponse: BenchmarkResponse = {
      taskId: task.id,
      selectedOptionIndex: selectedOption,
      evaluation: task.options[selectedOption].level as any
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setSelectedOption(null);

    if (currentIndex < tasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishBenchmark(updatedResponses);
    }
  };

  const finishBenchmark = async (finalResponses: BenchmarkResponse[]) => {
    setEvaluating(true);
    try {
      const tempProfileStr = localStorage.getItem('btl_temp_profile');
      const userProfileStr = localStorage.getItem('btl_user_profile');
      
      if (!tempProfileStr || !userProfileStr) throw new Error("Missing diagnostic context");
      
      const profile: ReadinessProfile = JSON.parse(tempProfileStr);
      const userProfile: UserProfile = JSON.parse(userProfileStr);
      
      localStorage.setItem('btl_benchmark_responses', JSON.stringify(finalResponses));
      
      const evaluation = await evaluateBenchmarkGap(profile, finalResponses, userProfile);
      
      const finalProfile: ReadinessProfile = {
        ...profile,
        positioningStatement: evaluation.positioning,
        gapClarity: evaluation.gapClarity
      };
      
      // FINAL SAVE: This unlocks the Action Plan
      localStorage.setItem('btl_readiness_profile', JSON.stringify(finalProfile));
      
      // Force immediate regeneration of plan for the judged level
      localStorage.removeItem('btl_action_plan');
      
      setTimeout(() => navigate('/plan'), 1000);
    } catch (err) {
      console.error("Final evaluation failed:", err);
      navigate('/hub');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-slate-900 dark:border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-800 dark:text-slate-300 font-bold italic">Simulating industry scenarios...</p>
      </div>
    );
  }

  if (evaluating) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-200 dark:border-slate-800 border-t-indigo-700 dark:border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-800 dark:text-slate-300 font-bold">Calculating final roadmap distance...</p>
      </div>
    );
  }

  const currentTask = tasks[currentIndex];

  if (!currentTask) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="bg-slate-900 dark:bg-indigo-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors border dark:border-indigo-800">Phase 2: Benchmark Context</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Task {currentIndex + 1} of {tasks.length}</h2>
        </div>
        <div className="flex gap-1">
          {tasks.map((_, i) => (
            <div key={i} className={`h-2 w-10 rounded-full transition-all ${i <= currentIndex ? 'bg-slate-900 dark:bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          ))}
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-8 md:p-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors">
          <h3 className="text-sm font-bold uppercase text-slate-700 dark:text-slate-400 mb-2 tracking-wider">Scenario</h3>
          <p className="text-xl text-slate-900 dark:text-slate-200 font-bold leading-relaxed italic">
            "{currentTask.scenario}"
          </p>
        </div>
        <div className="p-8 md:p-12 space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase text-indigo-700 dark:text-indigo-400 mb-4 tracking-wider">Objective</h3>
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {currentTask.task}
            </p>
          </div>

          <div className="space-y-4">
            {currentTask.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all group ${
                  selectedOption === i 
                    ? 'border-indigo-700 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-4 ring-indigo-100 dark:ring-indigo-900/40' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <span className={`text-lg font-bold block mb-1 ${selectedOption === i ? 'text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-300'}`}>
                  {opt.text}
                </span>
              </button>
            ))}
          </div>

          <button
            disabled={selectedOption === null}
            onClick={handleNext}
            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
              selectedOption === null 
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600 shadow-none cursor-not-allowed' 
                : 'bg-slate-900 dark:bg-indigo-700 text-white hover:bg-black dark:hover:bg-indigo-800'
            }`}
          >
            Finalize Decision
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs text-slate-700 dark:text-slate-500 font-bold">
          Your industry context is necessary to accurately map your technical skills to a roadmap.
        </p>
      </div>
    </div>
  );
};

export default BenchmarkRoom;
