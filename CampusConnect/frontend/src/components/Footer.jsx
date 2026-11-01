import React from 'react';
import { Sparkles, Heart, Compass, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-warm pt-16 pb-12 mt-20 border-t border-brand-violet/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-violet to-brand-coral flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl text-white">Campus<span className="text-brand-coral">Connect</span></span>
            </div>
            <p className="text-xs text-brand-warm/70 leading-relaxed">
              Discover. Participate. Connect. A centralized digital ecosystem connecting students, clubs, and college administration.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-brand-lavender">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>All Systems Operational • Spring Boot & MySQL</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">Discovery</h4>
            <ul className="space-y-2 text-xs text-brand-warm/70">
              <li><Link to="/events" className="hover:text-brand-coral transition-colors">All College Events</Link></li>
              <li><Link to="/events?category=technical-coding" className="hover:text-brand-coral transition-colors">Hackathons & Coding</Link></li>
              <li><Link to="/events?category=workshops-seminars" className="hover:text-brand-coral transition-colors">Workshops & Masterclasses</Link></li>
              <li><Link to="/events?category=cultural-arts" className="hover:text-brand-coral transition-colors">Cultural & Concerts</Link></li>
            </ul>
          </div>

          {/* Platform Features */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">Features</h4>
            <ul className="space-y-2 text-xs text-brand-warm/70">
              <li><span className="text-brand-lavender">Interest-Based Engine</span></li>
              <li><span className="text-brand-lavender">Campus Passport & Badges</span></li>
              <li><span className="text-brand-lavender">Verified XP Points</span></li>
              <li><span className="text-brand-lavender">Role-Based Administration</span></li>
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="font-display font-semibold text-white text-sm tracking-wider uppercase mb-4">Stakeholders</h4>
            <ul className="space-y-2 text-xs text-brand-warm/70">
              <li><Link to="/login" className="hover:text-brand-coral transition-colors">Student Portal</Link></li>
              <li><Link to="/login" className="hover:text-brand-coral transition-colors">Club Organizer Space</Link></li>
              <li><Link to="/login" className="hover:text-brand-coral transition-colors">Dean & Administration</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-warm/60">
          <p>© {new Date().getFullYear()} CampusConnect. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Crafted for collegiate community impact with</span>
            <span className="text-brand-coral">♥</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
