
import React, { useState, useEffect } from 'react';
import { Mentor, MentorRequest, UserProfile, ReadinessProfile } from '../types';

const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Drasner',
    role: 'Staff Engineer',
    company: 'Google',
    field: 'Fullstack Development',
    skills: ['React', 'Node.js', 'System Design'],
    experience: '12+ Years',
    mentoringFocus: ['Roadmap Review', 'Technical Architecture', 'Career Strategy'],
    bio: 'Specializing in scalable frontend architectures and developer productivity. I help students move from "it works" to "it scales".',
    likes: 420,
    recommendations: 89
  },
  {
    id: 'm2',
    name: 'David Malan',
    role: 'Lead AI Researcher',
    company: 'OpenAI',
    field: 'Data Science',
    skills: ['Python', 'PyTorch', 'LLMs'],
    experience: '8 Years',
    mentoringFocus: ['Project Review', 'Conceptual Deep-dives', 'Algorithm Mastery'],
    bio: 'Passionate about demystifying complex logic. If you are stuck on high-level patterns, let\'s break them down together.',
    likes: 312,
    recommendations: 56
  },
  {
    id: 'm3',
    name: 'Marcus Holloway',
    role: 'Senior DevOps Architect',
    company: 'Netflix',
    field: 'DevOps',
    skills: ['Kubernetes', 'AWS', 'Terraform'],
    experience: '10 Years',
    mentoringFocus: ['Workflow Optimization', 'System Reliability', 'Industry Readiness'],
    bio: 'Infrastructure is the backbone of production. I mentor on the transition from coding locally to deploying globally.',
    likes: 215,
    recommendations: 41
  }
];

const MentorDashboard: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);
  const [filter, setFilter] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    focus: 'Technical Gaps',
    notes: ''
  });

  const [existingRequests, setExistingRequests] = useState<MentorRequest[]>([]);

  useEffect(() => {
    const storedRequests = localStorage.getItem('btl_mentor_requests');
    if (storedRequests) setExistingRequests(JSON.parse(storedRequests));
    
    const userProfile = localStorage.getItem('btl_user_profile');
    if (userProfile) {
      const u = JSON.parse(userProfile);
      setFormData(prev => ({ ...prev, name: u.name, email: u.email || '' }));
    }
  }, []);

  const handleFilter = (f: string) => {
    setFilter(f);
    if (f === 'All') {
      setMentors(MOCK_MENTORS);
    } else {
      setMentors(MOCK_MENTORS.filter(m => m.field === f));
    }
  };

  const submitRequest = () => {
    if (!selectedMentor) return;

    const profileStr = localStorage.getItem('btl_readiness_profile');
    const profile: ReadinessProfile | null = profileStr ? JSON.parse(profileStr) : null;

    const newRequest: MentorRequest = {
      id: `req_${Date.now()}`,
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      userId: 'user_123',
      userName: formData.name,
      userEmail: formData.email,
      discussionFocus: formData.focus,
      userNotes: formData.notes,
      status: 'Submitted',
      timestamp: Date.now(),
      bundledContext: {
        domain: profile?.benchmarks[0]?.role || 'Unknown',
        readinessStatus: profile?.status || 'Foundation Building',
        topGap: profile?.gapClarity || 'Not Analyzed'
      }
    };

    const updated = [...existingRequests, newRequest];
    setExistingRequests(updated);
    localStorage.setItem('btl_mentor_requests', JSON.stringify(updated));
    
    setIsRequesting(false);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Mentor Ecosystem</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 font-medium max-w-2xl">
            Thoughtful guidance from industry veterans. Submit a request to review your gaps, 
            roadmap, or project strategy. Mentors respond with contextual feedback via email.
          </p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          {['All', 'Fullstack Development', 'Data Science', 'DevOps'].map(f => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              {f === 'Fullstack Development' ? 'Fullstack' : f}
            </button>
          ))}
        </div>
      </header>

      {/* Existing Requests Banner */}
      {existingRequests.length > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-4">Your Guidance Requests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingRequests.map(req => (
              <div key={req.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{req.mentorName}</p>
                  <p className="text-xs text-slate-500 font-medium">{new Date(req.timestamp).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'Submitted' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800' : 'bg-emerald-100 text-emerald-700'}`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map(mentor => (
          <div key={mentor.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="p-8 space-y-6 flex-1">
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  👤
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                    <span className="text-xs">★</span> {mentor.recommendations}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommendations</div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{mentor.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{mentor.role} @ {mentor.company}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {mentor.skills.map(s => (
                  <span key={s} className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100 dark:border-slate-700 transition-colors">
                    {s}
                  </span>
                ))}
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                {mentor.bio}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{mentor.experience} Exp.</span>
              <button 
                onClick={() => setSelectedMentor(mentor)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedMentor && !isRequesting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border dark:border-slate-800">
            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center text-4xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{selectedMentor.name}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">{selectedMentor.role} @ {selectedMentor.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMentor(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">About Mentorship</h4>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  {selectedMentor.bio}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-widest">Mentoring Strengths</h4>
                  <ul className="space-y-2">
                    {selectedMentor.mentoringFocus.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border dark:border-slate-800 transition-colors">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Community Pulse</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">Recommended</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{selectedMentor.recommendations} users</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">Helpful Signal</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{selectedMentor.likes} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <p className="text-xs text-indigo-800 dark:text-indigo-300 font-bold leading-relaxed italic text-center">
                  "Mentorship provides directional guidance and perspective. Success remains dependent on your consistent execution of the suggested roadmap."
                </p>
              </div>

              <button 
                onClick={() => setIsRequesting(true)}
                className="w-full bg-slate-900 dark:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black dark:hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
              >
                Request Mentor Guidance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Form Modal */}
      {isRequesting && selectedMentor && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-lg w-full overflow-hidden border dark:border-slate-800">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center transition-colors">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Guidance Request</h3>
                <p className="text-sm text-slate-500 font-medium">To: {selectedMentor.name}</p>
              </div>
              <button onClick={() => setIsRequesting(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Your Name</label>
                  <input 
                    readOnly
                    type="text" 
                    value={formData.name}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Preferred Focus</label>
                  <select 
                    value={formData.focus}
                    onChange={e => setFormData({...formData, focus: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                  >
                    <option>Technical Gaps</option>
                    <option>Roadmap Priority</option>
                    <option>Project Feedback</option>
                    <option>Industry Readiness</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Discussion Context</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="E.g. I am struggling with mapping my conceptual understanding of React to actual production patterns..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
                />
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center transition-colors">
                * Your Readiness Profile scores will be attached automatically
              </div>

              <button 
                onClick={submitRequest}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Pop-up */}
      {isSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl max-w-md w-full overflow-hidden border dark:border-slate-800">
            <div className="bg-emerald-600 p-12 text-center text-white relative">
              <div className="w-20 h-20 bg-white/20 rounded-full mx-auto flex items-center justify-center mb-6 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-3xl font-bold mb-2">Request Sent</h3>
              <p className="text-emerald-100 font-bold uppercase text-xs tracking-widest">Asynchronous Validation Active</p>
            </div>
            
            <div className="p-10 space-y-6 text-center">
              <p className="text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                Your request and readiness profile have been queued for review. 
                Expect a contextual response from <span className="text-indigo-600 dark:text-indigo-400">{selectedMentor?.name}</span> via email within <span className="underline">2–3 working days</span>.
              </p>
              <button 
                onClick={() => { setIsSuccess(false); setSelectedMentor(null); }}
                className="w-full bg-slate-900 dark:bg-slate-800 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;
