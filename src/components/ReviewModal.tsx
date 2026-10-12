import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { ContentItem } from '../types';
import { reviewService } from '../services/reviewService';
import { trackingService } from '../services/trackingService';
import { useAuth } from '../context/AuthContext';

interface ReviewModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { user, openAuthModal } = useAuth();
  const [score, setScore] = useState<number>(8);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [containsSpoilers, setContainsSpoilers] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }

    setSubmitting(true);
    try {
      if (body.trim()) {
        await reviewService.createReview(item.id, {
          title: title.trim(),
          body: body.trim(),
          score,
          containsSpoilers,
        });
      } else {
        await reviewService.rateContent(item.id, score, title.trim());
        try {
          await trackingService.updateTracking(item.id, {
            status: item.contentType === 'BOOK' ? 'READ' : 'WATCHED',
          });
        } catch {
          // ignore tracking failure if rating succeeded
        }
      }
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save entry');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1b2228] w-full max-w-lg border border-[#2c3440] rounded-[3px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-[#99aabb]">
        <div className="px-5 py-4 border-b border-[#2c3440] flex items-center justify-between bg-[#14181c]">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Log or Review</h3>
            <p className="text-xs text-[#8899aa] line-clamp-1">{item.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8899aa] hover:text-white rounded-[2px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* 10-Point Rating Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-2">
              Your Rating (1 to 10 Scale)
            </label>
            <div className="flex items-center space-x-1 sm:space-x-1.5 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setScore(val)}
                  className={`w-8 h-8 rounded-[3px] text-xs font-black transition-all flex items-center justify-center ${
                    score === val
                      ? 'bg-[#00e054] text-[#14181c] shadow-md scale-105'
                      : 'border border-[#2c3440] bg-[#14181c] text-[#8899aa] hover:border-[#445566] hover:text-white'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#ff8000] mt-1.5 flex items-center space-x-1 font-bold">
              <Star className="w-3.5 h-3.5 fill-[#ff8000]" />
              <span>Selected rating: {score} out of 10</span>
            </p>
          </div>

          {/* Headline / Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A brief summary of your reaction..."
              className="w-full px-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
            />
          </div>

          {/* Long-form review body (OPTIONAL) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Review (Optional)
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What made this story memorable? Discuss direction, performances, pacing, or thematic depth (optional)..."
              className="w-full px-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054] leading-relaxed font-sans"
            />
          </div>

          {/* Spoilers toggle */}
          {body.trim() && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="spoilers"
                checked={containsSpoilers}
                onChange={(e) => setContainsSpoilers(e.target.checked)}
                className="rounded-[2px] border-[#2c3440] text-[#00e054] focus:ring-0 bg-[#14181c]"
              />
              <label htmlFor="spoilers" className="text-xs text-[#8899aa] select-none cursor-pointer">
                This review contains major plot spoilers
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-[#2c3440] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#8899aa] hover:text-white rounded-[2px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px] transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? 'Saving...' : body.trim() ? 'Publish Review' : 'Log & Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
