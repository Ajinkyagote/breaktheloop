
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, ProficiencyLevel } from '../types';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    year: '3rd Year',
    domain: 'Fullstack Development',
    goal: 'Product Company Intern',
    currentLevel: 1,
    skills: {
      htmlCssJs: false,
      mern: false,
      devops: false
    }
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Determine initial level based on skills (Level 1 by default until assessment)
      let initialLevel: ProficiencyLevel = 1;
      if (formData.skills.devops) initialLevel = 3;
      else if (formData.skills.mern) initialLevel = 2;
      
      const updatedData = { ...formData, currentLevel: initialLevel };
      localStorage.setItem('btl_user_profile', JSON.stringify(updatedData));
      
      // Navigate to Assessment Hub instead of directly to the Action Plan
      // This forces the "judge level" logic to occur via the diagnostic assessment
      navigate('/hub');
    }
  };

  const toggleSkill = (skill: keyof typeof formData.skills) => {
    setFormData({
      ...formData,
      skills: { ...formData.skills, [skill]: !formData.skills[skill] }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-xl border dark:border-slate-800 transition-all">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {step === 1 && "Identity"}
            {step === 2 && "Knowledge Baseline"}
            {step === 3 && "Industry Goal"}
          </h2>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{step}/3</span>
        </div>

        <div className="space-y-6 min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="Alex Chen"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Current Domain</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white outline-none"
                  value={formData.domain}
                  onChange={e => setFormData({...formData, domain: e.target.value})}
                >
                  <option>Fullstack Development</option>
                  <option>Data Science</option>
                  <option>Mobile Dev</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Check all that you know well:</label>
              <div className="space-y-3">
                <button 
                  onClick={() => toggleSkill('htmlCssJs')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.skills.htmlCssJs ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800'}`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">Foundations</p>
                  <p className="text-xs text-slate-500">HTML5, CSS3, Modern JavaScript</p>
                </button>
                <button 
                  onClick={() => toggleSkill('mern')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.skills.mern ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800'}`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">Fullstack (MERN)</p>
                  <p className="text-xs text-slate-500">React, Node.js, Express, MongoDB</p>
                </button>
                <button 
                  onClick={() => toggleSkill('devops')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.skills.devops ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-800'}`}
                >
                  <p className="font-bold text-slate-900 dark:text-white">Advanced / DevOps</p>
                  <p className="text-xs text-slate-500">Docker, CI/CD Pipelines, AWS/GCP</p>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Your Career Goal</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 dark:text-white outline-none"
                  placeholder="e.g. Senior Frontend at Google"
                  value={formData.goal}
                  onChange={e => setFormData({...formData, goal: e.target.value})}
                />
              </div>
              <p className="text-xs text-slate-500 italic">
                We'll use this to customize your projects and advanced tasks.
              </p>
            </div>
          )}
        </div>

        <button 
          onClick={handleNext}
          className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          {step === 3 ? "Get Started" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
