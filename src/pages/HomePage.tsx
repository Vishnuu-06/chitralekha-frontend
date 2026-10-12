import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Film,
  Tv,
  Sparkles,
  BookOpen,
  Send,
  Heart,
  MessageCircle,
  Users,
  Compass,
  Star,
  Eye,
  Bookmark,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { socialService } from '../services/socialService';
import { contentService } from '../services/contentService';
import { discoveryService } from '../services/discoveryService';
import { ContentCard } from '../components/ContentCard';
import { TrackModal } from '../components/TrackModal';
import { ContentItem, PostItem, TasteRecommendation } from '../types';

export const HomePage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const [feedPosts, setFeedPosts] = useState<PostItem[]>([]);
  const [popularFilms, setPopularFilms] = useState<ContentItem[]>([]);
  const [popularShows, setPopularShows] = useState<ContentItem[]>([]);
  const [popularBooks, setPopularBooks] = useState<ContentItem[]>([]);
  const [tasteRecs, setTasteRecs] = useState<TasteRecommendation[]>([]);
  const [newPostBody, setNewPostBody] = useState('');
  const [posting, setPosting] = useState(false);
  const [trackingItem, setTrackingItem] = useState<ContentItem | null>(null);
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<number | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<number, any[]>>({});
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Load feed
    socialService
      .getFeed()
      .then((data) => setFeedPosts(data))
      .catch(() => {});

    // Load popular films, shows, and books for Letterboxd-style shelves
    contentService
      .discover('MOVIE', 0, 6)
      .then((res) => setPopularFilms(res))
      .catch(() => {});

    contentService
      .discover('SHOW', 0, 6)
      .then((res) => setPopularShows(res))
      .catch(() => {});

    contentService
      .discover('BOOK', 0, 6)
      .then((res) => setPopularBooks(res))
      .catch(() => {});

    // Load taste discovery
    discoveryService
      .getTasteRecommendations()
      .then((recs) => setTasteRecs(recs))
      .catch(() => {});
  }, [user]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }
    if (!newPostBody.trim()) return;

    setPosting(true);
    try {
      const created = await socialService.createPost({ body: newPostBody.trim() });
      setFeedPosts([created, ...feedPosts]);
      setNewPostBody('');
    } catch (err: any) {
      alert(err.message || 'Failed to publish post');
    } finally {
      setPosting(false);
    }
  };

  const handleLikePost = async (postId: number) => {
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      const res = await socialService.toggleLikePost(postId);
      setLikedPosts((prev) => ({ ...prev, [postId]: res.liked }));
    } catch (err: any) {
      // ignore
    }
  };

  const toggleComments = async (postId: number) => {
    if (activeCommentsPostId === postId) {
      setActiveCommentsPostId(null);
    } else {
      setActiveCommentsPostId(postId);
      if (!commentsMap[postId]) {
        try {
          const comms = await socialService.getPostComments(postId);
          setCommentsMap((prev) => ({ ...prev, [postId]: comms }));
        } catch {
          // ignore
        }
      }
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!newCommentText.trim()) return;

    try {
      await socialService.addComment(postId, newCommentText.trim());
      setNewCommentText('');
      const comms = await socialService.getPostComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: comms }));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#14181c] text-[#99aabb] font-sans pb-16">
      {/* 1. Cinematic Letterboxd Hero Section with Widescreen Backdrop */}
      <section className="relative w-full bg-[#1b2228] overflow-hidden border-b border-[#2c3440]">
        {/* Backdrop Image with gradient overlay fading to #14181c */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://image.tmdb.org/t/p/original/sAtoMqDVhNDQBc3QJL3RF6hlxGq.jpg"
            alt="Cinematic backdrop"
            className="w-full h-full object-cover object-top opacity-25 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14181c] via-transparent to-[#14181c]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#1b2228]/90 border border-[#2c3440] rounded-[3px] backdrop-blur-sm text-xs font-mono text-[#c8d4e0]">
            <span className="w-2 h-2 rounded-full bg-[#00e054]" />
            <span>The Social Network for Story Lovers</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Track stories you watch and read. Tell your friends what is good.
          </h1>

          <p className="text-sm sm:text-base text-[#99aabb] max-w-2xl mx-auto leading-relaxed">
            Log movies, serialized television, anime features, and literature. Maintain your diary, write reviews, curate thematic lists, and connect with people who share your taste.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {!user ? (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="bg-[#00e054] hover:bg-[#00c74a] text-[#14181c] font-mono font-bold text-xs uppercase px-6 py-3 rounded-[3px] shadow-md transition-all hover:scale-[1.02]"
                >
                  Get started - it is free
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="bg-[#2c3440] hover:bg-[#445566] text-white border border-[#445566] font-mono font-semibold text-xs uppercase px-6 py-3 rounded-[3px] transition-colors"
                >
                  Explore Popular Stories
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to={`/profile/${user.username}`}
                  className="bg-[#00e054] hover:bg-[#00c74a] text-[#14181c] font-mono font-bold text-xs uppercase px-5 py-2.5 rounded-[3px] transition-all"
                >
                  View My Diary &amp; Quartet
                </Link>
                <Link
                  to="/discover"
                  className="bg-[#2c3440] hover:bg-[#445566] text-white font-mono font-semibold text-xs uppercase px-5 py-2.5 rounded-[3px] transition-colors"
                >
                  Explore Catalog
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        {/* 2. Popular Films Shelf (Letterboxd Style) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#2c3440] pb-2">
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4 text-[#40bcf4]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Popular Films
              </h2>
            </div>
            <Link to="/movies" className="text-xs font-mono text-[#667788] hover:text-[#00e054] transition-colors">
              MORE FILMS &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {popularFilms.map((item) => (
              <ContentCard key={item.id} item={item} onTrack={(it) => setTrackingItem(it)} />
            ))}
          </div>
        </section>

        {/* 3. Popular TV & Series Shelf */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#2c3440] pb-2">
            <div className="flex items-center space-x-2">
              <Tv className="w-4 h-4 text-[#ff8000]" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Popular Television &amp; Series
              </h2>
            </div>
            <Link to="/shows" className="text-xs font-mono text-[#667788] hover:text-[#00e054] transition-colors">
              MORE SERIES &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {popularShows.map((item) => (
              <ContentCard key={item.id} item={item} onTrack={(it) => setTrackingItem(it)} />
            ))}
          </div>
        </section>

        {/* 4. Literature & Books Shelf */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#2c3440] pb-2">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                Books &amp; Literature
              </h2>
            </div>
            <Link to="/books" className="text-xs font-mono text-[#667788] hover:text-[#00e054] transition-colors">
              MORE BOOKS &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
            {popularBooks.map((item) => (
              <ContentCard key={item.id} item={item} onTrack={(it) => setTrackingItem(it)} />
            ))}
          </div>
        </section>

        {/* 5. Two-Column Social Feed & Community Stream */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* Left Column: Community Activity & Reflections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Post Publisher Card */}
            <div className="bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#99aabb]">
                <span className="font-bold text-white uppercase tracking-wider">Log a Reflection or Short Note</span>
                <span>{user ? `@${user.username}` : 'Sign in to publish'}</span>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-3">
                <textarea
                  rows={2}
                  value={newPostBody}
                  onChange={(e) => setNewPostBody(e.target.value)}
                  placeholder="What have you watched or read lately? Share your thoughts with fellow enthusiasts..."
                  className="w-full bg-[#14181c] border border-[#2c3440] focus:border-[#00e054] rounded-[3px] p-3 text-xs text-white focus:outline-none resize-none placeholder-[#667788]"
                />

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#667788]">
                    Real community discussions across cinema, TV, anime, and books.
                  </span>
                  <button
                    type="submit"
                    disabled={posting || !newPostBody.trim()}
                    className="bg-[#00e054] hover:bg-[#00c74a] text-[#14181c] font-mono font-bold text-xs uppercase px-4 py-2 rounded-[3px] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{posting ? 'Publishing...' : 'Share'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Feed Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#2c3440] pb-2 text-xs font-mono">
                <span className="uppercase tracking-widest text-white font-bold">Community Stream</span>
                <span className="text-[#667788]">{feedPosts.length} reflections</span>
              </div>

              {feedPosts.length === 0 ? (
                <div className="p-8 text-center bg-[#1b2228] border border-[#2c3440] rounded-[3px] text-xs font-mono text-[#667788]">
                  No reflections published yet. Be the first to share your perspective.
                </div>
              ) : (
                feedPosts.map((post) => {
                  const isLiked = likedPosts[post.id];
                  const areCommentsOpen = activeCommentsPostId === post.id;
                  const comments = commentsMap[post.id] || [];

                  return (
                    <article
                      key={post.id}
                      className="bg-[#1b2228] border border-[#2c3440] hover:border-[#445566] rounded-[3px] p-4 space-y-3 transition-colors"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <Link
                            to={`/profile/${post.username}`}
                            className="w-7 h-7 rounded-[3px] bg-[#2c3440] text-white flex items-center justify-center font-mono text-xs font-bold uppercase hover:bg-[#445566] transition-colors"
                          >
                            {post.avatarUrl ? (
                              <img src={post.avatarUrl} alt={post.username} className="w-full h-full object-cover rounded-[3px]" />
                            ) : (
                              post.username.substring(0, 1)
                            )}
                          </Link>
                          <div>
                            <Link
                              to={`/profile/${post.username}`}
                              className="text-xs font-mono font-bold text-white hover:text-[#00e054] transition-colors"
                            >
                              @{post.username}
                            </Link>
                            <span className="text-[11px] font-mono text-[#667788] ml-2">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {post.content && (
                          <Link
                            to={`/content/${post.content.id}`}
                            className="text-[10px] font-mono uppercase bg-[#202830] text-[#c8d4e0] px-2 py-0.5 rounded-[2px] border border-[#2c3440] hover:border-[#00e054]"
                          >
                            {post.content.title}
                          </Link>
                        )}
                      </div>

                      {/* Post Body */}
                      <p className="text-xs sm:text-sm text-[#c8d4e0] leading-relaxed whitespace-pre-wrap font-sans">
                        {post.body}
                      </p>

                      {/* Interaction Actions */}
                      <div className="flex items-center space-x-4 pt-2 border-t border-[#2c3440]/60 text-xs font-mono text-[#667788]">
                        <button
                          type="button"
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center space-x-1.5 transition-colors ${
                            isLiked ? 'text-[#ff8000] font-bold' : 'hover:text-[#ff8000]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ff8000] text-[#ff8000]' : ''}`} />
                          <span>Appreciate</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleComments(post.id)}
                          className="flex items-center space-x-1.5 hover:text-white transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Comments ({comments.length})</span>
                        </button>
                      </div>

                      {/* Comments Drawer */}
                      {areCommentsOpen && (
                        <div className="pt-3 border-t border-[#2c3440]/60 space-y-3">
                          {comments.map((comm) => (
                            <div key={comm.id} className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px] text-xs space-y-1">
                              <div className="flex items-center justify-between text-[#667788] font-mono text-[11px]">
                                <span className="text-[#00e054] font-bold">@{comm.author?.username}</span>
                                <span>{new Date(comm.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-[#c8d4e0]">{comm.body}</p>
                            </div>
                          ))}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCommentText}
                              onChange={(e) => setNewCommentText(e.target.value)}
                              placeholder="Write a comment..."
                              className="flex-1 bg-[#14181c] border border-[#2c3440] focus:border-[#00e054] text-white text-xs px-3 py-1.5 rounded-[3px] focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.id)}
                              className="bg-[#2c3440] hover:bg-[#00e054] hover:text-[#14181c] text-white font-mono text-xs px-3 py-1.5 rounded-[3px] font-bold transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Taste Recommendations & Canonical Discovery */}
          <div className="lg:col-span-4 space-y-6">
            {/* Taste Compatibility Box */}
            <div className="bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-4 space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#2c3440] pb-2">
                <Users className="w-4 h-4 text-[#00e054]" />
                <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                  Taste Matches
                </h3>
              </div>

              {tasteRecs.length === 0 ? (
                <p className="text-xs font-mono text-[#667788]">
                  Log ratings and add favorites to your profile to discover members with shared perspectives.
                </p>
              ) : (
                <div className="space-y-3">
                  {tasteRecs.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-[#14181c] border border-[#2c3440] rounded-[3px] space-y-2 hover:border-[#445566] transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          to={`/profile/${rec.username}`}
                          className="font-mono text-xs font-bold text-white hover:text-[#00e054] transition-colors"
                        >
                          @{rec.username}
                        </Link>
                        <span className="text-[10px] font-mono text-[#00e054] bg-[#00e054]/10 px-1.5 py-0.5 rounded-[2px] border border-[#00e054]/20">
                          {rec.sharedTitlesCount} shared
                        </span>
                      </div>

                      <p className="text-[11px] font-sans text-[#99aabb] leading-relaxed">
                        {rec.explanation}
                      </p>

                      <div className="pt-1">
                        <Link
                          to={`/profile/${rec.username}`}
                          className="inline-block text-[10px] font-mono uppercase text-[#40bcf4] hover:underline"
                        >
                          View Member Diary &rarr;
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Categories Guide */}
            <div className="bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-4 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-widest text-white font-bold border-b border-[#2c3440] pb-2">
                Browse Archive
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <Link
                  to="/movies"
                  className="p-2.5 bg-[#14181c] border border-[#2c3440] hover:border-[#40bcf4] rounded-[3px] text-[#c8d4e0] hover:text-white transition-colors block"
                >
                  <Film className="w-3.5 h-3.5 text-[#40bcf4] mb-1" />
                  <span>Feature Films</span>
                </Link>
                <Link
                  to="/shows"
                  className="p-2.5 bg-[#14181c] border border-[#2c3440] hover:border-[#ff8000] rounded-[3px] text-[#c8d4e0] hover:text-white transition-colors block"
                >
                  <Tv className="w-3.5 h-3.5 text-[#ff8000] mb-1" />
                  <span>Television</span>
                </Link>
                <Link
                  to="/anime"
                  className="p-2.5 bg-[#14181c] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] text-[#c8d4e0] hover:text-white transition-colors block"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00e054] mb-1" />
                  <span>Anime</span>
                </Link>
                <Link
                  to="/books"
                  className="p-2.5 bg-[#14181c] border border-[#2c3440] hover:border-amber-400 rounded-[3px] text-[#c8d4e0] hover:text-white transition-colors block"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400 mb-1" />
                  <span>Literature</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Track Modal */}
      <TrackModal
        item={trackingItem}
        isOpen={!!trackingItem}
        onClose={() => setTrackingItem(null)}
      />
    </div>
  );
};
