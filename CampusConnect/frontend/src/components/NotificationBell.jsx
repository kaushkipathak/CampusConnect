import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res?.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Failed to load notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // refresh periodically
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-full text-brand-charcoal hover:bg-brand-lavender/20 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-brand-charcoal" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold text-white bg-brand-coral rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-84 sm:w-96 bg-white rounded-2xl shadow-elevated border border-brand-lavender/30 overflow-hidden z-50 animate-in fade-in duration-200">
          <div className="px-4 py-3 bg-brand-violet/5 border-b border-brand-lavender/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-display font-semibold text-brand-charcoal">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-coral/20 text-brand-coral font-semibold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-brand-violet hover:underline font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-400">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 transition-colors flex items-start space-x-3 ${
                    notif.read ? 'bg-white' : 'bg-brand-lavender/10'
                  }`}
                >
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    notif.read ? 'bg-transparent' : 'bg-brand-coral'
                  }`} />
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-brand-charcoal">{notif.title}</h4>
                    <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={() => markAsRead(notif.id)}
                      className="p-1 rounded text-gray-400 hover:text-brand-violet hover:bg-white"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
