
import React, { useState, useEffect } from 'react';
import { AssessmentQuestion, UserAnswer, UserProfile, ProficiencyLevel } from '../types';
import { useNavigate } from 'react-router-dom';
import { getNextQuestion, analyzeSession } from '../services/geminiService';

const AssessmentRoom: React.FC = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState<AssessmentQuestion | null>(null);
  const [history, setHistory] = useState<UserAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('btl_user_profile');
    if (storedProfile) {
      const profile = JSON.parse(storedProfile);
      setUserProfile(profile);
      fetchNextQuestion([], profile);
    } else {
      navigate('/onboarding');
    }
  }, []);

  const fetchNextQuestion = async (currentHistory: UserAnswer[], profile: UserProfile) => {
    setLoading(true);
    try {
      const { question, isComplete } = await getNextQuestion(currentHistory, profile);
      if (isComplete || !question) {
        finishDiagnostic(currentHistory, profile);
      } else {
        setCurrentQ(question);
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      setLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (selectedOption === null || !currentQ || !userProfile) return;

    const answer: UserAnswer = {
      questionId: currentQ.id,
      questionText: currentQ.text,
      selectedOptionIndex: selectedOption,
      isCorrect: currentQ.options[selectedOption].isCorrect,
      dimension: currentQ.dimension,
      layer: currentQ.layer,
      timeTaken: 0 
    };

    const newHistory = [...history, answer];
    setHistory(newHistory);
    setSelectedOption(null);
    await fetchNextQuestion(newHistory, userProfile);
  };

  const finishDiagnostic = async (finalHistory: UserAnswer[], profile: UserProfile) => {
    setLoading(false);
    setAnalyzing(true);
    
    try {
      const readinessProfile = await analyzeSession(finalHistory, profile);
      
      // Level Judgment Logic:
      const scores = Object.values(readinessProfile.dimensions);
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      
      let determinedLevel: ProficiencyLevel = 1;
      if (avgScore > 75) determinedLevel = 3;
      else if (avgScore > 40) determinedLevel = 2;
      
      // Update User Profile with new level locally but DON'T save final profile yet
      const updatedProfile: UserProfile = {
        ...profile,
        currentLevel: determinedLevel
      };
      
      // Save data for Benchmark phase
      localStorage.setItem('btl_user_profile', JSON.stringify(updatedProfile));
      localStorage.setItem('btl_diagnostic_history', JSON.stringify(finalHistory));
      localStorage.setItem('btl_temp_profile', JSON.stringify(readinessProfile));
      
      // IMPORTANT: Clear any old readiness profile to keep Action Plan locked
      localStorage.removeItem('btl_readiness_profile');
      
      setTimeout(() => navigate('/benchmark'), 1500);
    } catch (err) {
      console.error("Analysis failed:", err);
      navigate('/hub');
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center animate-bounce shadow-xl shadow-indigo-200">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4" />
           </svg>
        </div>
        <div>
           <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Technical Level Judged: Level {userProfile?.currentLevel || '?'}</h2>
           <p className="text-slate-700 dark:text-slate-400 font-bold max-w-sm mt-2">Entering industry context benchmarks to finalize your roadmap...</p>
        </div>
      </div>
    );
  }

  if (loading || !currentQ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
        <p className="text-slate-800 dark:text-slate-300 font-bold">Adapting to your response...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider border dark:border-indigo-800 transition-colors">
            Phase 1: Technical Diagnostic
          </div>
          <div className="h-2 w-32 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500" 
              style={{ width: `${Math.min((history.length / 10) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-10 transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
          {currentQ.text}
        </h2>
        <div className="space-y-4">
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setSelectedOption(i)}
              className={`w-full text-left p-6 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                selectedOption === i 
                  ? 'border-indigo-700 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' 
                  : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 font-bold text-sm transition-colors ${
                selectedOption === i ? 'bg-indigo-700 dark:bg-indigo-600 border-indigo-700 dark:border-indigo-600 text-white shadow-md' : 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
              }`}>
                {String.fromCharCode(65 + i)}
              </div>
              <span className={`text-lg font-bold transition-colors ${selectedOption === i ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-300'}`}>
                {opt.text}
              </span>
            </button>
          ))}
        </div>
        <button
          disabled={selectedOption === null}
          onClick={handleAnswer}
          className={`w-full py-5 rounded-2xl font-bold text-lg transition-all shadow-xl ${
            selectedOption === null ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-600 shadow-none cursor-not-allowed' : 'bg-slate-900 dark:bg-indigo-700 text-white hover:bg-black dark:hover:bg-indigo-800'
          }`}
        >
          Confirm Answer
        </button>
      </div>
    </div>
  );
};

export default AssessmentRoom;
