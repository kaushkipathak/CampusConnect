import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  Award, 
  Calendar, 
  ArrowRight, 
  Compass, 
  Sliders, 
  CheckCircle2, 
  TrendingUp,
  Search
} from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [passport, setPassport] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Interest edit modal state
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);
  const [savingInterests, setSavingInterests] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profileRes, passportRes, recRes, eventsRes, interestsRes] = await Promise.all([
        api.get('/student/profile'),
        api.get('/student/passport'),
        api.get('/student/recommendations'),
        api.get('/events'),
        api.get('/student/interests/all')
      ]);

      if (profileRes?.data) {
        setProfile(profileRes.data);
        setSelectedInterestIds(profileRes.data.interests?.map((i) => i.id) || []);
      }
      if (passportRes?.data) setPassport(passportRes.data);
      if (recRes?.data) setRecommendations(recRes.data);
      if (eventsRes?.data) setAllEvents(eventsRes.data);
      if (interestsRes?.data) setAllInterests(interestsRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateInterests = async () => {
    try {
      setSavingInterests(true);
      await api.put('/student/profile', {
        interestIds: selectedInterestIds,
      });
      setIsInterestsModalOpen(false);
      // Reload recommendations with new weighted scores
      const recRes = await api.get('/student/recommendations');
      if (recRes?.data) setRecommendations(recRes.data);
      const profRes = await api.get('/student/profile');
      if (profRes?.data) setProfile(profRes.data);
    } catch (err) {
      console.error('Failed to update interests', err);
    } finally {
      setSavingInterests(false);
    }
  };

  const toggleInterest = (id) => {
    setSelectedInterestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (loading) {
    return <LoadingSpinner message="Assembling your personalized campus dashboard..." />;
  }

  return (
    <div className="space-y-10">
      
      {/* 1. WELCOME BANNER & CAMPUS PASSPORT SNAPSHOT */}
      <section className="bg-gradient-to-r from-brand-violet via-[#8660B8] to-brand-coral rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Student Discovery Portal</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl">
              Hello, {user?.fullName || 'Student'}! 👋
            </h1>
            <p className="text-sm text-brand-warm/90 leading-relaxed">
              {profile?.department} • Year {profile?.yearOfStudy} • Reg: {profile?.registrationNumber}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-white/80 font-medium">Your Active Interests:</span>
              {profile?.interests?.slice(0, 4).map((interest) => (
                <span
                  key={interest.id}
                  className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-semibold backdrop-blur-sm"
                >
                  {interest.name}
                </span>
              ))}
              <button
                onClick={() => setIsInterestsModalOpen(true)}
                className="text-xs underline font-bold hover:text-yellow-200 transition-colors ml-1"
              >
                + Edit Interests
              </button>
            </div>
          </div>

          {/* Quick Passport Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl min-w-[280px] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider">Campus Passport</span>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-yellow-300 text-brand-charcoal">
                {passport?.currentLevel || 'Novice'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-brand-warm/80">
                <span>Total XP</span>
                <span className="font-bold text-white">{passport?.totalXp || 0} XP</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-yellow-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${passport?.progressPercentage || 10}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-brand-warm/80 pt-1">
              <span>{passport?.eventsAttended || 0} Verified Events</span>
              <Link to="/student/passport" className="font-bold text-yellow-300 hover:underline">
                View Full Passport →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTEREST-BASED RECOMMENDATIONS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-coral" />
              <h2 className="font-display font-bold text-2xl text-brand-charcoal">
                Curated Recommendations For You
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ranked dynamically by matching your selected academic and extracurricular interests with event tags.
            </p>
          </div>

          <button
            onClick={() => setIsInterestsModalOpen(true)}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold text-brand-violet bg-brand-violet/10 hover:bg-brand-violet hover:text-white transition-all shrink-0 self-start sm:self-auto"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tune Interests</span>
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-500 border border-brand-lavender/30">
            No recommendations currently found. Select more interests to expand your feed!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.slice(0, 3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 3. ALL UPCOMING APPROVED EVENTS */}
      <section className="space-y-6 pt-4 border-t border-brand-lavender/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-brand-charcoal">
              All Upcoming College Events
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Official events reviewed and approved by College Administration.
            </p>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold text-brand-violet hover:text-brand-coral flex items-center space-x-1"
          >
            <span>Search & Filters</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {allEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* MODAL: UPDATE STUDENT INTERESTS */}
      <Modal
        isOpen={isInterestsModalOpen}
        onClose={() => setIsInterestsModalOpen(false)}
        title="Personalize Your Event Feed"
      >
        <div className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Choose the areas you want CampusConnect to prioritize. The Java recommendation algorithm immediately adjusts your score rankings.
          </p>

          <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-1">
            {allInterests.map((interest) => {
              const isSelected = selectedInterestIds.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1 ${
                    isSelected
                      ? 'bg-brand-violet text-white shadow-soft scale-105'
                      : 'bg-brand-lavender/15 text-brand-charcoal hover:bg-brand-lavender/30 border border-brand-lavender/30'
                  }`}
                >
                  <span>{interest.name}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              onClick={() => setIsInterestsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-brand-charcoal"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateInterests}
              disabled={savingInterests}
              className="px-5 py-2 rounded-xl bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all shadow-soft disabled:opacity-50"
            >
              {savingInterests ? 'Recalculating Scores...' : 'Save & Refresh Feed'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
