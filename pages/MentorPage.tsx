
import React, { useState, useEffect } from 'react';
import { ReadinessProfile, UserProfile, MentorSessionBrief, MentorRequest } from '../types';
import { generateMentorBrief } from '../services/geminiService';
import { Link } from 'react-router-dom';

const MentorPage: React.FC = () => {
  const [profile, setProfile] = useState<ReadinessProfile | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [brief, setBrief] = useState<MentorSessionBrief | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'idle' | 'scheduling' | 'callback' | 'confirmed'>('idle');
  
  // Scheduling State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [duration, setDuration] = useState<30 | 45>(30);
  
  // Callback State
  const [callbackWindow, setCallbackWindow] = useState('24h');
  const [focusArea, setFocusArea] = useState('Technical Gaps');

  useEffect(() => {
    const init = async () => {
      const storedProfile = localStorage.getItem('btl_readiness_profile');
      const storedUser = localStorage.getItem('btl_user_profile');
      
      if (storedProfile && storedUser) {
        const p: ReadinessProfile = JSON.parse(storedProfile);
        const u: UserProfile = JSON.parse(storedUser);
        setProfile(p);
        setUser(u);
        
        const b = await generateMentorBrief(p, u);
        setBrief(b);
      }
      setLoading(false);
    };
    init();
  }, []);

  const handleConfirm = () => {
    // In a real app, this would send a request to a backend
    setView('confirmed');
  };

  const nextFiveDays = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    // Skip weekends
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });

  const timeSlots = ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM", "05:15 PM"];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-700 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-bold">Preparing session brief...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">No Assessment Data</h2>
        <p className="text-slate-500 mt-2 mb-8">Complete your industry diagnostic first to unlock mentor discussions.</p>
        <Link to="/check-in" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">Start Diagnostic</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Industry Mentorship</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 font-bold">Review gaps and accelerate your roadmap with a senior practitioner.</p>
        </div>
        <div className="hidden md:flex gap-4">
           <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border dark:border-slate-700 text-sm font-bold">
             Available Mentors: 4
           </div>
        </div>
      </header>

      {/* Dynamic Session Brief Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm transition-colors">
        <div className="bg-slate-900 p-8 md:p-10 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="flex-1 space-y-4">
                <span className="bg-indigo-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">AI Analysis Focus</span>
                <h3 className="text-2xl font-bold">Why you should meet this week</h3>
                <p className="text-slate-300 leading-relaxed font-bold">
                  {brief?.summary}
                </p>
             </div>
             <div className="w-full md:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">Recommended Topics</h4>
                <ul className="space-y-3">
                   {brief?.discussionTopics.map((topic, i) => (
                     <li key={i} className="flex gap-2 text-sm font-bold">
                       <span className="text-indigo-400">•</span>
                       {topic}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* ACTION 1: Direct Scheduling */}
        <section className={`bg-white dark:bg-slate-900 border-2 rounded-3xl transition-all p-8 space-y-8 ${view === 'scheduling' ? 'border-indigo-600 ring-4 ring-indigo-50 dark:ring-indigo-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Schedule Discussion</h3>
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950 rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
               </svg>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-4">Choose Date</label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {nextFiveDays.map(date => {
                  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = new Date(date).getDate();
                  const isSelected = selectedDate === date;
                  return (
                    <button 
                      key={date}
                      onClick={() => { setSelectedDate(date); setView('scheduling'); }}
                      className={`flex flex-col items-center min-w-[70px] p-4 rounded-2xl border-2 transition-all ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-300'}`}
                    >
                      <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>{dayName}</span>
                      <span className="text-lg font-bold mt-1">{dayNum}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <label className="text-xs font-bold uppercase text-slate-400 tracking-widest block mb-4">Available Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {timeSlots.map(slot => (
                    <button 
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${selectedTime === slot ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-600 text-indigo-700 dark:text-indigo-300' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-200'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
               <div className="flex gap-2">
                  <button onClick={() => setDuration(30)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${duration === 30 ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>30 min</button>
                  <button onClick={() => setDuration(45)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${duration === 45 ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>45 min</button>
               </div>
               <button 
                 disabled={!selectedDate || !selectedTime}
                 onClick={handleConfirm}
                 className={`px-8 py-3 rounded-xl font-bold transition-all ${(!selectedDate || !selectedTime) ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-100'}`}
               >
                 Confirm Booking
               </button>
            </div>
          </div>
        </section>

        {/* ACTION 2: Callback Request */}
        <section className={`bg-white dark:bg-slate-900 border-2 rounded-3xl transition-all p-8 space-y-8 ${view === 'callback' ? 'border-amber-600 ring-4 ring-amber-50 dark:ring-amber-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'}`}>
           <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Request a Callback</h3>
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950 rounded-xl flex items-center justify-center text-amber-700 dark:text-amber-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 005.455 5.455l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
               </svg>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
              Prefer to be contacted on your own terms? Leave your details and a mentor will reach out to schedule via email.
            </p>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Preferred Window</label>
                    <select 
                      onFocus={() => setView('callback')}
                      value={callbackWindow}
                      onChange={(e) => setCallbackWindow(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="24h">Next 24 Hours</option>
                      <option value="48h">Next 2-3 Days</option>
                      <option value="weekend">Over the Weekend</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Primary Focus</label>
                    <select 
                      onFocus={() => setView('callback')}
                      value={focusArea}
                      onChange={(e) => setFocusArea(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option>Technical Gaps</option>
                      <option>Project Strategy</option>
                      <option>Mock Interview</option>
                      <option>Roadmap Review</option>
                    </select>
                  </div>
               </div>
               
               <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Any specific questions?</label>
                  <textarea 
                    onFocus={() => setView('callback')}
                    placeholder="E.g. Help me understand the performance tradeoffs between CSR and SSR mentioned in my brief."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-amber-500 h-24 transition-colors"
                  ></textarea>
               </div>
            </div>

            <button 
              onClick={handleConfirm}
              className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-xl font-bold hover:bg-black transition-all"
            >
              Submit Callback Request
            </button>
          </div>
        </section>
      </div>

      <div className="bg-indigo-50 dark:bg-indigo-950/40 p-6 rounded-2xl flex items-start gap-4 border border-indigo-100 dark:border-indigo-800">
         <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
         </div>
         <div className="space-y-1">
            <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Session context is automated.</h4>
            <p className="text-sm text-indigo-800 dark:text-indigo-400 leading-relaxed font-bold">
              Your mentor will receive your full diagnostic history and roadmap focus areas 5 minutes before the call starts. You don't need to repeat your background.
            </p>
         </div>
      </div>

      {/* CONFIRMATION POP-UP */}
      {view === 'confirmed' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border dark:border-slate-800">
              <div className="bg-indigo-600 p-12 text-center text-white relative">
                 <div className="absolute top-4 right-4 opacity-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                 </div>
                 <div className="w-20 h-20 bg-white text-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                 </div>
                 <h3 className="text-3xl font-bold mb-2">Request Received!</h3>
                 <p className="text-indigo-100 font-bold">The Loop is tightening.</p>
              </div>
              
              <div className="p-10 space-y-8">
                 <div className="space-y-4">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-bold text-center">
                      We've notified our senior faculty. You'll receive a calendar invite or email confirmation within <span className="text-indigo-600 dark:text-indigo-400">4 business hours</span>.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center">
                       <p className="text-xs uppercase font-bold text-slate-400 mb-2">Meeting Link Placeholder</p>
                       <p className="font-mono text-sm text-slate-800 dark:text-slate-200">meet.google.com/btl-{Math.random().toString(36).substring(7)}</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-4">
                    <button 
                      onClick={() => setView('idle')}
                      className="flex-1 py-4 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-2xl hover:bg-black transition-colors"
                    >
                      Done
                    </button>
                 </div>
                 <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                    * Check your university email for the invite.
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MentorPage;
