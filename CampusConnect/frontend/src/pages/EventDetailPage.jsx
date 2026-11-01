import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Share2,
  Mail,
  Award
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user, isStudent } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}`);
      if (res?.data) {
        setEvent(res.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isStudent) {
      setErrorMessage('Only verified student accounts can register for campus events.');
      return;
    }

    try {
      setRegistering(true);
      setErrorMessage(null);
      await api.post(`/events/${id}/register`);
      setActionMessage('Registration Confirmed! 🎉 Your seat is secured and attendance has been scheduled for Campus Passport points.');
      // Refresh event details to reflect updated registration count and status
      fetchEventDetails();
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving event details and remaining seat capacity..." />;
  }

  if (!event) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-2xl font-bold font-display text-brand-charcoal">Event Not Found</h2>
        <p className="text-sm text-gray-500">{errorMessage || 'The requested event is not available.'}</p>
        <Link to="/events" className="inline-flex items-center space-x-2 text-sm font-bold text-brand-violet">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
      </div>
    );
  }

  const isFull = event.remainingSeats <= 0;
  const isRegistered = event.registered;
  const isDeadlinePassed = new Date(event.registrationDeadline) < new Date();
  const fillPercentage = Math.min(100, Math.round((event.currentRegistrations / event.maxCapacity) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to="/events"
          className="inline-flex items-center space-x-2 text-xs font-bold text-brand-violet hover:text-brand-coral transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Discovery</span>
        </Link>
      </div>

      {/* Hero Poster Banner */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-elevated border border-brand-lavender/30 bg-brand-charcoal">
        <img
          src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200'}
          alt={event.title}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal via-brand-charcoal/40 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/95 text-brand-violet backdrop-blur-md shadow-sm">
            {event.categoryName}
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Approved</span>
          </span>
        </div>

        {/* Floating Title and Overview */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-brand-warm/90 flex items-center space-x-2">
            <span>Organized by <strong className="text-brand-coral">{event.organizerName}</strong></span>
          </p>
        </div>
      </div>

      {/* Alerts */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2 shadow-sm animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Details & Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Schedule Information Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-brand-lavender/30 shadow-soft flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase">Event Date</div>
                <div className="text-sm font-bold text-brand-charcoal">
                  {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-lavender/30 shadow-soft flex items-start space-x-3">
              <Clock className="w-5 h-5 text-brand-violet shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase">Timing</div>
                <div className="text-sm font-bold text-brand-charcoal">
                  {event.startTime?.substring(0, 5)} - {event.endTime?.substring(0, 5)}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-brand-lavender/30 shadow-soft flex items-start space-x-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-brand-coral shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-gray-400 uppercase">Venue & Location</div>
                <div className="text-sm font-bold text-brand-charcoal">{event.venue}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-4">
            <h3 className="font-display font-bold text-xl text-brand-charcoal">About This Event</h3>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </div>

            {/* Tags */}
            {event.tags && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <span className="text-xs font-bold text-gray-400 uppercase">Tags & Domains</span>
                <div className="flex flex-wrap gap-2">
                  {event.tags.split(',').map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-brand-lavender/15 text-brand-violet text-xs font-semibold"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Eligibility & Guidelines */}
          <div className="bg-white rounded-3xl p-6 border border-brand-lavender/30 shadow-soft space-y-3">
            <h3 className="font-display font-bold text-lg text-brand-charcoal">Eligibility & Guidelines</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              <strong>Participant Scope:</strong> {event.eligibility}
            </p>
            <div className="text-xs text-gray-500 pt-2 border-t border-gray-100 flex items-center space-x-2">
              <Award className="w-4 h-4 text-brand-coral" />
              <span>Verified attendance awards <strong>+50 XP</strong> to your Campus Passport profile.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Card */}
        <div className="bg-white rounded-3xl p-6 border border-brand-lavender/40 shadow-elevated space-y-6 sticky top-28">
          <div>
            <span className="text-[11px] font-bold text-brand-violet uppercase tracking-wider block">
              Registration Status
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <div className="font-display font-bold text-2xl text-brand-charcoal">
                {isRegistered ? 'Seat Confirmed' : isFull ? 'Sold Out' : 'Open for RSVP'}
              </div>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="space-y-2 p-4 rounded-2xl bg-brand-warm border border-brand-lavender/30">
            <div className="flex justify-between text-xs font-medium text-gray-600">
              <span className="flex items-center space-x-1">
                <Users className="w-3.5 h-3.5 text-brand-violet" />
                <span>Seats Filled</span>
              </span>
              <span className="font-bold text-brand-charcoal">
                {event.currentRegistrations} / {event.maxCapacity}
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isFull ? 'bg-red-500' : 'bg-brand-violet'
                }`}
                style={{ width: `${fillPercentage}%` }}
              />
            </div>
            <div className="text-[11px] text-gray-500 text-right">
              {event.remainingSeats} remaining seats
            </div>
          </div>

          {/* Deadline indicator */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="font-semibold text-brand-charcoal">Registration Closes:</div>
            <div>
              {new Date(event.registrationDeadline).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Action Button */}
          {isRegistered ? (
            <div className="space-y-3">
              <div className="w-full py-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center font-bold text-sm flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>You are Registered!</span>
              </div>
              <Link
                to="/student/registrations"
                className="w-full block py-2.5 rounded-xl border border-brand-violet text-brand-violet text-center text-xs font-bold hover:bg-brand-violet/10 transition-colors"
              >
                Manage in My Registrations
              </Link>
            </div>
          ) : isDeadlinePassed ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-gray-200 text-gray-500 font-bold text-sm cursor-not-allowed"
            >
              Registration Closed
            </button>
          ) : isFull ? (
            <button
              disabled
              className="w-full py-3.5 rounded-xl bg-red-100 text-red-500 font-bold text-sm cursor-not-allowed"
            >
              Capacity Reached
            </button>
          ) : (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="w-full py-3.5 rounded-xl bg-brand-violet text-white font-bold text-sm hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all disabled:opacity-50"
            >
              {registering ? 'Securing Your Seat...' : 'Register Now (Free)'}
            </button>
          )}

          {/* Organizer Contact Card */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase">Organizer Help</div>
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <Mail className="w-3.5 h-3.5 text-brand-violet" />
              <span className="truncate">{event.organizerEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
