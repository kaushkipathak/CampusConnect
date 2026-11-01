import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Calendar, X, Compass, SlidersHorizontal } from 'lucide-react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EventDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoryId') || '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');

  useEffect(() => {
    // Load categories once
    api.get('/events/categories')
      .then((res) => {
        if (res?.data) setCategories(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedCategory) params.categoryId = selectedCategory;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      const res = await api.get('/events', { params });
      let data = res.data || [];

      // Client-side sorting
      if (sortBy === 'date-asc') {
        data.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
      } else if (sortBy === 'date-desc') {
        data.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
      } else if (sortBy === 'popularity') {
        data.sort((a, b) => b.currentRegistrations - a.currentRegistrations);
      }

      setEvents(data);
    } catch (err) {
      console.error('Error fetching events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, fromDate, toDate, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setFromDate('');
    setToDate('');
    setSortBy('date-asc');
    setSearchParams({});
  };

  const hasActiveFilters = search || selectedCategory || fromDate || toDate;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="text-xs uppercase font-bold text-brand-violet tracking-wider">Campus Directory</div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-brand-charcoal">
          Explore College Events
        </h1>
        <p className="text-sm text-gray-500">
          Discover vetted workshops, technical hackathons, guest lectures, and cultural nights.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-6 border border-brand-lavender/30 shadow-soft space-y-5">
        
        {/* Top Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by event title, tech tags (e.g. AI, PyTorch), venue..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-brand-lavender/40 text-sm text-brand-charcoal placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-violet/50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-violet text-white font-bold text-sm hover:bg-brand-violet/90 shadow-soft transition-all shrink-0"
          >
            Search
          </button>
        </form>

        {/* Category Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === ''
                ? 'bg-brand-violet text-white shadow-soft'
                : 'bg-brand-lavender/15 text-brand-charcoal hover:bg-brand-lavender/30'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id.toString())}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id.toString()
                  ? 'bg-brand-violet text-white shadow-soft'
                  : 'bg-brand-lavender/15 text-brand-charcoal hover:bg-brand-lavender/30'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-gray-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 text-gray-500">
              <Calendar className="w-4 h-4 text-brand-violet" />
              <span>Date range:</span>
            </div>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-brand-lavender/40 text-xs text-brand-charcoal outline-none focus:ring-1 focus:ring-brand-violet"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-brand-lavender/40 text-xs text-brand-charcoal outline-none focus:ring-1 focus:ring-brand-violet"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-brand-lavender/40 text-xs text-brand-charcoal outline-none bg-white font-medium"
              >
                <option value="date-asc">Upcoming (Earliest first)</option>
                <option value="date-desc">Latest date first</option>
                <option value="popularity">Most Popular (Registrations)</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-xs text-brand-coral font-bold hover:underline"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Showing <strong className="text-brand-charcoal">{events.length}</strong> approved campus events</span>
      </div>

      {/* Grid of Events */}
      {loading ? (
        <LoadingSpinner message="Searching verified campus listings..." />
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-brand-lavender/30 space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-lavender/20 text-brand-violet flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-brand-charcoal">No Matching Events Found</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            We couldn't find any events matching your selected criteria. Try resetting filters or searching with broader keywords.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-violet text-white text-xs font-bold shadow-soft hover:bg-brand-violet/90"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
