import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Award, 
  Compass, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Cpu, 
  Flame,
  CheckCircle,
  Zap
} from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, catRes] = await Promise.all([
          api.get('/events'),
          api.get('/events/categories')
        ]);
        if (eventsRes?.data) {
          setFeaturedEvents(eventsRes.data.slice(0, 3));
        }
        if (catRes?.data) {
          setCategories(catRes.data);
        }
      } catch (err) {
        console.error('Error fetching landing data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="space-y-24">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 lg:pt-12 text-center max-w-4xl mx-auto space-y-8">
        
        {/* Editorial Eyebrow Tag */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-violet/10 border border-brand-lavender/40 text-brand-violet text-xs font-bold tracking-wider uppercase shadow-sm">
          <Sparkles className="w-4 h-4 text-brand-coral" />
          <span>The Next Generation Collegiate Experience</span>
        </div>

        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-brand-charcoal leading-[1.1]">
            Discover. Participate. <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-violet via-brand-lavender to-brand-coral">Connect.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-normal">
            No more scattered WhatsApp messages or missed poster boards. One verified hub for hackathons, club masterclasses, concerts, and leadership summits across your campus.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative flex items-center bg-white rounded-2xl p-2 shadow-elevated border border-brand-lavender/40">
            <Search className="w-6 h-6 text-brand-violet ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, AI workshops, musical nights, robotics..."
              className="w-full px-4 py-2.5 text-sm sm:text-base text-brand-charcoal placeholder-gray-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-violet text-white font-semibold text-sm hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all shrink-0"
            >
              Explore
            </button>
          </div>
        </form>

        {/* Stats Pill Row */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-coral" />
            <span>100% Verified University Events</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-coral" />
            <span>Interest-Based Match Engine</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-brand-coral" />
            <span>Campus Passport & Verified XP</span>
          </div>
        </div>
      </section>

      {/* 2. FEATURED UPCOMING EVENTS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-lavender/20 pb-4">
          <div>
            <div className="text-xs uppercase tracking-widest font-bold text-brand-violet">Curated For You</div>
            <h2 className="font-display font-bold text-3xl text-brand-charcoal mt-1">Featured Campus Events</h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-sm font-bold text-brand-violet hover:text-brand-coral transition-colors"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Curating upcoming campus experiences..." />
        ) : featuredEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No events currently scheduled.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 3. BROWSE BY CATEGORIES */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-brand-violet">Diverse Opportunities</div>
          <h2 className="font-display font-bold text-3xl text-brand-charcoal">Explore by Category</h2>
          <p className="text-sm text-gray-600">Find events aligned with your academic journey and passions.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/events?categoryId=${cat.id}`}
              className="group p-5 bg-white rounded-2xl border border-brand-lavender/30 shadow-soft hover:shadow-elevated hover:border-brand-violet/50 transition-all text-center flex flex-col items-center space-y-3 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-lavender/20 group-hover:bg-brand-violet group-hover:text-white text-brand-violet flex items-center justify-center transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-sm text-brand-charcoal group-hover:text-brand-violet transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. DIFFERENTIATING FEATURE 1: RECOMMENDATIONS EXPLAINED */}
      <section className="bg-gradient-to-br from-brand-violet/5 via-white to-brand-coral/5 rounded-3xl p-8 sm:p-12 border border-brand-lavender/30 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-coral/15 text-brand-coral text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>Smart Match Algorithm</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-charcoal leading-tight">
              Events That Match Your Exact Interests
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              When you select interests like <strong className="text-brand-violet">Artificial Intelligence, Coding, or Entrepreneurship</strong>, our Java recommendation engine calculates real-time weighted affinity scores between your preferences and event metadata.
            </p>
            <ul className="space-y-3 text-sm text-brand-charcoal font-medium">
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center text-xs font-bold">1</span>
                <span>Weighted matching on categories, tags, and technical focus</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center text-xs font-bold">2</span>
                <span>Transparent explainability: always see why an event was curated</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-brand-violet/10 text-brand-violet flex items-center justify-center text-xs font-bold">3</span>
                <span>Instantly updates when you adjust your profile interests</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-elevated border border-brand-lavender/30 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-bold text-brand-charcoal uppercase tracking-wider">Algorithm Preview</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">96% Affinity</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-gray-500 font-semibold">STUDENT PREFERENCES:</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-brand-violet/10 text-brand-violet text-xs font-bold">Artificial Intelligence</span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-violet/10 text-brand-violet text-xs font-bold">Coding</span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-violet/10 text-brand-violet text-xs font-bold">Technology</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-brand-warm border border-brand-lavender/30 space-y-2">
              <div className="text-xs font-bold text-brand-charcoal">Recommended Event:</div>
              <div className="text-sm font-bold text-brand-violet">CampusHack 2026: GenAI & Web3 Sprint</div>
              <div className="text-[11px] text-brand-coral font-medium flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>"Recommended because you are interested in Artificial Intelligence & Coding"</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIFFERENTIATING FEATURE 2: CAMPUS PASSPORT */}
      <section className="bg-brand-charcoal text-brand-warm rounded-3xl p-8 sm:p-12 border border-brand-violet/30 shadow-elevated relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-coral/20 text-brand-coral text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Campus Passport Gamification</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              Your Verified Collegiate Passport
            </h2>
            <p className="text-sm sm:text-base text-brand-warm/80 leading-relaxed">
              Earn XP points, unlock collectible achievement badges, and level up from <strong>Novice</strong> to <strong>Campus Legend</strong>. Points are awarded exclusively upon verified event attendance by college administration.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <div className="font-display font-bold text-2xl text-brand-coral">50+ XP</div>
                <div className="text-xs text-brand-warm/60">Per Verified Event</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <div className="font-display font-bold text-2xl text-brand-lavender">6 Badges</div>
                <div className="text-xs text-brand-warm/60">Milestones to Unlock</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                <div className="font-display font-bold text-2xl text-emerald-400">100%</div>
                <div className="text-xs text-brand-warm/60">Dean Verified</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-brand-lavender font-bold uppercase">Student Level</div>
                  <div className="text-xl font-display font-bold text-white">Explorer (Level 2)</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-brand-warm/60">Total Score</div>
                  <div className="text-xl font-bold text-brand-coral">150 XP</div>
                </div>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-brand-violet to-brand-coral h-full rounded-full" style={{ width: '60%' }} />
              </div>
              <div className="text-xs text-brand-warm/60 text-right">100 XP to Achiever Level</div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-white/5 border border-brand-coral/30 text-center space-y-1">
                <div className="text-lg">👣</div>
                <div className="text-[11px] font-bold text-white truncate">First Step</div>
                <div className="text-[9px] text-emerald-400">UNLOCKED</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-brand-lavender/30 text-center space-y-1">
                <div className="text-lg">🧭</div>
                <div className="text-[11px] font-bold text-white truncate">Explorer</div>
                <div className="text-[9px] text-emerald-400">UNLOCKED</div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1 opacity-60">
                <div className="text-lg">⚡</div>
                <div className="text-[11px] font-bold text-white truncate">Enthusiast</div>
                <div className="text-[9px] text-gray-400">LOCKED (5 Events)</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="text-center py-12 space-y-6">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-brand-charcoal">
          Ready to Connect With Your Campus?
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm sm:text-base">
          Join hundreds of students and organizers discovering meaningful collegiate events every day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-2xl bg-brand-violet text-white font-bold text-base hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all"
          >
            Create Student Account
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-2xl bg-white text-brand-violet border border-brand-lavender/40 font-bold text-base hover:bg-brand-lavender/10 shadow-soft transition-all"
          >
            Sign In with Demo
          </Link>
        </div>
      </section>
    </div>
  );
}
