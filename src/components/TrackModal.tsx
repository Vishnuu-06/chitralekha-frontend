import React, { useState, useEffect } from 'react';
import { X, Heart, Check, Trash2 } from 'lucide-react';
import { ContentItem, TrackingStatus } from '../types';
import { trackingService } from '../services/trackingService';
import { useAuth } from '../context/AuthContext';

interface TrackModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TrackModal: React.FC<TrackModalProps> = ({ item, isOpen, onClose, onSuccess }) => {
  const { user, openAuthModal } = useAuth();
  const [status, setStatus] = useState<TrackingStatus>('WANT_TO_WATCH');
  const [progress, setProgress] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [hasExisting, setHasExisting] = useState<boolean>(false);

  useEffect(() => {
    if (item && isOpen && user) {
      trackingService
        .getTrackingForContent(item.id)
        .then((res) => {
          if ('tracked' in res && res.tracked === false) {
            setHasExisting(false);
            if (item.contentType === 'BOOK') {
              setStatus('WANT_TO_READ');
            } else {
              setStatus('WANT_TO_WATCH');
            }
            setProgress(0);
            setIsFavorite(false);
          } else {
            const data = res as any;
            setHasExisting(true);
            setStatus(data.status);
            setProgress(data.progress || 0);
            setIsFavorite(data.isFavorite || false);
          }
        })
        .catch(() => {});
    }
  }, [item, isOpen, user]);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    setSaving(true);
    try {
      await trackingService.updateTracking(item.id, {
        status,
        progress,
        isFavorite,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to save tracking record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Remove this title from your tracking shelf?')) return;
    setSaving(true);
    try {
      await trackingService.deleteTracking(item.id);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to delete tracking record');
    } finally {
      setSaving(false);
    }
  };

  const getStatusOptions = () => {
    if (item.contentType === 'BOOK') {
      return [
        { value: 'WANT_TO_READ', label: 'Want to Read' },
        { value: 'READING', label: 'Currently Reading' },
        { value: 'READ', label: 'Finished Reading' },
        { value: 'ON_HOLD', label: 'On Hold' },
        { value: 'DROPPED', label: 'Dropped' },
      ];
    }
    if (item.contentType === 'MOVIE') {
      return [
        { value: 'WANT_TO_WATCH', label: 'Want to Watch' },
        { value: 'WATCHED', label: 'Watched' },
      ];
    }
    return [
      { value: 'WANT_TO_WATCH', label: 'Want to Watch' },
      { value: 'WATCHING', label: 'Currently Watching' },
      { value: 'COMPLETED', label: 'Completed' },
      { value: 'ON_HOLD', label: 'On Hold' },
      { value: 'DROPPED', label: 'Dropped' },
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1b2228] w-full max-w-md border border-[#2c3440] rounded-[3px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-[#99aabb]">
        <div className="px-5 py-4 border-b border-[#2c3440] flex items-center justify-between bg-[#14181c]">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Log or Track</h3>
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

        <div className="p-5 space-y-4">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-2">
              Shelf Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {getStatusOptions().map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value as TrackingStatus)}
                  className={`px-3 py-2 text-xs font-medium text-left border rounded-[3px] transition-all flex items-center justify-between ${
                    status === opt.value
                      ? 'border-[#00e054] bg-[#00e054]/10 text-white font-bold'
                      : 'border-[#2c3440] bg-[#14181c] hover:border-[#445566] text-[#8899aa]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {status === opt.value && <Check className="w-3.5 h-3.5 text-[#00e054]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Tracker (for TV, Anime, Books) */}
          {item.contentType !== 'MOVIE' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                Progress ({item.contentType === 'BOOK' ? 'Pages' : 'Episodes'})
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="0"
                  max={item.totalItems || 9999}
                  value={progress}
                  onChange={(e) => setProgress(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-24 px-3 py-1.5 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
                />
                {item.totalItems && (
                  <span className="text-xs text-[#8899aa]">
                    of {item.totalItems} {item.contentType === 'BOOK' ? 'pages' : 'episodes'}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Favorite Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center space-x-2 px-3 py-2 text-xs rounded-[3px] border transition-colors w-full ${
                isFavorite
                  ? 'border-[#ff8000] bg-[#ff8000]/10 text-white font-bold'
                  : 'border-[#2c3440] bg-[#14181c] text-[#8899aa] hover:border-[#445566]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#ff8000] text-[#ff8000]' : ''}`} />
              <span>{isFavorite ? 'Designated as Favorite' : 'Mark as Personal Favorite'}</span>
            </button>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3 bg-[#14181c] border-t border-[#2c3440] flex items-center justify-between">
          {hasExisting ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={saving}
              className="text-xs text-[#ff8000] hover:text-[#ff9933] flex items-center space-x-1 font-bold uppercase tracking-wider"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#8899aa] hover:text-white rounded-[2px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px] transition-colors shadow-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Log'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
