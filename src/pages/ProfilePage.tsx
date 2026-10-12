import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Film,
  Tv,
  Sparkles,
  BookOpen,
  UserCheck,
  UserPlus,
  MessageSquare,
  Edit2,
  ShieldAlert,
  Calendar,
  Layers,
  Star,
  CheckCircle,
} from 'lucide-react';
import { socialService } from '../services/socialService';
import { trackingService } from '../services/trackingService';
import { listService } from '../services/listService';
import { messagingService } from '../services/messagingService';
import { useAuth } from '../context/AuthContext';
import { ContentCard } from '../components/ContentCard';
import { ReportModal } from '../components/ReportModal';
import { UserProfileData, UserTrackingRecord, ListSummary, PostItem } from '../types';

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user: currentUser, openAuthModal } = useAuth();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [activeTab, setActiveTab] = useState<'shelf' | 'lists' | 'posts'>('shelf');
  const [shelfFilter, setShelfFilter] = useState<string>('ALL');
  const [shelfItems, setShelfItems] = useState<UserTrackingRecord[]>([]);
  const [userLists, setUserLists] = useState<ListSummary[]>([]);
  const [userPosts, setUserPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [followingAction, setFollowingAction] = useState<boolean>(false);

  // Edit profile modal state
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editDisplayName, setEditDisplayName] = useState<string>('');
  const [editBio, setEditBio] = useState<string>('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string>('');
  const [editFavMovie, setEditFavMovie] = useState<string>('');
  const [editFavShow, setEditFavShow] = useState<string>('');
  const [editFavAnime, setEditFavAnime] = useState<string>('');
  const [editFavBook, setEditFavBook] = useState<string>('');
  const [savingProfile, setSavingProfile] = useState<boolean>(false);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const loadProfile = () => {
    if (!username) return;
    setLoading(true);
    socialService
      .getUserProfile(username)
      .then((data) => {
        setProfileData(data);
        setEditDisplayName(data.profile.displayName || '');
        setEditBio(data.profile.bio || '');
        setEditAvatarUrl(data.profile.avatarUrl || '');
        setEditFavMovie(data.profile.favoriteMovies || '');
        setEditFavShow(data.profile.favoriteShows || '');
        setEditFavAnime(data.profile.favoriteAnime || '');
        setEditFavBook(data.profile.favoriteBooks || '');
        setLoading(false);
      })
      .catch(() => {
        setProfileData(null);
        setLoading(false);
      });
  };

  const loadShelf = () => {
    if (!username) return;
    trackingService
      .getUserTracking(username, shelfFilter)
      .then((records) => setShelfItems(records))
      .catch(() => setShelfItems([]));
  };

  const loadLists = () => {
    if (!username) return;
    listService
      .getUserLists(username)
      .then((lists) => setUserLists(lists))
      .catch(() => setUserLists([]));
  };

  const loadPosts = () => {
    if (!username) return;
    socialService
      .getUserPosts(username)
      .then((posts) => setUserPosts(posts))
      .catch(() => setUserPosts([]));
  };

  useEffect(() => {
    loadProfile();
  }, [username, currentUser]);

  useEffect(() => {
    if (activeTab === 'shelf') loadShelf();
    else if (activeTab === 'lists') loadLists();
    else if (activeTab === 'posts') loadPosts();
  }, [username, activeTab, shelfFilter]);

  const handleToggleFollow = async () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    if (!username || followingAction) return;

    setFollowingAction(true);
    try {
      const res = await socialService.toggleFollow(username);
      setProfileData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isFollowing: res.following,
          stats: {
            ...prev.stats,
            followersCount: prev.stats.followersCount + (res.following ? 1 : -1),
          },
        };
      });
    } catch {
      // ignore
    } finally {
      setFollowingAction(false);
    }
  };

  const handleStartMessage = async () => {
    if (!currentUser) {
      openAuthModal();
      return;
    }
    if (!username) return;
    try {
      await messagingService.getOrCreateConversation(username);
      navigate('/messages');
    } catch (err: any) {
      alert(err.message || 'Cannot start conversation with this user.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await socialService.updateProfile({
        displayName: editDisplayName,
        bio: editBio,
        avatarUrl: editAvatarUrl,
        favoriteMovies: editFavMovie,
        favoriteShows: editFavShow,
        favoriteAnime: editFavAnime,
        favoriteBooks: editFavBook,
      });
      setShowEditModal(false);
      loadProfile();
    } catch {
      alert('Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-32 bg-[#1b2228] rounded-[3px]" />
        <div className="h-10 bg-[#202830] rounded-[3px] w-1/4" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Profile Not Found</h1>
        <p className="text-sm text-[#8899aa]">The requested user profile does not exist or has been removed.</p>
        <Link
          to="/discover"
          className="inline-block px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px]"
        >
          Return to Discovery
        </Link>
      </div>
    );
  }

  const { user, profile, stats, isFollowing, isSelf } = profileData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 text-[#99aabb]">
      {/* Letterboxd Profile Header */}
      <section className="p-6 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-[3px] bg-[#202830] text-white flex items-center justify-center font-bold text-2xl flex-shrink-0 border border-[#2c3440] overflow-hidden shadow-md">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName || user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#00e054]">{user.username.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {profile.displayName || user.username}
                </h1>
                <span className="text-xs uppercase px-2 py-0.5 rounded-[2px] bg-[#202830] text-[#00e054] border border-[#2c3440] font-bold tracking-wider">
                  Member
                </span>
              </div>
              <p className="text-xs text-[#8899aa] font-mono">@{user.username}</p>

              {profile.bio && (
                <p className="text-xs sm:text-sm text-[#ccddee] max-w-xl leading-relaxed pt-1">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end">
            {isSelf ? (
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#202830] hover:bg-[#2c3440] text-white border border-[#2c3440] rounded-[3px] flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#8899aa]" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={followingAction}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-[3px] flex items-center gap-1.5 transition-colors ${
                    isFollowing
                      ? 'bg-[#202830] text-[#00e054] border border-[#00e054]'
                      : 'bg-[#00e054] hover:bg-[#00c84b] text-[#14181c]'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleStartMessage}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#202830] hover:bg-[#2c3440] text-white border border-[#2c3440] rounded-[3px] flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#8899aa]" />
                  <span>Message</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowReportModal(true)}
                  className="p-2 text-[#667788] hover:text-[#ff8000] transition-colors"
                  title="Report user"
                >
                  <ShieldAlert className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Letterboxd Stat Counters Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-6 pt-6 border-t border-[#2c3440] text-center">
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.watchedMoviesCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Films</span>
          </div>
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.readBooksCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Books</span>
          </div>
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.ratingsCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Ratings</span>
          </div>
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.reviewsCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Reviews</span>
          </div>
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.followingCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Following</span>
          </div>
          <div className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px]">
            <span className="text-xl font-black text-white">{stats.followersCount}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8899aa] block mt-0.5">Followers</span>
          </div>
        </div>
      </section>

      {/* Signature Letterboxd Favorite Four / Quartet Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#2c3440] pb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-[#ff8000] fill-[#ff8000]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-white">FAVORITE FOUR</h2>
          </div>
          <span className="text-[11px] text-[#8899aa]">Personal canonical quartet</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] p-4 space-y-2 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-[#00e054] font-bold uppercase tracking-wider">
              <Film className="w-3.5 h-3.5" />
              <span>Favorite Film</span>
            </div>
            <p className="text-sm font-bold text-white line-clamp-2">
              {profile.favoriteMovies || 'Not designated'}
            </p>
          </div>

          <div className="bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] p-4 space-y-2 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-[#40bcf4] font-bold uppercase tracking-wider">
              <Tv className="w-3.5 h-3.5" />
              <span>Favorite Series</span>
            </div>
            <p className="text-sm font-bold text-white line-clamp-2">
              {profile.favoriteShows || 'Not designated'}
            </p>
          </div>

          <div className="bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] p-4 space-y-2 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-[#ff8000] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Favorite Anime</span>
            </div>
            <p className="text-sm font-bold text-white line-clamp-2">
              {profile.favoriteAnime || 'Not designated'}
            </p>
          </div>

          <div className="bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] p-4 space-y-2 transition-all">
            <div className="flex items-center gap-1.5 text-xs text-[#00e054] font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Favorite Book</span>
            </div>
            <p className="text-sm font-bold text-white line-clamp-2">
              {profile.favoriteBooks || 'Not designated'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <section className="space-y-6">
        <div className="flex items-center gap-6 border-b border-[#2c3440] text-xs uppercase tracking-wider font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('shelf')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'shelf'
                ? 'border-[#00e054] text-white'
                : 'border-transparent text-[#8899aa] hover:text-white'
            }`}
          >
            DIARY &amp; SHELF
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('lists')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'lists'
                ? 'border-[#00e054] text-white'
                : 'border-transparent text-[#8899aa] hover:text-white'
            }`}
          >
            LISTS ({stats.listsCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'posts'
                ? 'border-[#00e054] text-white'
                : 'border-transparent text-[#8899aa] hover:text-white'
            }`}
          >
            POSTS &amp; FEED
          </button>
        </div>

        {/* Tab 1: Tracking Shelf */}
        {activeTab === 'shelf' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'ALL LOGGED', value: 'ALL' },
                { label: 'WATCHED & READ', value: 'WATCHED' },
                { label: 'CURRENTLY CONSUMING', value: 'WATCHING' },
                { label: 'WATCHLIST & QUEUE', value: 'WANT_TO_WATCH' },
              ].map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setShelfFilter(f.value)}
                  className={`px-3 py-1 text-xs rounded-[3px] font-bold tracking-wider transition-colors border ${
                    shelfFilter === f.value
                      ? 'bg-[#00e054] text-[#14181c] border-[#00e054]'
                      : 'bg-[#1b2228] text-[#8899aa] border-[#2c3440] hover:border-[#445566] hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {shelfItems.length === 0 ? (
              <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
                <p className="text-sm text-[#8899aa]">
                  No titles logged in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {shelfItems.map((record) => (
                  <ContentCard key={record.id} item={record.content} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: User Lists */}
        {activeTab === 'lists' && (
          <div className="space-y-4">
            {userLists.length === 0 ? (
              <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
                <p className="text-sm text-[#8899aa]">
                  No lists published by this member yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userLists.map((list) => (
                  <Link
                    key={list.id}
                    to={`/lists/${list.id}`}
                    className="p-4 bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] space-y-2 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white group-hover:text-[#40bcf4] transition-colors">
                        {list.name}
                      </h3>
                      <span className="text-xs text-[#8899aa] bg-[#202830] px-2 py-0.5 rounded-[2px] border border-[#2c3440]">
                        {list.items ? list.items.length : 0} items
                      </span>
                    </div>
                    {list.description && (
                      <p className="text-xs text-[#8899aa] line-clamp-2">{list.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Member Posts & Reflections */}
        {activeTab === 'posts' && (
          <div className="space-y-4">
            {userPosts.length === 0 ? (
              <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
                <p className="text-sm text-[#8899aa]">
                  No reflections shared by this member yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {userPosts.map((p) => (
                  <article
                    key={p.id}
                    className="p-5 bg-[#1b2228] border border-[#2c3440] rounded-[3px] space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs text-[#8899aa]">
                      <span className="font-bold text-white">@{p.username}</span>
                      <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-[#ccddee] leading-relaxed whitespace-pre-line">
                      {p.body}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#1b2228] w-full max-w-lg border border-[#2c3440] rounded-[3px] shadow-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Edit Member Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={editAvatarUrl}
                  onChange={(e) => setEditAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#2c3440]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                    Favorite Film
                  </label>
                  <input
                    type="text"
                    value={editFavMovie}
                    onChange={(e) => setEditFavMovie(e.target.value)}
                    placeholder="e.g. Blade Runner 2049"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                    Favorite Series
                  </label>
                  <input
                    type="text"
                    value={editFavShow}
                    onChange={(e) => setEditFavShow(e.target.value)}
                    placeholder="e.g. Severance"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                    Favorite Anime
                  </label>
                  <input
                    type="text"
                    value={editFavAnime}
                    onChange={(e) => setEditFavAnime(e.target.value)}
                    placeholder="e.g. Cowboy Bebop"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                    Favorite Book
                  </label>
                  <input
                    type="text"
                    value={editFavBook}
                    onChange={(e) => setEditFavBook(e.target.value)}
                    placeholder="e.g. Dune"
                    className="w-full px-2.5 py-1.5 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#8899aa] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] hover:bg-[#00c84b] text-[#14181c] rounded-[3px] transition-colors"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <ReportModal
          reportedType="USER"
          targetId={user.id}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
