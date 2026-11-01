import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export default function EventCard({ event }) {
  const isRegistered = event.registered;
  const isFull = event.remainingSeats <= 0;
  const fillPercentage = Math.min(100, Math.round((event.currentRegistrations / event.maxCapacity) * 100));

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-brand-lavender/30 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      
      {/* Poster Image & Tags */}
      <div className="relative h-48 w-full overflow-hidden bg-brand-violet/10">
        <img
          src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-brand-violet shadow-sm backdrop-blur-md">
            {event.categoryName}
          </span>
        </div>

        {/* Registered status indicator */}
        {isRegistered && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registered</span>
          </div>
        )}

        {/* Recommendation explanation chip */}
        {event.recommendationReason && event.recommendationScore > 1.0 && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-charcoal/90 text-brand-coral text-[11px] font-semibold backdrop-blur-md border border-brand-coral/30">
              <Sparkles className="w-3.5 h-3.5 text-brand-coral shrink-0" />
              <span className="truncate">{event.recommendationReason}</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg text-brand-charcoal group-hover:text-brand-violet transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>

          <div className="mt-3 space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-brand-violet shrink-0" />
              <span>{new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-brand-violet shrink-0" />
              <span>{event.startTime?.substring(0, 5)} - {event.endTime?.substring(0, 5)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-brand-coral shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Capacity Bar & Action */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-brand-violet" />
                <span>Seats remaining:</span>
              </span>
              <span className={isFull ? 'text-red-500 font-bold' : 'text-brand-charcoal font-bold'}>
                {isFull ? 'Sold Out' : `${event.remainingSeats} of ${event.maxCapacity}`}
              </span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-red-500' : fillPercentage > 80 ? 'bg-amber-400' : 'bg-brand-violet'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
          </div>

          <Link
            to={`/events/${event.id}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-brand-violet bg-brand-violet/10 hover:bg-brand-violet hover:text-white transition-all shadow-sm group-hover:shadow-soft"
          >
            View Event Details
          </Link>
        </div>
      </div>
    </div>
  );
}
