import React, { useState, useEffect } from 'react';
import { Film, Tv, Sparkles, BookOpen, Search, Filter } from 'lucide-react';
import { contentService } from '../services/contentService';
import { ContentCard } from '../components/ContentCard';
import { TrackModal } from '../components/TrackModal';
import { ReviewModal } from '../components/ReviewModal';
import { ListAddModal } from '../components/ListAddModal';
import { ContentItem, ContentType } from '../types';

interface CategoryPageProps {
  category: ContentType;
}

const CATEGORY_META: Record<
  ContentType,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    genres: string[];
  }
> = {
  MOVIE: {
    title: 'Films & Cinema',
    description: 'Explore curated masterworks, independent cinema, canonical releases, and member ratings.',
    icon: <Film className="w-5 h-5 text-[#00e054]" />,
    genres: ['All', 'Sci-Fi', 'Drama', 'Mystery', 'Action', 'Animation', 'Crime', 'Romance', 'Thriller'],
  },
  SHOW: {
    title: 'Television & Episodic Series',
    description: 'Follow serialized narratives, limited series, television dramas, and episodic commentary.',
    icon: <Tv className="w-5 h-5 text-[#40bcf4]" />,
    genres: ['All', 'Drama', 'Sci-Fi', 'Mystery', 'Crime', 'Fantasy', 'Comedy', 'Thriller'],
  },
  ANIME: {
    title: 'Anime Productions',
    description: 'Seasonal series, cinematic animation, studio productions, and visual storytelling.',
    icon: <Sparkles className="w-5 h-5 text-[#ff8000]" />,
    genres: ['All', 'Fantasy', 'Adventure', 'Action', 'Drama', 'Sci-Fi', 'Romance', 'Slice of Life'],
  },
  BOOK: {
    title: 'Books & Literature',
    description: 'Novels, memoirs, translated poetry, speculative fiction, and reflective reader reviews.',
    icon: <BookOpen className="w-5 h-5 text-[#00e054]" />,
    genres: ['All', 'Fiction', 'Fantasy', 'Mystery', 'Philosophy', 'Sci-Fi', 'Classic', 'Non-Fiction'],
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const meta = CATEGORY_META[category];
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Modals state
  const [trackingItem, setTrackingItem] = useState<ContentItem | null>(null);
  const [reviewItem, setReviewItem] = useState<ContentItem | null>(null);
  const [listAddTarget, setListAddTarget] = useState<ContentItem | null>(null);

  const loadContent = (currentPage: number, append: boolean = false) => {
    setLoading(true);
    const genreParam = selectedGenre === 'All' ? undefined : selectedGenre;

    if (searchQuery.trim()) {
      contentService
        .search(searchQuery.trim(), category)
        .then((res) => {
          setItems(res);
          setHasMore(false);
          setLoading(false);
        })
        .catch(() => {
          setItems([]);
          setLoading(false);
        });
      return;
    }

    contentService
      .discover(category, currentPage, 18, genreParam, sortBy)
      .then((res) => {
        if (append) {
          setItems((prev) => [...prev, ...res]);
        } else {
          setItems(res);
        }
        setHasMore(res.length === 18);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    setPage(0);
    loadContent(0, false);
  }, [category, selectedGenre, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    loadContent(0, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadContent(nextPage, true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#99aabb]">
      {/* Category Header */}
      <header className="border-b border-[#2c3440] pb-6">
        <div className="flex items-center gap-2 mb-2">
          {meta.icon}
          <span className="text-xs uppercase tracking-widest font-bold text-[#8899aa]">Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{meta.title}</h1>
        <p className="mt-2 text-sm text-[#8899aa] max-w-2xl font-sans">
          {meta.description}
        </p>
      </header>

      {/* Filter and Search Bar */}
      <div className="bg-[#1b2228] p-4 border border-[#2c3440] rounded-[3px] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8899aa]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${category.toLowerCase()} catalog...`}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
            />
          </form>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8899aa]" />
            <label htmlFor="category-sort" className="text-xs font-bold uppercase tracking-wider text-[#8899aa]">
              Sort:
            </label>
            <select
              id="category-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-[#14181c] border border-[#2c3440] px-3 py-2 rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
            >
              <option value="recent">Recently Added</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Release Year</option>
            </select>
          </div>
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-[#2c3440]">
          <span className="text-xs uppercase font-bold tracking-wider text-[#667788] mr-1">Genre:</span>
          {meta.genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                setSelectedGenre(g);
                setSearchQuery('');
              }}
              className={`px-3 py-1 text-xs rounded-[3px] transition-colors border ${
                selectedGenre === g
                  ? 'bg-[#00e054] text-[#14181c] font-bold border-[#00e054]'
                  : 'bg-[#14181c] text-[#8899aa] border-[#2c3440] hover:border-[#445566] hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      {loading && items.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="aspect-[2/3] bg-[#1b2228] rounded-[3px] border border-[#2c3440]" />
              <div className="h-4 bg-[#1b2228] rounded-[3px] w-3/4" />
              <div className="h-3 bg-[#1b2228] rounded-[3px] w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
          <p className="text-sm text-[#8899aa]">No titles found matching this selection.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {items.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onTrack={(it) => setTrackingItem(it)}
              />
            ))}
          </div>

          {hasMore && !searchQuery.trim() && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#1b2228] border border-[#2c3440] text-white hover:border-[#00e054] hover:text-[#00e054] rounded-[3px] transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading Catalog...' : 'Load More Titles'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TrackModal
        item={trackingItem}
        isOpen={!!trackingItem}
        onClose={() => setTrackingItem(null)}
      />

      <ReviewModal
        item={reviewItem}
        isOpen={!!reviewItem}
        onClose={() => setReviewItem(null)}
      />

      <ListAddModal
        item={listAddTarget}
        isOpen={!!listAddTarget}
        onClose={() => setListAddTarget(null)}
      />
    </div>
  );
};
