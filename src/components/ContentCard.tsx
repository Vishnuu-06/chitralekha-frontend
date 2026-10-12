import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Film, Tv, Sparkles, BookOpen, Eye, Bookmark, Heart } from 'lucide-react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  onTrack?: (item: ContentItem) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onTrack }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryBadge = (type: string) => {
    switch (type) {
      case 'MOVIE':
        return { label: 'Film', icon: Film, color: 'text-[#40bcf4] bg-[#40bcf4]/10 border-[#40bcf4]/30' };
      case 'SHOW':
        return { label: 'Series', icon: Tv, color: 'text-[#ff8000] bg-[#ff8000]/10 border-[#ff8000]/30' };
      case 'ANIME':
        return { label: 'Anime', icon: Sparkles, color: 'text-[#00e054] bg-[#00e054]/10 border-[#00e054]/30' };
      case 'BOOK':
        return { label: 'Book', icon: BookOpen, color: 'text-amber-300 bg-amber-400/10 border-amber-400/30' };
      default:
        return { label: type, icon: Film, color: 'text-white/70 bg-white/10 border-white/20' };
    }
  };

  const badge = getCategoryBadge(item.contentType);
  const Icon = badge.icon;

  return (
    <div
      className="group relative flex flex-col bg-[#1b2228] border border-[#2c3440] rounded-[3px] overflow-hidden hover:border-[#00e054] hover:shadow-[0_0_12px_rgba(0,224,84,0.2)] transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] bg-[#202830] overflow-hidden">
        <Link to={`/content/${item.id}`} className="block w-full h-full">
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={item.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-[#667788]">
              <Icon className="w-8 h-8 mb-2 stroke-[1.5]" />
              <span className="text-xs font-serif italic text-[#99aabb] line-clamp-2">{item.title}</span>
            </div>
          )}
        </Link>

        {/* Category Pill */}
        <div className="absolute top-2 left-2 z-10">
          <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 text-[10px] uppercase font-mono tracking-wider font-semibold rounded-[2px] border backdrop-blur-xs ${badge.color}`}>
            <Icon className="w-2.5 h-2.5" />
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Rating Score Badge */}
        {item.averageRating != null && (
          <div className="absolute top-2 right-2 z-10 bg-[#14181c]/90 text-white px-1.5 py-0.5 text-[10px] font-mono font-bold flex items-center space-x-1 rounded-[2px] border border-[#2c3440]">
            <Star className="w-2.5 h-2.5 text-[#ff8000] fill-[#ff8000]" />
            <span>{item.averageRating.toFixed(1)}</span>
          </div>
        )}

        {/* Letterboxd hover quick-action bar */}
        {isHovered && onTrack && (
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2 flex items-center justify-around animate-fade-in">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTrack(item);
              }}
              className="p-1.5 text-white hover:text-[#00e054] transition-colors rounded-[2px] hover:bg-white/10"
              title="Log or track title"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTrack(item);
              }}
              className="p-1.5 text-white hover:text-[#ff8000] transition-colors rounded-[2px] hover:bg-white/10"
              title="Rate or review"
            >
              <Star className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onTrack(item);
              }}
              className="p-1.5 text-white hover:text-[#40bcf4] transition-colors rounded-[2px] hover:bg-white/10"
              title="Add to watchlist"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Copy */}
      <div className="p-2.5 flex-1 flex flex-col justify-between bg-[#1b2228]">
        <div>
          <Link
            to={`/content/${item.id}`}
            className="block font-sans font-bold text-xs text-white line-clamp-1 group-hover:text-[#00e054] transition-colors"
          >
            {item.title}
          </Link>
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#667788] mt-0.5">
            {item.releaseYear && <span>{item.releaseYear}</span>}
            {item.releaseYear && item.creators && <span>•</span>}
            {item.creators && <span className="line-clamp-1 truncate max-w-[120px]">{item.creators}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
