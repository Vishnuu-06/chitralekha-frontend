import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Film, Tv, Sparkles, BookOpen, User as UserIcon, SlidersHorizontal } from 'lucide-react';
import { contentService } from '../services/contentService';
import { socialService } from '../services/socialService';
import { ContentCard } from '../components/ContentCard';
import { TrackModal } from '../components/TrackModal';
import { ContentItem } from '../types';

export const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('type') || 'ALL';

  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [results, setResults] = useState<ContentItem[]>([]);
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [trackingItem, setTrackingItem] = useState<ContentItem | null>(null);

  const categories = [
    { key: 'ALL', label: 'All Stories', icon: null },
    { key: 'MOVIE', label: 'Films', icon: Film },
    { key: 'SHOW', label: 'TV Shows', icon: Tv },
    { key: 'ANIME', label: 'Anime', icon: Sparkles },
    { key: 'BOOK', label: 'Books', icon: BookOpen },
    { key: 'PEOPLE', label: 'Members', icon: UserIcon },
  ];

  const genres = [
    'ALL',
    'Sci-Fi',
    'Drama',
    'Fantasy',
    'Thriller',
    'Adventure',
    'Mystery',
    'Action',
    'Literary',
  ];

  const executeSearch = async (searchTerm: string, category: string, genre: string, sort: string) => {
    setLoading(true);
    try {
      if (category === 'PEOPLE') {
        const users = await socialService.searchUsers(searchTerm);
        setUserResults(users);
        setResults([]);
      } else if (searchTerm.trim()) {
        const items = await contentService.search(searchTerm, category);
        setResults(items);
        setUserResults([]);
      } else {
        const type = category === 'ALL' ? 'MOVIE' : category;
        const items = await contentService.discover(type, 0, 24, genre === 'ALL' ? undefined : genre, sort);
        setResults(items);
        setUserResults([]);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
      setUserResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(query, selectedCategory, selectedGenre, sortBy);
  }, [selectedCategory, selectedGenre, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, type: selectedCategory });
    executeSearch(query, selectedCategory, selectedGenre, sortBy);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#99aabb]">
      {/* Search Header */}
      <div className="bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-6 space-y-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SEARCH &amp; DISCOVER
          </h1>
          <p className="text-xs text-[#8899aa] mt-1">
            Explore films, episodic series, anime, books, and fellow story lovers.
          </p>
        </div>

        {/* Search input bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#8899aa]">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, director, author, or member username..."
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px] transition-colors"
          >
            Search
          </button>
        </form>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 text-xs rounded-[3px] uppercase font-bold tracking-wider transition-colors flex items-center space-x-1.5 border ${
                  active
                    ? 'border-[#00e054] bg-[#00e054] text-[#14181c]'
                    : 'border-[#2c3440] bg-[#14181c] text-[#8899aa] hover:border-[#445566] hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls: Genres and Sorting */}
      {selectedCategory !== 'PEOPLE' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#2c3440] pb-4">
          {/* Genre Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#667788] mr-1 flex items-center space-x-1">
              <SlidersHorizontal className="w-3 h-3" />
              <span>Genre:</span>
            </span>
            {genres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGenre(g)}
                className={`px-2 py-0.5 text-[11px] rounded-[2px] border transition-colors ${
                  selectedGenre === g
                    ? 'border-[#40bcf4] bg-[#40bcf4]/20 text-[#40bcf4] font-bold'
                    : 'border-[#2c3440] bg-[#1b2228] text-[#8899aa] hover:border-[#445566] hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-xs text-[#8899aa] self-end sm:self-auto">
            <span className="uppercase font-bold tracking-wider text-[11px]">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1 border border-[#2c3440] rounded-[3px] bg-[#1b2228] text-white text-xs focus:outline-none focus:border-[#00e054]"
            >
              <option value="recent">Recently Added</option>
              <option value="year">Release Year</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      )}

      {/* Results Section */}
      {loading ? (
        <div className="py-16 text-center text-[#8899aa] text-xs">
          Searching catalog and verified metadata providers...
        </div>
      ) : selectedCategory === 'PEOPLE' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {userResults.length === 0 ? (
            <div className="col-span-full py-12 text-center text-[#8899aa] text-xs">
              No matching members found for "{query}".
            </div>
          ) : (
            userResults.map((u) => (
              <Link
                key={u.id}
                to={`/profile/${u.username}`}
                className="p-4 bg-[#1b2228] border border-[#2c3440] rounded-[3px] flex items-center space-x-3 hover:border-[#00e054] transition-colors group"
              >
                {u.avatarUrl ? (
                  <img
                    src={u.avatarUrl}
                    alt={u.username}
                    className="w-10 h-10 rounded-[3px] object-cover border border-[#2c3440]"
                  />
                ) : (
                  <span className="w-10 h-10 rounded-[3px] bg-[#202830] text-[#00e054] font-bold flex items-center justify-center uppercase border border-[#2c3440]">
                    {u.username[0]}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-white group-hover:text-[#40bcf4] transition-colors truncate">
                    {u.displayName || u.username}
                  </span>
                  <span className="block text-[11px] text-[#8899aa]">@{u.username}</span>
                  {u.bio && <p className="text-[11px] text-[#ccddee] truncate mt-0.5">{u.bio}</p>}
                </div>
              </Link>
            ))
          )}
        </div>
      ) : (
        <div>
          {results.length === 0 ? (
            <div className="py-16 text-center bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-8 space-y-2">
              <p className="text-base font-bold text-white">
                No matching titles found
              </p>
              <p className="text-xs text-[#8899aa] max-w-sm mx-auto">
                Try alternative spelling, searching by original creator, or browsing categories from the navigation bar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {results.map((item) => (
                <ContentCard key={item.id} item={item} onTrack={(i) => setTrackingItem(i)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Global Tracking Modal */}
      <TrackModal
        item={trackingItem}
        isOpen={Boolean(trackingItem)}
        onClose={() => setTrackingItem(null)}
      />
    </div>
  );
};
