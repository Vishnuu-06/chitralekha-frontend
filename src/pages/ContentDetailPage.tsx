import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Bookmark,
  Edit3,
  ListPlus,
  ShieldAlert,
  Share2,
  Heart,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Check,
  Eye,
} from 'lucide-react';
import { contentService } from '../services/contentService';
import { trackingService } from '../services/trackingService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { TrackModal } from '../components/TrackModal';
import { ReviewModal } from '../components/ReviewModal';
import { ListAddModal } from '../components/ListAddModal';
import { ReportModal } from '../components/ReportModal';
import { ContentItem, ReviewItem, UserTrackingRecord } from '../types';

export const ContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const contentId = id ? parseInt(id, 10) : 0;
  const { user, openAuthModal } = useAuth();

  const [content, setContent] = useState<ContentItem | null>(null);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [tracking, setTracking] = useState<UserTrackingRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Modals state
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showListModal, setShowListModal] = useState<boolean>(false);
  const [reportTarget, setReportTarget] = useState<{ type: 'REVIEW' | 'POST'; id: number } | null>(null);

  // Review interaction state
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<number, boolean>>({});
  const [likedReviews, setLikedReviews] = useState<Record<number, boolean>>({});
  const [reviewComments, setReviewComments] = useState<Record<number, any[]>>({});
  const [openCommentsReviewId, setOpenCommentsReviewId] = useState<number | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');

  const loadData = () => {
    if (!contentId) return;
    setLoading(true);
    contentService
      .getDetails(contentId)
      .then((data) => {
        setContent(data);
        return contentService.getReviews(contentId);
      })
      .then((revs) => {
        setReviews(revs);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    if (user) {
      trackingService
        .getTrackingForContent(contentId)
        .then((res) => {
          if ('tracked' in res && res.tracked === false) {
            setTracking(null);
          } else {
            setTracking(res as UserTrackingRecord);
          }
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadData();
  }, [contentId, user]);

  const toggleSpoiler = (reviewId: number) => {
    setRevealedSpoilers((prev) => ({ ...prev, [reviewId]: !prev[reviewId] }));
  };

  const handleLikeReview = async (reviewId: number) => {
    if (!user) {
      openAuthModal();
      return;
    }
    try {
      const res = await reviewService.toggleLikeReview(reviewId);
      setLikedReviews((prev) => ({ ...prev, [reviewId]: res.liked }));
    } catch {
      // silently handle
    }
  };

  const toggleReviewComments = async (reviewId: number) => {
    if (openCommentsReviewId === reviewId) {
      setOpenCommentsReviewId(null);
      return;
    }
    setOpenCommentsReviewId(reviewId);
    try {
      const comments = await reviewService.getComments(reviewId);
      setReviewComments((prev) => ({ ...prev, [reviewId]: comments }));
    } catch {
      // ignore
    }
  };

  const handleAddReviewComment = async (reviewId: number) => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!commentInput.trim()) return;

    try {
      await reviewService.addComment(reviewId, commentInput.trim());
      setCommentInput('');
      const comments = await reviewService.getComments(reviewId);
      setReviewComments((prev) => ({ ...prev, [reviewId]: comments }));
    } catch {
      // ignore
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-[#202830] rounded-[3px] w-1/3" />
        <div className="flex gap-8">
          <div className="w-64 aspect-[2/3] bg-[#202830] rounded-[3px]" />
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-[#202830] rounded-[3px] w-1/2" />
            <div className="h-24 bg-[#1b2228] rounded-[3px]" />
          </div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">Title Not Found</h1>
        <p className="mt-2 text-sm text-[#8899aa]">The requested catalog entry could not be located.</p>
        <Link
          to="/discover"
          className="inline-block mt-6 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px]"
        >
          Return to Discovery
        </Link>
      </div>
    );
  }

  const isWatched = tracking && (tracking.status === 'WATCHED' || tracking.status === 'READ' || tracking.status === 'COMPLETED');
  const isWantToWatch = tracking && (tracking.status === 'WANT_TO_WATCH' || tracking.status === 'WANT_TO_READ');
  const isFavorite = tracking && tracking.isFavorite;

  return (
    <div className="min-h-screen text-[#99aabb]">
      {/* Letterboxd Backdrop Hero Banner */}
      <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-[#14181c] border-b border-[#2c3440]">
        {content.backdropUrl || content.posterUrl ? (
          <img
            src={content.backdropUrl || content.posterUrl}
            alt={content.title}
            className="w-full h-full object-cover object-center filter brightness-40 blur-[1px] transform scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-[#1b2228] to-[#14181c]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14181c] via-transparent to-[#14181c]/80" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10 pb-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Poster & Letterboxd Action Panel */}
          <div className="md:col-span-4 lg:col-span-3 space-y-4">
            <div className="aspect-[2/3] w-full bg-[#1b2228] rounded-[3px] overflow-hidden border border-[#2c3440] shadow-2xl">
              {content.posterUrl ? (
                <img
                  src={content.posterUrl}
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-[#8899aa] p-4 text-center">
                  Artwork unavailable
                </div>
              )}
            </div>

            {/* Letterboxd Action Panel */}
            <div className="bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-3 space-y-3 shadow-lg">
              {/* Quick Icons Row (Watched, Liked, Watchlist) */}
              <div className="grid grid-cols-3 gap-1 bg-[#14181c] p-1.5 rounded-[3px] border border-[#2c3440] text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (!user) openAuthModal();
                    else setShowTrackModal(true);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-[2px] transition-colors ${
                    isWatched
                      ? 'text-[#00e054] bg-[#00e054]/10 font-bold'
                      : 'text-[#8899aa] hover:text-white'
                  }`}
                  title={isWatched ? 'Watched' : 'Mark as watched'}
                >
                  <Eye className={`w-5 h-5 ${isWatched ? 'fill-[#00e054]' : ''}`} />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">
                    {isWatched ? 'Watched' : 'Watch'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!user) openAuthModal();
                    else setShowTrackModal(true);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-[2px] transition-colors ${
                    isFavorite
                      ? 'text-[#ff8000] bg-[#ff8000]/10 font-bold'
                      : 'text-[#8899aa] hover:text-white'
                  }`}
                  title={isFavorite ? 'Liked' : 'Like'}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#ff8000]' : ''}`} />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">
                    {isFavorite ? 'Liked' : 'Like'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!user) openAuthModal();
                    else setShowTrackModal(true);
                  }}
                  className={`flex flex-col items-center justify-center py-1.5 rounded-[2px] transition-colors ${
                    isWantToWatch
                      ? 'text-[#40bcf4] bg-[#40bcf4]/10 font-bold'
                      : 'text-[#8899aa] hover:text-white'
                  }`}
                  title={isWantToWatch ? 'In Watchlist' : 'Add to Watchlist'}
                >
                  <Bookmark className={`w-5 h-5 ${isWantToWatch ? 'fill-[#40bcf4]' : ''}`} />
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1">
                    {isWantToWatch ? 'Queued' : 'Watchlist'}
                  </span>
                </button>
              </div>

              {/* Primary Green Log Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (!user) openAuthModal();
                  else setShowReviewModal(true);
                }}
                className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded-[3px] flex items-center justify-center gap-2 bg-[#00e054] hover:bg-[#00c84b] text-[#14181c] shadow-md transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>+ Log or review</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!user) openAuthModal();
                  else setShowListModal(true);
                }}
                className="w-full py-2 px-3 text-xs font-bold uppercase tracking-wider bg-[#202830] hover:bg-[#2c3440] text-white border border-[#2c3440] rounded-[3px] flex items-center justify-center gap-2 transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5 text-[#8899aa]" />
                <span>Add to lists</span>
              </button>

              <button
                type="button"
                onClick={copyShareLink}
                className="w-full py-1.5 px-3 text-[11px] font-medium bg-transparent hover:bg-[#202830] text-[#8899aa] hover:text-white border border-[#2c3440] rounded-[3px] flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00e054]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Title, Metadata, Ratings & Overview */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            <div className="border-b border-[#2c3440] pb-5 space-y-2">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#202830] text-[#40bcf4] border border-[#2c3440] rounded-[2px]">
                  {content.contentType}
                </span>
                <span className="text-xs text-[#8899aa] uppercase tracking-wider">
                  Via {content.provider}
                </span>
              </div>

              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-sans">
                  {content.title}
                </h1>
                {content.releaseYear && (
                  <span className="text-xl sm:text-2xl text-[#8899aa] font-medium">
                    {content.releaseYear}
                  </span>
                )}
              </div>

              {content.creators && (
                <p className="text-sm text-[#99aabb] font-medium">
                  <span className="text-xs uppercase tracking-wider text-[#667788] mr-2">Created by</span>
                  <span className="text-white hover:text-[#40bcf4] transition-colors">{content.creators}</span>
                </p>
              )}
            </div>

            {/* Letterboxd Ratings Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[3px] bg-[#202830] border border-[#2c3440] flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#ff8000] fill-[#ff8000]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white">
                      {content.averageRating ? content.averageRating.toFixed(1) : 'Unrated'}
                    </span>
                    <span className="text-xs text-[#8899aa]">/ 10</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#667788]">Average Rating</span>
                </div>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-[#2c3440] pt-2 sm:pt-0 sm:pl-4 flex flex-col justify-center">
                <span className="text-base font-bold text-white">
                  {content.ratingsCount || 0}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#667788]">Community Ratings</span>
              </div>

              <div className="border-t sm:border-t-0 sm:border-l border-[#2c3440] pt-2 sm:pt-0 sm:pl-4 flex flex-col justify-center">
                <span className="text-base font-bold text-white">
                  {reviews.length}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#667788]">Member Reviews</span>
              </div>
            </div>

            {/* Overview / Synopsis */}
            <div className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8899aa]">Synopsis</h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#ccddee]">
                {content.description || 'No overview synopsis recorded for this title.'}
              </p>
            </div>

            {/* Genres / Tags */}
            {content.genres && (
              <div className="space-y-2 pt-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#8899aa]">Genres</h2>
                <div className="flex flex-wrap gap-1.5">
                  {content.genres.split(',').map((g) => (
                    <span
                      key={g.trim()}
                      className="px-2.5 py-1 text-xs bg-[#202830] border border-[#2c3440] text-[#99aabb] hover:text-white hover:border-[#445566] rounded-[2px] transition-colors"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Member Reviews & Perspectives Section */}
        <section className="border-t border-[#2c3440] pt-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wider text-white">
                POPULAR REVIEWS
              </h2>
              <p className="text-xs text-[#8899aa] mt-0.5">
                Thoughtful reflections and commentary from members
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!user) openAuthModal();
                else setShowReviewModal(true);
              }}
              className="px-3.5 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] hover:bg-[#00c84b] text-[#14181c] rounded-[3px] transition-colors"
            >
              + Review
            </button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
              <p className="text-sm text-[#8899aa]">
                No reviews logged yet. Be the first to share your thoughts on this work.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => {
                const isRevealed = revealedSpoilers[rev.id];
                const isLiked = likedReviews[rev.id];
                const areCommentsOpen = openCommentsReviewId === rev.id;
                const commentsList = reviewComments[rev.id] || [];

                return (
                  <article
                    key={rev.id}
                    className="p-5 bg-[#1b2228] border border-[#2c3440] rounded-[3px] space-y-3 hover:border-[#445566] transition-colors"
                  >
                    {/* Review Header */}
                    <div className="flex items-center justify-between border-b border-[#2c3440] pb-3">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/profile/${rev.author.username}`}
                          className="text-xs font-bold text-white hover:text-[#40bcf4] transition-colors"
                        >
                          @{rev.author.username}
                        </Link>
                        <span className="text-xs text-[#667788]">•</span>
                        <span className="text-xs text-[#8899aa]">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {rev.ratingScore > 0 && (
                          <div className="flex items-center gap-1 bg-[#14181c] px-2 py-0.5 border border-[#2c3440] rounded-[2px]">
                            <Star className="w-3 h-3 text-[#ff8000] fill-[#ff8000]" />
                            <span className="text-xs font-bold text-white">
                              {rev.ratingScore} / 10
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => setReportTarget({ type: 'REVIEW', id: rev.id })}
                          aria-label="Report review"
                          className="text-[#667788] hover:text-[#ff8000] transition-colors"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Review Title */}
                    {rev.title && (
                      <h3 className="text-base font-bold text-white">{rev.title}</h3>
                    )}

                    {/* Spoiler Warning */}
                    {rev.containsSpoilers && !isRevealed ? (
                      <div className="p-3 bg-[#202830] border border-[#ff8000]/30 rounded-[3px] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium text-[#ff8000]">
                          <AlertTriangle className="w-4 h-4" />
                          <span>This review contains spoilers.</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSpoiler(rev.id)}
                          className="text-xs uppercase font-bold text-white hover:text-[#00e054] underline"
                        >
                          Reveal
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-[#ccddee] leading-relaxed whitespace-pre-line font-sans">
                        {rev.body}
                      </p>
                    )}

                    {rev.containsSpoilers && isRevealed && (
                      <button
                        type="button"
                        onClick={() => toggleSpoiler(rev.id)}
                        className="text-xs text-[#8899aa] hover:text-white underline"
                      >
                        Hide spoilers
                      </button>
                    )}

                    {/* Interaction Row */}
                    <div className="flex items-center gap-5 pt-2 border-t border-[#2c3440] text-xs text-[#8899aa]">
                      <button
                        type="button"
                        onClick={() => handleLikeReview(rev.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isLiked ? 'text-[#ff8000] font-bold' : 'hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#ff8000] text-[#ff8000]' : ''}`} />
                        <span>{isLiked ? 'Liked' : 'Like'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleReviewComments(rev.id)}
                        className="flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Comments ({commentsList.length})</span>
                        {areCommentsOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    </div>

                    {/* Inline Comments */}
                    {areCommentsOpen && (
                      <div className="pt-3 border-t border-[#2c3440] space-y-3">
                        {commentsList.map((comm: any) => (
                          <div key={comm.id} className="p-2.5 bg-[#14181c] border border-[#2c3440] rounded-[3px] text-xs">
                            <div className="flex items-center justify-between text-[#8899aa] mb-1">
                              <span className="font-bold text-white">@{comm.author?.username}</span>
                              <span className="text-[11px] text-[#667788]">{new Date(comm.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-[#ccddee]">{comm.body}</p>
                          </div>
                        ))}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-1.5 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] text-white focus:outline-none focus:border-[#00e054]"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReviewComment(rev.id)}
                            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Modals */}
        <TrackModal
          item={content}
          isOpen={showTrackModal}
          onClose={() => setShowTrackModal(false)}
          onSuccess={loadData}
        />

        <ReviewModal
          item={content}
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSuccess={loadData}
        />

        <ListAddModal
          item={content}
          isOpen={showListModal}
          onClose={() => setShowListModal(false)}
        />

        {reportTarget && (
          <ReportModal
            reportedType={reportTarget.type}
            targetId={reportTarget.id}
            isOpen={!!reportTarget}
            onClose={() => setReportTarget(null)}
          />
        )}
      </div>
    </div>
  );
};
