
import React, { useState, useEffect } from 'react';
import { generateLevelActionPlan } from '../services/geminiService';
import { ActionPlanResponse, UserProfile, ProjectSuggestion } from '../types';
import { useNavigate, Link } from 'react-router-dom';

const ActionPlan: React.FC = () => {
  const [plan, setPlan] = useState<ActionPlanResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [assessmentRequired, setAssessmentRequired] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem('btl_user_profile');
      const storedReadiness = localStorage.getItem('btl_readiness_profile');

      if (!storedUser) {
        navigate('/onboarding');
        return;
      }

      // If no assessment has been done, we don't generate a plan yet
      if (!storedReadiness) {
        setAssessmentRequired(true);
        setLoading(false);
        return;
      }

      const userData: UserProfile = JSON.parse(storedUser);
      setUser(userData);

      try {
        const generatedPlan = await generateLevelActionPlan(userData);
        setPlan(generatedPlan);
        if (generatedPlan.roadmap.projects.length > 0) {
          setActiveProject(generatedPlan.roadmap.projects[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleNextLevel = () => {
    if (!user || user.currentLevel >= 3) return;
    const nextLevel = (user.currentLevel + 1) as any;
    const updatedUser = { ...user, currentLevel: nextLevel };
    setUser(updatedUser);
    localStorage.setItem('btl_user_profile', JSON.stringify(updatedUser));
    setLoading(true);
    generateLevelActionPlan(updatedUser).then(p => {
      setPlan(p);
      setLoading(false);
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold animate-pulse">Designing Your Intelligence Roadmap...</p>
      </div>
    );
  }

  if (assessmentRequired) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 rounded-[2rem] mx-auto flex items-center justify-center border border-indigo-100 dark:border-indigo-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Roadmap Locked</h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            To generate a production-ready Action Plan, our AI first needs to judge your proficiency levels through the diagnostic assessment.
          </p>
        </div>
        <Link 
          to="/hub" 
          className="inline-block px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
        >
          Unlock Action Plan (Start Assessment)
        </Link>
        
        {/* Placeholder Sketch UI */}
        <div className="pt-12 opacity-20 pointer-events-none filter grayscale">
           <div className="flex items-center justify-center gap-4 py-8">
            {[1, 2, 3].map((lvl) => (
              <React.Fragment key={lvl}>
                <div className="w-12 h-12 rounded-full border-2 bg-slate-100 border-slate-200"></div>
                {lvl < 3 && <div className="h-1 w-20 bg-slate-100"></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="h-40 bg-slate-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const currentLevel = user?.currentLevel || 1;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
      {/* Sketch UI Header: Circles with Line */}
      <div className="flex items-center justify-center gap-4 py-8">
        {[1, 2, 3].map((lvl) => (
          <React.Fragment key={lvl}>
            <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
              currentLevel === lvl 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110' 
                : currentLevel > lvl 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
            }`}>
              <span className="font-bold">{lvl}</span>
              {currentLevel === lvl && (
                <div className="absolute -bottom-6 text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  Current Stage
                </div>
              )}
            </div>
            {lvl < 3 && (
              <div className={`h-1 w-20 md:w-32 rounded-full ${currentLevel > lvl ? 'bg-emerald-400' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Workspace: "Things to do here" */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          <div className="bg-slate-900 p-8 md:p-10 text-white">
            <h2 className="text-3xl font-bold mb-2">{plan?.levelTitle}</h2>
            <p className="text-slate-400 font-medium leading-relaxed">{plan?.summary}</p>
          </div>

          <div className="p-8 md:p-10 space-y-10">
            {/* Curriculum Section */}
            <section className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Curriculum Syllabus</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {plan?.roadmap.curriculum.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.topic}</h4>
                    <ul className="space-y-1">
                      {item.subtopics.map((sub, si) => (
                        <li key={si} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Level Specific Requirements (Responsive/Cloud or CI/CD/Docker) */}
            <section className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/40">
              <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-800 dark:text-indigo-400 mb-4">Level {currentLevel} Mastery Requirements</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {plan?.roadmap.advancedTasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-slate-200">
                    <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {task}
                  </div>
                ))}
              </div>
            </section>

            {/* Progression Button */}
            <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleNextLevel}
                disabled={currentLevel >= 3}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all ${
                  currentLevel >= 3 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none'
                }`}
              >
                {currentLevel === 3 ? "Course Complete" : "Next Level Progression"}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Projects Selector */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Level {currentLevel} Project Suite</h3>
            <div className="space-y-4">
              {plan?.roadmap.projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => setActiveProject(proj.id)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all group ${
                    activeProject === proj.id 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg' 
                      : 'border-slate-50 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <h4 className={`font-bold transition-colors ${activeProject === proj.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-300'}`}>
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{proj.techStack.join(', ')}</p>
                </button>
              ))}
            </div>

            {/* Active Project Details */}
            {activeProject && plan && (
              <div className="mt-10 animate-in slide-in-from-top-4 duration-300">
                {plan.roadmap.projects.filter(p => p.id === activeProject).map(p => (
                  <div key={p.id} className="space-y-6">
                    <div className="p-5 rounded-2xl bg-slate-900 text-white">
                      <h5 className="text-sm font-bold mb-3">Project Requirement</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold uppercase text-slate-400">Core Objectives</h5>
                      {p.requirements.map((req, ri) => (
                        <div key={ri} className="flex gap-3 text-sm font-medium text-slate-700 dark:text-slate-400">
                          <span className="text-indigo-600 font-bold">{ri + 1}.</span>
                          {req}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4">
                      <button className="w-full py-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors">
                        Submit Project for AI Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
            <h4 className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400 mb-2">Pro Tip</h4>
            <p className="text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed font-medium">
              Completing all three projects at this level unlocks the "Next Level" progression automatically. Each project includes production-standard checks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;
