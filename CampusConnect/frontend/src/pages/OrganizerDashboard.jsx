import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Users, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Edit3, 
  Check, 
  Filter,
  BarChart3,
  MapPin,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [myEvents, setMyEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit Event Form state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    categoryId: 1,
    posterUrl: '',
    eventDate: '',
    startTime: '09:00',
    endTime: '17:00',
    venue: '',
    eligibility: 'All Students',
    registrationDeadline: '',
    maxCapacity: 100,
    tags: ''
  });
  const [submittingEvent, setSubmittingEvent] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  // Participant Management state
  const [selectedEventForParticipants, setSelectedEventForParticipants] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participantsModalOpen, setParticipantsModalOpen] = useState(false);

  // Rejection Reason Modal
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [currentRejectionReason, setCurrentRejectionReason] = useState('');

  const loadOrganizerData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes, catRes] = await Promise.all([
        api.get('/organizer/dashboard'),
        api.get('/organizer/events'),
        api.get('/events/categories')
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (eventsRes?.data) setMyEvents(eventsRes.data);
      if (catRes?.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load organizer dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizerData();
  }, []);

  const openCreateModal = () => {
    setEditingEventId(null);
    setEventForm({
      title: '',
      description: '',
      categoryId: categories[0]?.id || 1,
      posterUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
      eventDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '16:00',
      venue: 'Main Auditorium Hall A',
      eligibility: 'Open to all students',
      registrationDeadline: new Date(Date.now() + 6 * 86400000).toISOString().slice(0, 16),
      maxCapacity: 120,
      tags: 'Technology, Innovation, Coding'
    });
    setFormError(null);
    setIsEventModalOpen(true);
  };

  const openEditModal = (event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      categoryId: event.categoryId,
      posterUrl: event.posterUrl || '',
      eventDate: event.eventDate,
      startTime: event.startTime?.substring(0, 5) || '10:00',
      endTime: event.endTime?.substring(0, 5) || '16:00',
      venue: event.venue,
      eligibility: event.eligibility || 'All Students',
      registrationDeadline: event.registrationDeadline?.slice(0, 16) || '',
      maxCapacity: event.maxCapacity,
      tags: event.tags || ''
    });
    setFormError(null);
    setIsEventModalOpen(true);
  };

  const handleEventFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setSubmittingEvent(true);

    try {
      const payload = {
        ...eventForm,
        categoryId: parseInt(eventForm.categoryId, 10),
        maxCapacity: parseInt(eventForm.maxCapacity, 10),
        startTime: eventForm.startTime.length === 5 ? `${eventForm.startTime}:00` : eventForm.startTime,
        endTime: eventForm.endTime.length === 5 ? `${eventForm.endTime}:00` : eventForm.endTime,
        registrationDeadline: eventForm.registrationDeadline.length === 16 ? `${eventForm.registrationDeadline}:00` : eventForm.registrationDeadline
      };

      if (editingEventId) {
        await api.put(`/organizer/events/${editingEventId}`, payload);
        setFormSuccess('Event updated and resubmitted for administration review.');
      } else {
        await api.post('/organizer/events', payload);
        setFormSuccess('Event submitted successfully! Waiting for College Administration approval.');
      }

      setIsEventModalOpen(false);
      loadOrganizerData();
    } catch (err) {
      setFormError(err.message || 'Failed to submit event');
    } finally {
      setSubmittingEvent(false);
    }
  };

  const viewParticipants = async (event) => {
    setSelectedEventForParticipants(event);
    setParticipantsModalOpen(true);
    setLoadingParticipants(true);

    try {
      // Backend validates that this event strictly belongs to this organizer!
      const res = await api.get(`/organizer/events/${event.id}/registrations`);
      if (res?.data) {
        setParticipants(res.data);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Could not fetch participants');
    } finally {
      setLoadingParticipants(false);
    }
  };

  const handleMarkAttendance = async (studentId, present) => {
    if (!selectedEventForParticipants) return;
    try {
      await api.post(`/organizer/events/${selectedEventForParticipants.id}/attendance`, {
        studentId,
        present
      });
      // Refresh participant list
      const res = await api.get(`/organizer/events/${selectedEventForParticipants.id}/registrations`);
      if (res?.data) setParticipants(res.data);
    } catch (err) {
      alert(err.message || 'Failed to mark attendance');
    }
  };

  const viewRejectionReason = (reason) => {
    setCurrentRejectionReason(reason);
    setRejectionModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading organizer metrics and event management records..." />;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold text-brand-violet tracking-wider">Organizer Portal</div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-charcoal">
            {user?.fullName || 'Event Organizer'} Space
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your club events, review approval workflows, and track registered attendees.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-brand-violet text-white text-sm font-bold hover:bg-brand-violet/90 shadow-soft hover:shadow-elevated transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-5 h-5 text-brand-coral" />
          <span>Create New Event</span>
        </button>
      </div>

      {formSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{formSuccess}</span>
        </div>
      )}

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-xs font-bold text-gray-400 uppercase">Total Created</div>
          <div className="font-display font-black text-2xl text-brand-charcoal">{stats?.totalEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-xs font-bold text-amber-600 uppercase">Pending Review</div>
          <div className="font-display font-black text-2xl text-amber-600">{stats?.pendingEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-xs font-bold text-emerald-600 uppercase">Live & Approved</div>
          <div className="font-display font-black text-2xl text-emerald-600">{stats?.approvedEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-xs font-bold text-red-600 uppercase">Rejected</div>
          <div className="font-display font-black text-2xl text-red-600">{stats?.rejectedEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-tr from-brand-violet to-[#8755C2] text-white shadow-soft space-y-1 col-span-2 lg:col-span-1">
          <div className="text-xs font-bold text-brand-lavender uppercase">Total Registrations</div>
          <div className="font-display font-black text-2xl text-white">{stats?.totalRegistrations || 0}</div>
        </div>
      </div>

      {/* 3. RECHARTS REGISTRATION ANALYTICS */}
      {stats?.eventRegistrationsList?.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-brand-violet" />
            <h3 className="font-display font-bold text-lg text-brand-charcoal">
              Registration Volume per Event
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.eventRegistrationsList}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="eventName" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#30303C',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="registrations" name="Registered Participants" fill="#7352A3" radius={[8, 8, 0, 0]} />
                <Bar dataKey="capacity" name="Total Capacity" fill="#B9A1D8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 4. EVENT MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-brand-charcoal">
              Your Events Roster
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Strictly filtered to events created exclusively by your account.
            </p>
          </div>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-400 space-y-2">
            <div>You haven't submitted any events yet.</div>
            <button
              onClick={openCreateModal}
              className="font-bold text-brand-violet hover:underline"
            >
              + Submit your first campus event
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Event Title</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date & Venue</th>
                  <th className="pb-3">Registrations</th>
                  <th className="pb-3">Approval Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myEvents.map((evt) => {
                  const isApproved = evt.status === 'APPROVED';
                  const isPending = evt.status === 'PENDING';
                  const isRejected = evt.status === 'REJECTED';

                  return (
                    <tr key={evt.id} className="hover:bg-brand-warm/50 transition-colors">
                      <td className="py-4 font-bold text-brand-charcoal max-w-xs truncate">
                        {evt.title}
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-lavender/20 text-brand-violet font-semibold">
                          {evt.categoryName}
                        </span>
                      </td>
                      <td className="py-4 text-gray-600">
                        <div>{new Date(evt.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        <div className="text-[10px] text-gray-400 truncate max-w-[120px]">{evt.venue}</div>
                      </td>
                      <td className="py-4 font-bold text-brand-charcoal">
                        {evt.currentRegistrations} / {evt.maxCapacity}
                      </td>
                      <td className="py-4">
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] inline-flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold uppercase text-[10px] inline-flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isRejected && (
                          <button
                            onClick={() => viewRejectionReason(evt.rejectionReason)}
                            className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 font-bold uppercase text-[10px] inline-flex items-center space-x-1 hover:bg-red-200 transition-colors"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>Rejected (View Reason)</span>
                          </button>
                        )}
                      </td>
                      <td className="py-4 text-right space-x-2">
                        {/* Only allowed to edit if PENDING or REJECTED */}
                        {!isApproved && (
                          <button
                            onClick={() => openEditModal(evt)}
                            className="p-1.5 rounded-lg text-brand-violet hover:bg-brand-lavender/20 transition-colors"
                            title="Edit & Resubmit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}

                        {/* View registered participants */}
                        <button
                          onClick={() => viewParticipants(evt)}
                          className="px-3 py-1.5 rounded-xl bg-brand-violet/10 text-brand-violet hover:bg-brand-violet hover:text-white font-bold text-xs transition-colors"
                        >
                          Participants ({evt.currentRegistrations})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT EVENT MODAL */}
      <Modal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        title={editingEventId ? 'Edit & Resubmit Event' : 'Create New Event Proposal'}
      >
        <form onSubmit={handleEventFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">{formError}</div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal">Event Title</label>
            <input
              type="text"
              required
              value={eventForm.title}
              onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
              placeholder="e.g. NextGen Web3 & AI Hackathon"
              className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-violet outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-brand-charcoal">Description & Schedule</label>
            <textarea
              required
              rows={3}
              value={eventForm.description}
              onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
              placeholder="Provide a comprehensive breakdown of the event schedule, rules, and guest speakers..."
              className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-violet outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Category</label>
              <select
                value={eventForm.categoryId}
                onChange={(e) => setEventForm({ ...eventForm, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Poster URL</label>
              <input
                type="url"
                value={eventForm.posterUrl}
                onChange={(e) => setEventForm({ ...eventForm, posterUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs focus:ring-1 focus:ring-brand-violet outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Event Date</label>
              <input
                type="date"
                required
                value={eventForm.eventDate}
                onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Start Time</label>
              <input
                type="time"
                required
                value={eventForm.startTime}
                onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">End Time</label>
              <input
                type="time"
                required
                value={eventForm.endTime}
                onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Venue</label>
              <input
                type="text"
                required
                value={eventForm.venue}
                onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                placeholder="e.g. Auditorium Hall B"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Max Participant Capacity</label>
              <input
                type="number"
                required
                min={1}
                value={eventForm.maxCapacity}
                onChange={(e) => setEventForm({ ...eventForm, maxCapacity: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Registration Deadline</label>
              <input
                type="datetime-local"
                required
                value={eventForm.registrationDeadline}
                onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-brand-charcoal">Tags (Interest Matching)</label>
              <input
                type="text"
                value={eventForm.tags}
                onChange={(e) => setEventForm({ ...eventForm, tags: e.target.value })}
                placeholder="e.g. AI, Coding, Machine Learning"
                className="w-full px-3.5 py-2 rounded-xl border border-brand-lavender/40 text-xs outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsEventModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-brand-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingEvent}
              className="px-5 py-2 rounded-xl bg-brand-violet text-white text-xs font-bold hover:bg-brand-violet/90 transition-all shadow-soft disabled:opacity-50"
            >
              {submittingEvent ? 'Submitting...' : editingEventId ? 'Resubmit for Review' : 'Submit for Admin Approval'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PARTICIPANTS MODAL WITH STRICT OWNERSHIP CHECK */}
      <Modal
        isOpen={participantsModalOpen}
        onClose={() => setParticipantsModalOpen(false)}
        title={`Attendees: ${selectedEventForParticipants?.title || 'Event'}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-gray-500 bg-brand-warm p-3 rounded-xl border border-brand-lavender/30">
            <span>Capacity: <strong>{selectedEventForParticipants?.currentRegistrations} / {selectedEventForParticipants?.maxCapacity}</strong></span>
            <span className="text-emerald-700 font-bold">🔒 Organizer Restricted Access</span>
          </div>

          {loadingParticipants ? (
            <div className="text-center py-8 text-xs text-gray-400">Loading attendee roster...</div>
          ) : participants.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-400">No participants registered yet.</div>
          ) : (
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase">
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Reg. No.</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2 text-right">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {participants.map((p) => {
                    const isMarked = p.markedByOrganizer;
                    const isVerified = p.verifiedByAdmin;
                    return (
                      <tr key={p.id} className="hover:bg-brand-warm/60 transition-colors">
                        <td className="py-2.5 font-bold text-brand-charcoal">
                          <div>{p.studentName}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{p.studentEmail}</div>
                        </td>
                        <td className="py-2.5 text-gray-600 font-medium">
                          {p.registrationNumber || 'N/A'}
                        </td>
                        <td className="py-2.5 text-gray-500 truncate max-w-[120px]">
                          {p.department || 'N/A'}
                        </td>
                        <td className="py-2.5 text-right">
                          {isVerified ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Verified ✓ (+50 XP)
                            </span>
                          ) : isMarked ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                              Marked Present (Pending Admin)
                            </span>
                          ) : (
                            <button
                              onClick={() => handleMarkAttendance(p.studentId, true)}
                              className="px-2.5 py-1 rounded-lg bg-brand-violet text-white text-[10px] font-bold hover:bg-brand-violet/90"
                            >
                              Mark Present
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Modal>

      {/* REJECTION REASON MODAL */}
      <Modal
        isOpen={rejectionModalOpen}
        onClose={() => setRejectionModalOpen(false)}
        title="College Administration Review Feedback"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm space-y-2">
            <div className="font-bold flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Reason for Rejection / Modification Request:</span>
            </div>
            <p className="leading-relaxed bg-white/70 p-3 rounded-xl border border-red-100 text-red-900 font-medium">
              "{currentRejectionReason}"
            </p>
          </div>

          <p className="text-xs text-gray-600">
            You can address the administrator's feedback by clicking the <strong>Edit & Resubmit</strong> button in your events roster. Once modified, your proposal will immediately re-enter the administrative review queue.
          </p>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              onClick={() => setRejectionModalOpen(false)}
              className="px-5 py-2 rounded-xl bg-brand-charcoal text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
