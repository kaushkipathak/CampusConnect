import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Flame, 
  Compass, 
  Footprints, 
  Zap, 
  Trophy, 
  Cpu 
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const getBadgeIcon = (iconName) => {
  switch (iconName) {
    case 'Footprints': return <Footprints className="w-8 h-8" />;
    case 'Compass': return <Compass className="w-8 h-8" />;
    case 'Zap': return <Zap className="w-8 h-8" />;
    case 'Trophy': return <Trophy className="w-8 h-8" />;
    case 'Cpu': return <Cpu className="w-8 h-8" />;
    case 'Sparkles': return <Sparkles className="w-8 h-8" />;
    default: return <Award className="w-8 h-8" />;
  }
};

export default function CampusPassportPage() {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/student/passport')
      .then((res) => {
        if (res?.data) {
          setPassport(res.data);
        }
      })
      .catch((err) => console.error('Failed to load passport', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingSpinner message="Validating your Campus Passport records & verified achievements..." />;
  }

  if (!passport) {
    return (
      <div className="text-center py-20 text-gray-500">
        Passport details unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      
      {/* 1. PASSPORT HERO HEADER */}
      <section className="bg-gradient-to-br from-brand-charcoal via-[#3D374D] to-brand-violet text-brand-warm rounded-3xl p-8 sm:p-12 shadow-elevated border border-brand-violet/40 relative overflow-hidden">
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-coral/20 text-brand-coral text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Collegiate Participation Credential</span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white">
              Campus <span className="text-brand-coral">Passport</span>
            </h1>
            
            <p className="text-sm text-brand-warm/80 leading-relaxed">
              Your verified collegiate record. Every point represents verified attendance validated by College Administration.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-xs text-brand-lavender">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Anti-Tamper Database Ledger</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-brand-coral" />
                <span>Dean Verified</span>
              </span>
            </div>
          </div>

          {/* Level & Total XP Badge */}
          <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 min-w-[280px] space-y-4 text-center md:text-left">
            <div>
              <span className="text-[11px] font-bold text-brand-lavender uppercase tracking-widest block">
                Current Level
              </span>
              <div className="font-display font-black text-3xl text-white mt-0.5">
                {passport.currentLevel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-brand-warm/90 font-semibold">
                <span>Experience Score</span>
                <span className="text-brand-coral font-bold">{passport.totalXp} XP</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-coral to-yellow-300 h-full rounded-full transition-all duration-700"
                  style={{ width: `${passport.progressPercentage}%` }}
                />
              </div>
              <div className="text-[11px] text-brand-warm/60 text-right">
                Next Tier: {passport.nextLevelXp} XP ({100 - passport.progressPercentage}% remaining)
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-center">
              <div>
                <div className="font-display font-bold text-xl text-white">{passport.eventsAttended}</div>
                <div className="text-[10px] text-brand-warm/60 uppercase">Attended Events</div>
              </div>
              <div>
                <div className="font-display font-bold text-xl text-brand-coral">{passport.badgesEarned}</div>
                <div className="text-[10px] text-brand-warm/60 uppercase">Badges Earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ACHIEVEMENTS & BADGES SHOWCASE */}
      <section className="space-y-6">
        <div>
          <div className="text-xs uppercase font-bold text-brand-violet tracking-wider">Achievement Gallery</div>
          <h2 className="font-display font-bold text-2xl text-brand-charcoal">
            Collectible Campus Badges
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Badges unlock automatically when your verified attendance meets milestone requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {passport.badges?.map((badge) => {
            const isEarned = badge.earned;
            return (
              <div
                key={badge.id}
                className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isEarned
                    ? 'bg-white border-brand-violet/30 shadow-elevated'
                    : 'bg-gray-50/70 border-gray-200 opacity-70'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform ${
                        isEarned
                          ? 'bg-gradient-to-tr from-brand-violet to-brand-coral text-white shadow-soft scale-105'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {getBadgeIcon(badge.icon)}
                    </div>

                    {isEarned ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Unlocked</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span>Locked</span>
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-lg text-brand-charcoal">{badge.name}</h3>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] text-gray-500 flex justify-between items-center">
                  <span>Target: {badge.requiredEvents} Event(s) or {badge.requiredXp} XP</span>
                  {isEarned && badge.earnedAt && (
                    <span className="text-brand-violet font-semibold">
                      Earned {new Date(badge.earnedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. POINTS TRANSACTION LEDGER */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-6">
        <div>
          <div className="text-xs uppercase font-bold text-brand-violet tracking-wider">Audit Log</div>
          <h2 className="font-display font-bold text-xl text-brand-charcoal">
            Verified Points History
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Detailed ledger of all XP points awarded to your student account.
          </p>
        </div>

        {passport.history?.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400">
            No verified attendance history yet. Attend your upcoming registered events to earn points!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Event / Activity</th>
                  <th className="pb-3">Verification Details</th>
                  <th className="pb-3">Date Awarded</th>
                  <th className="pb-3 text-right">Points Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {passport.history?.map((record) => (
                  <tr key={record.id} className="hover:bg-brand-warm/60 transition-colors">
                    <td className="py-3.5 font-bold text-brand-charcoal">
                      {record.eventTitle}
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {record.reason}
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(record.awardedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3.5 text-right font-extrabold text-emerald-600">
                      +{record.points} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
