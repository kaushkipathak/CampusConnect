import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    registrationNumber: '',
    department: 'Computer Science & Engineering',
    yearOfStudy: 1,
    password: '',
    confirmPassword: '',
    interestIds: []
  });

  const [availableInterests, setAvailableInterests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/student/interests/all')
      .then((res) => {
        if (res?.data) {
          setAvailableInterests(res.data);
        }
      })
      .catch((err) => console.error('Failed to load interests', err));
  }, []);

  const toggleInterest = (id) => {
    setFormData((prev) => {
      const exists = prev.interestIds.includes(id);
      return {
        ...prev,
        interestIds: exists
          ? prev.interestIds.filter((item) => item !== id)
          : [...prev.interestIds, id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.interestIds.length === 0) {
      setError('Please select at least 1 area of interest to activate your recommendation feed');
      return;
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'STUDENT',
        registrationNumber: formData.registrationNumber,
        department: formData.department,
        yearOfStudy: parseInt(formData.yearOfStudy, 10),
        interestIds: formData.interestIds
      });
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-lavender/30 shadow-elevated space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-coral text-white shadow-soft">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-3xl text-brand-charcoal">Join CampusConnect</h1>
          <p className="text-xs text-gray-500">Create your student passport and personalized event feed</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-violet uppercase tracking-wider pb-1 border-b border-brand-lavender/30">
              1. Personal & Account Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">College Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. alex.m@university.edu"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Profile */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-violet uppercase tracking-wider pb-1 border-b border-brand-lavender/30">
              2. Academic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">Registration No.</label>
                <input
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  placeholder="e.g. REG2024CS089"
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-bold text-brand-charcoal">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Design & Architecture">Design & Architecture</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-charcoal">Year of Study</label>
                <select
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-lavender/40 text-sm focus:ring-2 focus:ring-brand-violet/50 outline-none bg-white"
                >
                  <option value={1}>1st Year (Freshman)</option>
                  <option value={2}>2nd Year (Sophomore)</option>
                  <option value={3}>3rd Year (Junior)</option>
                  <option value={4}>4th Year (Senior)</option>
                  <option value={5}>5th Year (Postgrad)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Select Interests for Smart Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-brand-lavender/30">
              <h3 className="text-xs font-bold text-brand-violet uppercase tracking-wider">
                3. Your Areas of Interest
              </h3>
              <span className="text-[11px] text-brand-coral font-semibold">
                {formData.interestIds.length} selected
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Select what excites you. Our Java engine uses this to calculate match scores for hackathons, workshops, and fests.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {availableInterests.map((interest) => {
                const selected = formData.interestIds.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                      selected
                        ? 'bg-brand-violet text-white shadow-soft scale-105'
                        : 'bg-brand-lavender/15 text-brand-charcoal hover:bg-brand-lavender/30 border border-brand-lavender/30'
                    }`}
                  >
                    <span>{interest.name}</span>
                    {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-violet text-white font-bold text-sm hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Your Profile...' : 'Complete Registration & Open Campus Hub'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-brand-violet hover:underline">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
}
