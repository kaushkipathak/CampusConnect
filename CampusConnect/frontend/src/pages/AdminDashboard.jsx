import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Check, 
  X, 
  Clock, 
  Users, 
  AlertCircle, 
  Award, 
  PieChart as PieIcon, 
  Building,
  CheckCircle2,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const STATUS_COLORS = {
  Pending: '#F59E0B',
  Approved: '#10B981',
  Rejected: '#EF4444',
};

const CATEGORY_PALETTE = ['#7352A3', '#FF897C', '#B9A1D8', '#8660B8', '#FFAAA0', '#30303C'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active view tab: 'APPROVALS' | 'ALL_EVENTS' | 'ATTENDANCE' | 'ORGANIZERS'
  const [activeTab, setActiveTab] = useState('APPROVALS');

  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedEventToReject, setSelectedEventToReject] = useState(null);
  const [rejectionComments, setRejectionComments] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, allRes, attendRes, orgRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/events/pending'),
        api.get('/admin/events'),
        api.get('/admin/attendance/pending'),
        api.get('/admin/organizers')
      ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (pendingRes?.data) setPendingEvents(pendingRes.data);
      if (allRes?.data) setAllEvents(allRes.data);
      if (attendRes?.data) setPendingAttendance(attendRes.data);
      if (orgRes?.data) setOrganizers(orgRes.data);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleApproveEvent = async (id) => {
    try {
      setProcessingAction(true);
      await api.put(`/admin/events/${id}/approve`, {
        comments: 'Approved by College Administration'
      });
      setActionFeedback('Event approved and successfully published to students.');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Approval failed');
    } finally {
      setProcessingAction(false);
    }
  };

  const openRejectModal = (event) => {
    setSelectedEventToReject(event);
    setRejectionComments('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionComments.trim()) {
      alert('A mandatory rejection reason is required.');
      return;
    }

    try {
      setProcessingAction(true);
      await api.put(`/admin/events/${selectedEventToReject.id}/reject`, {
        comments: rejectionComments.trim()
      });
      setRejectModalOpen(false);
      setActionFeedback(`Event rejected. Organizer has been notified with the feedback.`);
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Rejection failed');
    } finally {
      setProcessingAction(false);
    }
  };

  const handleVerifyAttendance = async (attendanceId, verified) => {
    try {
      await api.put(`/admin/attendance/${attendanceId}/verify`, {
        verified: verified,
        points: 50
      });
      setActionFeedback('Attendance verified! 50 XP awarded to student Campus Passport.');
      loadAdminData();
    } catch (err) {
      alert(err.message || 'Verification failed');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading College Administration control portal..." />;
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. ADMINISTRATION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Syndicate Governance Console</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-charcoal">
            College Administration
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Review event proposals, uphold campus standards, and verify Campus Passport credentials.
          </p>
        </div>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionFeedback}</span>
        </div>
      )}

      {/* 2. STATS CARDS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-gray-400 uppercase">Total Events</div>
          <div className="font-display font-black text-2xl text-brand-charcoal">{stats?.totalEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-amber-600 uppercase">Pending Requests</div>
          <div className="font-display font-black text-2xl text-amber-600">{stats?.pendingEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-emerald-600 uppercase">Approved</div>
          <div className="font-display font-black text-2xl text-emerald-600">{stats?.approvedEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-red-600 uppercase">Rejected</div>
          <div className="font-display font-black text-2xl text-red-600">{stats?.rejectedEvents || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-brand-lavender/30 shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-brand-violet uppercase">Total RSVPs</div>
          <div className="font-display font-black text-2xl text-brand-violet">{stats?.totalRegistrations || 0}</div>
        </div>

        <div className="p-5 rounded-3xl bg-brand-charcoal text-white shadow-soft space-y-1">
          <div className="text-[11px] font-bold text-brand-lavender uppercase">Active Organizers</div>
          <div className="font-display font-black text-2xl text-brand-coral">{stats?.totalOrganizers || 0}</div>
        </div>
      </div>

      {/* 3. RECHARTS ANALYTICS: STATUS & CATEGORY DISTRIBUTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-brand-lavender/30 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-brand-charcoal">
              Workflow Status Breakdown
            </h3>
            <span className="text-xs text-gray-400">All Time</span>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.statusBreakdown || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats?.statusBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#7352A3'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#30303C',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-brand-lavender/30 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-brand-charcoal">
              Events by Category
            </h3>
            <span className="text-xs text-gray-400">Academic & Cultural</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#30303C',
                    borderRadius: '12px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Events" fill="#7352A3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. NAVIGATION TABS */}
      <div className="flex border-b border-brand-lavender/30 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('APPROVALS')}
          className={`pb-3 transition-colors flex items-center space-x-2 ${
            activeTab === 'APPROVALS'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          <span>Approval Queue</span>
          {pendingEvents.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {pendingEvents.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`pb-3 transition-colors flex items-center space-x-2 ${
            activeTab === 'ATTENDANCE'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          <span>Passport Verification</span>
          {pendingAttendance.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-coral/20 text-brand-coral text-[10px] font-bold">
              {pendingAttendance.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('ALL_EVENTS')}
          className={`pb-3 transition-colors ${
            activeTab === 'ALL_EVENTS'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          Master Events Directory ({allEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('ORGANIZERS')}
          className={`pb-3 transition-colors ${
            activeTab === 'ORGANIZERS'
              ? 'text-brand-violet border-b-2 border-brand-violet font-bold'
              : 'text-gray-500 hover:text-brand-charcoal'
          }`}
        >
          Club Organizers ({organizers.length})
        </button>
      </div>

      {/* TAB CONTENT 1: APPROVAL QUEUE */}
      {activeTab === 'APPROVALS' && (
        <div className="space-y-6">
          {pendingEvents.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-brand-lavender/30 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-display font-bold text-xl text-brand-charcoal">All Clear!</h3>
              <p className="text-xs text-gray-500">There are no pending event approval requests right now.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl p-6 border border-amber-200 shadow-soft hover:shadow-elevated transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.posterUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'}
                      alt={event.title}
                      className="w-32 h-32 rounded-2xl object-cover shrink-0 border border-brand-lavender/30"
                    />
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-lavender/20 text-brand-violet text-[10px] font-bold uppercase">
                          {event.categoryName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-500">
                          Proposed by <strong className="text-brand-charcoal">{event.organizerName}</strong> ({event.organizerEmail})
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-xl text-brand-charcoal">{event.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2 max-w-2xl leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                        <span>📅 {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>⏰ {event.startTime?.substring(0, 5)} - {event.endTime?.substring(0, 5)}</span>
                        <span>📍 {event.venue}</span>
                        <span>👥 Capacity: {event.maxCapacity} Seats</span>
                      </div>
                    </div>
                  </div>

                  {/* Approve / Reject Controls */}
                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleApproveEvent(event.id)}
                      disabled={processingAction}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Publish</span>
                    </button>

                    <button
                      onClick={() => openRejectModal(event)}
                      disabled={processingAction}
                      className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all border border-red-200 flex items-center justify-center space-x-1.5"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject with Reason</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: CAMPUS PASSPORT ATTENDANCE VERIFICATION */}
      {activeTab === 'ATTENDANCE' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl text-brand-charcoal">
              Attendance Verification Queue
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Event organizers marked these students present. Verify attendance to award <strong>+50 XP</strong> and unlock badges in their Campus Passport.
            </p>
          </div>

          {pendingAttendance.length === 0 ? (
            <div className="text-center py-12 text-xs text-gray-400">
              No pending attendance verification requests currently awaiting administrative sign-off.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Reg. Number</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Event Attended</th>
                    <th className="pb-3">Marked by Club</th>
                    <th className="pb-3 text-right">Verification Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingAttendance.map((rec) => (
                    <tr key={rec.id} className="hover:bg-brand-warm/60 transition-colors">
                      <td className="py-3.5 font-bold text-brand-charcoal">
                        <div>{rec.studentName}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{rec.studentEmail}</div>
                      </td>
                      <td className="py-3.5 font-semibold text-gray-600">
                        {rec.registrationNumber || 'N/A'}
                      </td>
                      <td className="py-3.5 text-gray-500">
                        {rec.department || 'N/A'}
                      </td>
                      <td className="py-3.5 font-semibold text-brand-violet">
                        {rec.eventTitle}
                      </td>
                      <td className="py-3.5 text-gray-500">
                        {new Date(rec.organizerMarkedAt || Date.now()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleVerifyAttendance(rec.id, true)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
                        >
                          Verify & Award +50 XP
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: MASTER ALL EVENTS */}
      {activeTab === 'ALL_EVENTS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-brand-charcoal">
              All Campus Events
            </h2>
            <span className="text-xs text-gray-500">Total: {allEvents.length} events across platform</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Organizer</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Event Date</th>
                  <th className="pb-3">RSVP Count</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-brand-warm/60 transition-colors">
                    <td className="py-3.5 font-bold text-brand-charcoal">
                      {evt.title}
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {evt.organizerName}
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-brand-lavender/20 text-brand-violet font-semibold">
                        {evt.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(evt.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 font-bold text-brand-charcoal">
                      {evt.currentRegistrations} / {evt.maxCapacity}
                    </td>
                    <td className="py-3.5 text-right font-bold">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase ${
                        evt.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        evt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {evt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ORGANIZERS */}
      {activeTab === 'ORGANIZERS' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-lavender/30 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl text-brand-charcoal">
              Registered Student Club Organizers
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizers.map((org) => (
              <div
                key={org.id}
                className="p-5 rounded-2xl border border-brand-lavender/30 bg-white shadow-soft flex items-center space-x-3"
              >
                <img
                  src={org.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={org.fullName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-violet/20"
                />
                <div className="space-y-0.5 truncate">
                  <div className="font-display font-bold text-sm text-brand-charcoal truncate">{org.fullName}</div>
                  <div className="text-xs text-gray-500 truncate">{org.email}</div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold uppercase inline-block">
                    Verified Organizer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MANDATORY REJECTION REASON MODAL */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Event Proposal"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="text-xs text-gray-600 leading-relaxed">
            Please provide a mandatory justification for rejecting <strong className="text-brand-charcoal">{selectedEventToReject?.title}</strong>. This feedback is sent directly to the organizer so they can rectify and resubmit.
          </p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Mandatory Rejection Reason *
            </label>
            <textarea
              required
              rows={4}
              value={rejectionComments}
              onChange={(e) => setRejectionComments(e.target.value)}
              placeholder="e.g. Venue double-booked on this date; Please shift to Seminar Hall 2 or adjust hours to conclude prior to 21:00 curfew..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-red-200 text-xs focus:ring-2 focus:ring-red-400 outline-none"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-brand-charcoal"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processingAction}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
            >
              {processingAction ? 'Submitting...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
