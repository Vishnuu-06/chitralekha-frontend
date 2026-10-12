import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Film,
  Tv,
  Sparkles,
  BookOpen,
  Compass,
  Bookmark,
  MessageSquare,
  Bell,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

export const Navbar: React.FC = () => {
  const { user, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      notificationService
        .getUnreadCount()
        .then((res) => setUnreadCount(res.unreadCount))
        .catch(() => {});
    } else {
      setUnreadCount(0);
    }
  }, [user, location.pathname]);

  const navLinks = [
    { label: 'Discover', path: '/discover' },
    { label: 'Movies', path: '/movies' },
    { label: 'TV Shows', path: '/shows' },
    { label: 'Anime', path: '/anime' },
    { label: 'Books', path: '/books' },
    { label: 'Lists', path: '/lists' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#14181c]/95 backdrop-blur-md border-b border-[#2c3440]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Mark with Letterboxd 3-dot motif */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00e054] shadow-xs" title="Films & Stories" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8000] shadow-xs" title="Ratings & Perspectives" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#40bcf4] shadow-xs" title="Community & Curations" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-black text-lg tracking-wider text-white group-hover:text-[#00e054] transition-colors">
                  CHITRA LEKHA
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
              {navLinks.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold tracking-widest uppercase transition-colors rounded-[3px] ${
                      active
                        ? 'text-white border-b-2 border-[#00e054] font-bold'
                        : 'text-[#99aabb] hover:text-white hover:bg-[#1b2228]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Search & Letterboxd Action Controls */}
          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative">
              <Search className="w-3.5 h-3.5 text-[#667788] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stories, members..."
                className="w-48 xl:w-60 bg-[#1b2228] border border-[#2c3440] focus:border-[#445566] text-white text-xs pl-8 pr-3 py-1.5 rounded-[3px] focus:outline-none placeholder-[#667788] font-sans"
              />
            </form>

            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="lg:hidden p-2 text-[#99aabb] hover:text-white hover:bg-[#1b2228] rounded-[3px] transition-colors"
              title="Search stories"
              aria-label="Search stories"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Letterboxd Hallmark + LOG button */}
            <button
              type="button"
              onClick={() => {
                if (!user) openAuthModal('login');
                else navigate('/discover');
              }}
              className="bg-[#00e054] hover:bg-[#00c74a] text-[#14181c] font-mono font-bold text-xs uppercase px-3 py-1.5 rounded-[3px] flex items-center space-x-1 shadow-sm transition-all hover:scale-[1.02]"
              title="Log or review a title"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>LOG</span>
            </button>

            {user ? (
              <>
                <Link
                  to="/messages"
                  className={`p-2 text-[#99aabb] hover:text-white hover:bg-[#1b2228] rounded-[3px] transition-colors relative ${
                    isActive('/messages') ? 'text-white bg-[#1b2228]' : ''
                  }`}
                  title="Direct Messages"
                  aria-label="Direct Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>

                <Link
                  to="/notifications"
                  className={`p-2 text-[#99aabb] hover:text-white hover:bg-[#1b2228] rounded-[3px] transition-colors relative ${
                    isActive('/notifications') ? 'text-white bg-[#1b2228]' : ''
                  }`}
                  title="Notifications"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00e054] rounded-full" />
                  )}
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 p-1 rounded-[3px] hover:bg-[#1b2228] transition-colors focus:outline-none"
                    aria-expanded={userDropdownOpen}
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-7 h-7 rounded-[3px] object-cover border border-[#2c3440]"
                      />
                    ) : (
                      <span className="w-7 h-7 rounded-[3px] bg-[#2c3440] text-white text-xs font-mono font-bold flex items-center justify-center uppercase">
                        {user.username[0]}
                      </span>
                    )}
                    <span className="hidden sm:inline text-xs font-mono font-semibold text-white">
                      {user.username}
                    </span>
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-[#1b2228] border border-[#2c3440] shadow-xl rounded-[3px] py-1 z-50 animate-fade-in"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <Link
                        to={`/profile/${user.username}`}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-mono text-[#c8d4e0] hover:bg-[#202830] hover:text-white"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#00e054]" />
                        <span>Profile &amp; Quartet</span>
                      </Link>
                      <Link
                        to="/lists"
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-mono text-[#c8d4e0] hover:bg-[#202830] hover:text-white"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-[#ff8000]" />
                        <span>My Lists</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => logout()}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-xs font-mono text-red-400 hover:bg-[#202830] text-left border-t border-[#2c3440]/60 mt-1"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-1.5 text-xs font-mono uppercase font-semibold text-[#c8d4e0] hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="px-3 py-1.5 text-xs font-mono uppercase font-semibold text-white bg-[#2c3440] hover:bg-[#445566] border border-[#445566] rounded-[3px] transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#99aabb] hover:text-white rounded-[3px]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#2c3440] bg-[#14181c] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-[3px] ${
                  active
                    ? 'text-white bg-[#1b2228] font-bold border-l-2 border-[#00e054]'
                    : 'text-[#99aabb] hover:text-white hover:bg-[#1b2228]'
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
