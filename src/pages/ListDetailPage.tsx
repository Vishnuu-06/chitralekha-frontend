import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Globe, Lock, Trash2, ArrowLeft, Calendar, User, Film, Tv, Sparkles, BookOpen } from 'lucide-react';
import { listService } from '../services/listService';
import { useAuth } from '../context/AuthContext';
import { ListSummary } from '../types';

export const ListDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const listId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [list, setList] = useState<ListSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);

  const loadList = () => {
    if (!listId) return;
    setLoading(true);
    listService
      .getListDetails(listId)
      .then((data) => {
        setList(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadList();
  }, [listId]);

  const handleDeleteList = async () => {
    if (!confirm('Are you sure you want to delete this list? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await listService.deleteList(listId);
      navigate('/lists');
    } catch {
      alert('Failed to delete list.');
      setDeleting(false);
    }
  };

  const handleRemoveItem = async (contentId: number) => {
    if (!confirm('Remove this title from your list?')) return;
    try {
      await listService.removeItem(listId, contentId);
      loadList();
    } catch {
      alert('Failed to remove item.');
    }
  };

  const isOwner = user && list && user.username === list.owner?.username;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-[#202830] rounded-[3px] w-1/3" />
        <div className="h-20 bg-[#1b2228] rounded-[3px]" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-white">List Not Found</h1>
        <p className="mt-2 text-sm text-[#8899aa]">The requested curation could not be located or is private.</p>
        <Link
          to="/lists"
          className="inline-block mt-6 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px]"
        >
          Return to Lists
        </Link>
      </div>
    );
  }

  const items = list.items || [];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#99aabb]">
      <Link
        to="/lists"
        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-[#8899aa] hover:text-[#00e054] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to lists</span>
      </Link>

      {/* List Header */}
      <header className="border-b border-[#2c3440] pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#8899aa]">
              {list.visibility === 'PUBLIC' ? (
                <span className="flex items-center gap-1 text-[11px] uppercase font-bold text-[#40bcf4]">
                  <Globe className="w-3 h-3" /> Public List
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] uppercase font-bold text-[#ff8000]">
                  <Lock className="w-3 h-3" /> Private List
                </span>
              )}
              <span>•</span>
              <span className="font-bold text-white">{items.length} titles</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{list.name}</h1>
          </div>

          {isOwner && (
            <button
              type="button"
              onClick={handleDeleteList}
              disabled={deleting}
              className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ff8000] border border-[#ff8000]/40 hover:bg-[#ff8000] hover:text-[#14181c] rounded-[3px] transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete List</span>
            </button>
          )}
        </div>

        {list.description && (
          <p className="text-sm text-[#ccddee] leading-relaxed max-w-3xl">
            {list.description}
          </p>
        )}

        <div className="flex items-center gap-4 pt-2 text-xs text-[#8899aa]">
          <Link
            to={`/profile/${list.owner?.username}`}
            className="flex items-center gap-1.5 text-white font-bold hover:text-[#40bcf4] transition-colors"
          >
            <User className="w-3.5 h-3.5 text-[#8899aa]" />
            <span>Curated by @{list.owner?.username}</span>
          </Link>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Created {new Date(list.createdAt).toLocaleDateString()}</span>
          </span>
        </div>
      </header>

      {/* Items Section */}
      {items.length === 0 ? (
        <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
          <p className="text-sm text-[#8899aa]">
            No titles have been added to this curation yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-4 bg-[#1b2228] border border-[#2c3440] hover:border-[#445566] rounded-[3px] flex items-start gap-4 transition-colors"
            >
              <span className="text-lg font-black text-[#667788] w-8 pt-2">
                {String(index + 1).padStart(2, '0')}
              </span>

              <Link
                to={`/content/${item.content.id}`}
                className="w-16 sm:w-20 aspect-[2/3] bg-[#202830] rounded-[3px] overflow-hidden flex-shrink-0 border border-[#2c3440] hover:border-[#00e054] transition-colors shadow-md"
              >
                {item.content.posterUrl ? (
                  <img
                    src={item.content.posterUrl}
                    alt={item.content.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8899aa]">
                    Artwork
                  </div>
                )}
              </Link>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase bg-[#202830] border border-[#2c3440] text-[#40bcf4] rounded-[2px]">
                    {item.content.contentType}
                  </span>
                  {item.content.releaseYear && (
                    <span className="text-xs text-[#8899aa]">
                      {item.content.releaseYear}
                    </span>
                  )}
                </div>

                <Link
                  to={`/content/${item.content.id}`}
                  className="block text-base font-bold text-white hover:text-[#40bcf4] transition-colors truncate"
                >
                  {item.content.title}
                </Link>

                {item.notes && (
                  <p className="text-xs text-[#ccddee] italic bg-[#14181c] p-2 border-l-2 border-[#00e054] rounded-[2px] mt-1">
                    "{item.notes}"
                  </p>
                )}
              </div>

              {isOwner && (
                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.content.id)}
                  aria-label="Remove item"
                  className="text-[#667788] hover:text-[#ff8000] p-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
