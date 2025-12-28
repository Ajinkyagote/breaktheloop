
import React, { useState, useEffect, useCallback } from 'react';
import { generateLevelActionPlan } from '../services/geminiService';
import { ActionPlanResponse, UserProfile, ProficiencyLevel } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const ActionPlan: React.FC = () => {
  const [plan, setPlan] = useState<ActionPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  const loadData = useCallback(async (userData: UserProfile, bypassCache: boolean = false) => {
    setLoading(true);
    setError(null);
    try {
      const cacheKey = `btl_plan_lvl_${userData.currentLevel}`;
      const cached = localStorage.getItem(cacheKey);

      if (!bypassCache && cached) {
        setPlan(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const generatedPlan = await generateLevelActionPlan(userData);
      if (generatedPlan?.roadmap?.projects) {
        setPlan(generatedPlan);
        localStorage.setItem(cacheKey, JSON.stringify(generatedPlan));
      } else {
        throw new Error("Failed to generate project suggestions.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while generating your plan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('btl_user_profile');
    if (!storedUser) {
      navigate('/onboarding');
      return;
    }
    const userData: UserProfile = JSON.parse(storedUser);
    setUser(userData);
    loadData(userData);
  }, [navigate, loadData]);

  const changeLevel = async (newLevel: ProficiencyLevel) => {
    if (!user) return;
    const updatedUser = { ...user, currentLevel: newLevel };
    setUser(updatedUser);
    localStorage.setItem('btl_user_profile', JSON.stringify(updatedUser));
    loadData(updatedUser);
  };

  const getPhaseName = (lvl: number) => {
    switch (lvl) {
      case 1: return "Foundation: UI Mastery";
      case 2: return "Specialist: Fullstack Mastery";
      case 3: return "Industrial: Cloud & Production";
      default: return "Skill Development";
    }
  };

  const getPhaseGoal = (lvl: number) => {
    switch (lvl) {
      case 1: return "Build a pixel-perfect clone of a famous platform frontend.";
      case 2: return "Build a responsive web app with a working backend and database.";
      case 3: return "Deploy a production-ready system to the cloud with Docker/CI/CD.";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="text-slate-900 dark:text-white font-bold text-lg">Analyzing Industry Requirements</p>
          <p className="text-slate-500 text-sm">Crafting your personalized projects for Level {user?.currentLevel}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-12 text-center space-y-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-10">
        <div className="text-red-500 text-4xl">⚠️</div>
        <h2 className="text-2xl font-bold dark:text-white">Action Plan Unavailable</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={() => user && loadData(user, true)}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Level Toggle Header */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
            {user?.currentLevel}
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Current Phase</h3>
            <p className="text-slate-900 dark:text-white font-bold">{getPhaseName(user?.currentLevel || 1)}</p>
          </div>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border dark:border-slate-700 transition-colors">
          {[1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => changeLevel(lvl as ProficiencyLevel)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                user?.currentLevel === lvl 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Lvl {lvl}
            </button>
          ))}
        </div>
      </div>

      <header className="space-y-4">
        <div className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-800">
          Target Goal: {user?.goal}
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          {plan?.roadmap?.title || "Your Growth Strategy"}
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
          <span className="font-bold text-indigo-600 dark:text-indigo-400">Phase Goal:</span> {getPhaseGoal(user?.currentLevel || 1)}
        </p>
      </header>

      {/* Recommended Projects List */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Project Recommendations</h3>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
        </div>

        <div className="grid gap-8">
          {plan?.roadmap?.projects.map((proj) => (
            <div key={proj.id} className="group p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all flex flex-col md:flex-row gap-8">
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <h4 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">{proj.title}</h4>
                  <div className="flex gap-2">
                    {proj.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-[10px] font-bold border dark:border-slate-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium text-lg leading-relaxed">
                  {proj.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">Key Requirements</p>
                    <ul className="space-y-1">
                      {proj.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="md:w-48 flex items-center justify-center border-l border-slate-100 dark:border-slate-800 pl-8">
                <button className="w-full py-4 bg-slate-900 dark:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-black dark:hover:bg-indigo-600 transition-all">
                  Start Lab
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
              Core Curriculum Focus
            </h3>
            <div className="space-y-6">
              {plan?.roadmap?.curriculum.map((item, i) => (
                <div key={i} className="space-y-2">
                  <p className="text-indigo-400 font-bold uppercase text-xs tracking-widest">{item.topic}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.subtopics.map((sub, si) => (
                      <span key={si} className="text-slate-400 text-sm">• {sub}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-6">Advanced Challenges</h3>
            <ul className="space-y-4">
              {plan?.roadmap?.advancedTasks.map((task, i) => (
                <li key={i} className="flex gap-3 text-slate-300 text-sm">
                  <span className="text-indigo-400 font-bold">L{user?.currentLevel}+</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-10 border-t border-slate-200 dark:border-slate-800">
        <Link to="/hub" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Hub
        </Link>
        <button 
          onClick={() => user && loadData(user, true)}
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline uppercase tracking-widest"
        >
          Regenerate Suggestions
        </button>
      </div>
    </div>
  );
};

export default ActionPlan;
