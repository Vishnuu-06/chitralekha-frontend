import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Plus, Globe, Lock, Layers, Calendar, User } from 'lucide-react';
import { listService } from '../services/listService';
import { useAuth } from '../context/AuthContext';
import { ListSummary } from '../types';

export const ListsPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'public' | 'my'>('public');
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New list form state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');
  const [newListDesc, setNewListDesc] = useState<string>('');
  const [newListVisibility, setNewListVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [creating, setCreating] = useState<boolean>(false);

  const loadLists = () => {
    setLoading(true);
    if (activeTab === 'my' && user) {
      listService
        .getUserLists(user.username)
        .then((data) => {
          setLists(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      listService
        .getPublicLists()
        .then((data) => {
          setLists(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadLists();
  }, [activeTab, user]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    setCreating(true);
    try {
      await listService.createList({
        name: newListName.trim(),
        description: newListDesc.trim(),
        visibility: newListVisibility,
      });
      setNewListName('');
      setNewListDesc('');
      setShowCreateModal(false);
      setActiveTab('my');
      loadLists();
    } catch {
      alert('Failed to create list.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#99aabb]">
      {/* Header */}
      <header className="border-b border-[#2c3440] pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[#8899aa]">
            <Layers className="w-4 h-4 text-[#00e054]" />
            <span className="text-xs uppercase tracking-widest font-bold">Curations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">THEMATIC LISTS &amp; CANONS</h1>
          <p className="mt-1 text-xs sm:text-sm text-[#8899aa]">
            Member-curated anthologies, seasonal watchlists, and thematic recommendations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!user) openAuthModal();
            else setShowCreateModal(true);
          }}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] hover:bg-[#00c84b] text-[#14181c] rounded-[3px] flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New List</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#2c3440] text-xs uppercase tracking-wider font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('public')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'public'
              ? 'border-[#00e054] text-white'
              : 'border-transparent text-[#8899aa] hover:text-white'
          }`}
        >
          COMMUNITY LISTS
        </button>

        {user && (
          <button
            type="button"
            onClick={() => setActiveTab('my')}
            className={`pb-3 border-b-2 transition-colors ${
              activeTab === 'my'
                ? 'border-[#00e054] text-white'
                : 'border-transparent text-[#8899aa] hover:text-white'
            }`}
          >
            MY LISTS
          </button>
        )}
      </div>

      {/* Lists Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 bg-[#1b2228] border border-[#2c3440] rounded-[3px] animate-pulse space-y-3">
              <div className="h-4 bg-[#202830] rounded-[3px] w-3/4" />
              <div className="h-3 bg-[#202830] rounded-[3px] w-1/2" />
              <div className="h-12 bg-[#202830] rounded-[3px]" />
            </div>
          ))}
        </div>
      ) : lists.length === 0 ? (
        <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
          <p className="text-sm text-[#8899aa]">
            {activeTab === 'my'
              ? 'You have not created any lists yet.'
              : 'No public lists available at this time.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((lst) => (
            <Link
              key={lst.id}
              to={`/lists/${lst.id}`}
              className="p-5 bg-[#1b2228] border border-[#2c3440] hover:border-[#00e054] rounded-[3px] transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#8899aa]">
                  <span className="flex items-center gap-1.5">
                    {lst.visibility === 'PUBLIC' ? (
                      <Globe className="w-3 h-3 text-[#40bcf4]" />
                    ) : (
                      <Lock className="w-3 h-3 text-[#ff8000]" />
                    )}
                    <span className="uppercase text-[10px] font-bold">{lst.visibility}</span>
                  </span>
                  <span className="bg-[#202830] px-2 py-0.5 rounded-[2px] border border-[#2c3440] text-[11px] font-bold text-white">
                    {lst.items ? lst.items.length : 0} items
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white group-hover:text-[#40bcf4] transition-colors">
                  {lst.name}
                </h2>

                {lst.description && (
                  <p className="text-xs text-[#8899aa] line-clamp-2 leading-relaxed">
                    {lst.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-[#2c3440] flex items-center justify-between text-[11px] text-[#8899aa]">
                <span className="flex items-center gap-1 text-white font-medium">
                  <User className="w-3 h-3 text-[#8899aa]" />
                  @{lst.owner?.username}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(lst.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-6 space-y-5 shadow-2xl">
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Create New List</h2>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  List Title
                </label>
                <input
                  type="text"
                  required
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g. Essential 70s Cinema, Rainy Day Reads"
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  placeholder="The thematic concept or context for this curation..."
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Visibility
                </label>
                <select
                  value={newListVisibility}
                  onChange={(e) => setNewListVisibility(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
                >
                  <option value="PUBLIC">Public (Visible to community)</option>
                  <option value="PRIVATE">Private (Only visible to you)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#8899aa] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] hover:bg-[#00c84b] text-[#14181c] rounded-[3px] disabled:opacity-50 transition-colors"
                >
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
