import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Award
} from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, CONFIRMED, CANCELLED
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedEventToCancel, setSelectedEventToCancel] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackError, setFeedbackError] = useState(null);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/student/registrations');
      if (res?.data) {
        setRegistrations(res.data);
      }
    } catch (err) {
      console.error('Failed to load registrations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const openCancelModal = (event) => {
    setSelectedEventToCancel(event);
    setCancelModalOpen(true);
    setFeedbackMessage(null);
    setFeedbackError(null);
  };

  const confirmCancelRegistration = async () => {
    if (!selectedEventToCancel) return;

    try {
      setCancellingId(selectedEventToCancel.id);
      // Delete registration using event id or registration id
      await api.delete(`/registrations/${selectedEventToCancel.id}`);
      setFeedbackMessage(`Your registration for "${selectedEventToCancel.title}" has been cancelled.`);
      setCancelModalOpen(false);
      fetchRegistrations();
    } catch (err) {
      setFeedbackError(err.message || 'Failed to cancel registration');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === 'CONFIRMED') return reg.registered;
    if (activeTab === 'CANCELLED') return !reg.registered;
    return true;
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-brand-violet tracking-wider">Student Portal</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-charcoal">
            My Event Registrations
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track confirmed registrations, attendance verification, and Campus Passport badges.
          </p>
        </div>

        <Link
          to="/events"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all shadow-soft self-start sm:self-auto"
        >
          <span>Discover More Events</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {feedbackError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{feedbackError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-brand-lavender/30 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 transition-colors ${
            activeTab === 'ALL'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          All ({registrations.length})
        </button>
        <button
          onClick={() => setActiveTab('CONFIRMED')}
          className={`pb-3 transition-colors ${
            activeTab === 'CONFIRMED'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          Confirmed ({registrations.filter((r) => r.registered).length})
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`pb-3 transition-colors ${
            activeTab === 'CANCELLED'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          Cancelled ({registrations.filter((r) => !r.registered).length})
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <LoadingSpinner message="Loading your registration ledger..." />
      ) : filteredRegistrations.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-brand-lavender/30 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-lavender/20 text-brand-violet flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-brand-charcoal">No Registrations in this View</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Explore exciting campus hackathons, technical workshops, and social meetups to participate!
          </p>
          <Link
            to="/events"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-violet text-white text-xs font-bold shadow-soft"
          >
            Explore Events Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((item) => {
            const isConfirmed = item.registered;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-brand-lavender/30 shadow-soft hover:shadow-elevated transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Event Summary */}
                <div className="flex items-start space-x-4">
                  <img
                    src={item.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300'}
                    alt={item.title}
                    className="w-24 h-24 rounded-2xl object-cover shrink-0 border border-brand-lavender/30"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-lavender/20 text-brand-violet">
                        {item.categoryName}
                      </span>
                      {isConfirmed ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 flex items-center space-x-1">
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-bold text-lg text-brand-charcoal hover:text-brand-violet transition-colors">
                      <Link to={`/events/${item.id}`}>{item.title}</Link>
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-violet" />
                        <span>{new Date(item.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-brand-violet" />
                        <span>{item.startTime?.substring(0, 5)} - {item.endTime?.substring(0, 5)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-brand-coral" />
                        <span>{item.venue}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & QR link */}
                <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                  <Link
                    to={`/events/${item.id}`}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-brand-violet bg-brand-lavender/15 hover:bg-brand-lavender/30 transition-colors"
                  >
                    Event Page
                  </Link>

                  {isConfirmed && (
                    <button
                      onClick={() => openCancelModal(item)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      Cancel RSVP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CANCELLATION CONFIRMATION MODAL */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm RSVP Cancellation"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Are you sure you want to cancel your seat for <strong className="text-brand-charcoal">{selectedEventToCancel?.title}</strong>?
          </p>
          <p className="text-xs text-gray-500 bg-brand-warm p-3 rounded-xl border border-brand-lavender/30">
            This will release your reserved seat to another student and update the organizer's live participant roster.
          </p>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-3">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-brand-charcoal"
            >
              Keep My Seat
            </button>
            <button
              onClick={confirmCancelRegistration}
              disabled={cancellingId !== null}
              className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-all shadow-sm disabled:opacity-50"
            >
              {cancellingId !== null ? 'Cancelling...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
