import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, LogIn, AlertCircle, Shield, Briefcase, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'COLLEGE_ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'ORGANIZER') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl p-8 border border-brand-lavender/30 shadow-elevated space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-coral text-white shadow-soft">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-2xl text-brand-charcoal">Welcome Back</h1>
          <p className="text-xs text-gray-500">Sign in to your CampusConnect portal</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
              College Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. amit.student@campusconnect.edu"
              className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-violet text-white font-bold text-sm hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* QUICK DEMO SWITCHER */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center">
            ⚡ 1-Click Evaluation Accounts
          </div>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('amit.student@campusconnect.edu', 'password123')}
              className="p-2.5 rounded-xl bg-brand-lavender/15 hover:bg-brand-lavender/30 text-brand-charcoal text-xs flex items-center justify-between transition-colors border border-brand-lavender/30 text-left"
            >
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-4 h-4 text-brand-violet" />
                <div>
                  <div className="font-bold">Student: Amit Kumar (CSE)</div>
                  <div className="text-[10px] text-gray-500">Interest-based discovery & Campus Passport</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-brand-violet uppercase">Select</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('robotics@campusconnect.edu', 'password123')}
              className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-brand-charcoal text-xs flex items-center justify-between transition-colors border border-purple-200 text-left"
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-purple-700" />
                <div>
                  <div className="font-bold">Organizer: Robotics Club</div>
                  <div className="text-[10px] text-gray-500">Submit events, manage own participants</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-purple-700 uppercase">Select</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin@campusconnect.edu', 'password123')}
              className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-brand-charcoal text-xs flex items-center justify-between transition-colors border border-amber-200 text-left"
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-amber-700" />
                <div>
                  <div className="font-bold">Administration: Dean of Affairs</div>
                  <div className="text-[10px] text-gray-500">Approve/reject events, verify attendance</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-700 uppercase">Select</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-violet hover:underline">
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
}
