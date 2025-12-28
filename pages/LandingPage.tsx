
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-950 transition-colors duration-200 min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden pt-20 pb-32" 
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm font-bold mb-8 border border-indigo-100 dark:border-indigo-800">
            <span className="w-2 h-2 rounded-full bg-indigo-600" aria-hidden="true"></span>
            Industry Readiness Intelligence
          </div>
          <h1 
            id="hero-heading"
            className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight transition-colors"
          >
            Know where you stand <br/>
            <span className="text-indigo-700 dark:text-indigo-500">before it's too late.</span>
          </h1>
          <p className="text-xl text-slate-800 dark:text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto font-bold transition-colors">
            Stop guessing your readiness. BreakTheLoop diagnoses your conceptual gaps, 
            practical skills, and problem-solving maturity against real industry benchmarks.
          </p>
          <Link 
            to="/login"
            aria-label="Start your free industry readiness diagnostics"
            className="inline-block bg-slate-900 dark:bg-indigo-700 text-white text-lg font-bold px-10 py-4 rounded-2xl hover:bg-black dark:hover:bg-indigo-800 transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:-translate-y-1 focus:ring-4 focus:ring-indigo-500 focus:outline-none"
          >
            Start Free Diagnostics
          </Link>
          <p className="mt-6 text-sm text-slate-700 dark:text-slate-400 font-bold">
            No exams. No grades. Just pure signal.
          </p>
        </div>
        
        {/* Abstract BG elements */}
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-50 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"
          aria-hidden="true"
        ></div>
      </section>

      {/* About Levels Section */}
      <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white transition-colors">Three Stages of Mastery</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Our AI assesses your current signals and places you in the appropriate level to maximize your growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Level 1 */}
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold mb-6">1</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Foundational Engineer</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Master the core of the web. Focus on semantic HTML, modern CSS layouts, and the fundamentals of asynchronous JavaScript.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> HTML5 & CSS3</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> ES6+ JavaScript</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Responsive Design</li>
              </ul>
            </div>

            {/* Level 2 */}
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02] border-t-4 border-t-indigo-500">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold mb-6">2</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Fullstack (MERN) Specialist</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Build end-to-end applications. Learn React state management, Node.js server architecture, and database design.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> React & Redux</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Node & Express</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> MongoDB / SQL</li>
              </ul>
            </div>

            {/* Level 3 */}
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-all hover:scale-[1.02]">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold mb-6">3</div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Industrial/Job Ready</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Bridge the gap to senior roles. Focus on CI/CD pipelines, Docker containerization, and enterprise system design.
              </p>
              <ul className="space-y-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Docker & K8s</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> CI/CD Workflows</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Scalable Architectures</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center transition-colors">
        <p className="text-sm text-slate-700 dark:text-slate-400 font-bold transition-colors">
          &copy; {new Date().getFullYear()} BreakTheLoop Readiness Platform. Designed for the future of work.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
