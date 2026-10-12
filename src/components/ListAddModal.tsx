import React, { useState, useEffect } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { ContentItem, ListSummary } from '../types';
import { listService } from '../services/listService';
import { useAuth } from '../context/AuthContext';

interface ListAddModalProps {
  item: ContentItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ListAddModal: React.FC<ListAddModalProps> = ({ item, isOpen, onClose }) => {
  const { user, openAuthModal } = useAuth();
  const [lists, setLists] = useState<ListSummary[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [newListName, setNewListName] = useState<string>('');

  useEffect(() => {
    if (isOpen && user) {
      listService
        .getUserLists(user.username)
        .then((data) => {
          setLists(data);
          if (data.length > 0) setSelectedListId(data[0].id);
        })
        .catch(() => {});
    }
  }, [isOpen, user]);

  if (!isOpen || !item) return null;

  const handleAdd = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (!selectedListId) {
      alert('Please select or create a list');
      return;
    }

    setSaving(true);
    try {
      await listService.addItem(selectedListId, item.id, notes.trim());
      alert('Added to list!');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to add item to list');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    setSaving(true);
    try {
      const created = await listService.createList({
        name: newListName.trim(),
        visibility: 'PUBLIC',
      });
      setLists([created, ...lists]);
      setSelectedListId(created.id);
      setNewListName('');
      setShowCreate(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create list');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1b2228] w-full max-w-md border border-[#2c3440] rounded-[3px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-[#99aabb]">
        <div className="px-5 py-4 border-b border-[#2c3440] flex items-center justify-between bg-[#14181c]">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Add to List</h3>
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
          {showCreate ? (
            <form onSubmit={handleCreateList} className="space-y-3 p-3 bg-[#14181c] rounded-[3px] border border-[#2c3440]">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa]">
                New List Name
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="e.g. Atmospheric Autumn Cinema"
                className="w-full px-3 py-1.5 text-xs border border-[#2c3440] rounded-[3px] bg-[#1b2228] text-white focus:outline-none focus:border-[#00e054]"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-2.5 py-1 text-xs text-[#8899aa] hover:text-white rounded-[2px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px]"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa]">
                Choose a List
              </label>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="text-xs text-[#00e054] hover:text-[#00c84b] flex items-center space-x-1 font-bold uppercase tracking-wider"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New List</span>
              </button>
            </div>
          )}

          {lists.length === 0 ? (
            <p className="text-xs text-[#8899aa] italic py-2">
              You do not have any personal lists yet. Click New List above to start one.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {lists.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setSelectedListId(l.id)}
                  className={`w-full p-2.5 text-left border rounded-[3px] transition-all flex items-center justify-between text-xs ${
                    selectedListId === l.id
                      ? 'border-[#00e054] bg-[#00e054]/10 text-white font-bold'
                      : 'border-[#2c3440] bg-[#14181c] hover:border-[#445566] text-[#8899aa]'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-white">{l.name}</span>
                    <span className="text-[10px] text-[#667788] uppercase">{l.visibility}</span>
                  </div>
                  {selectedListId === l.id && <Check className="w-4 h-4 text-[#00e054]" />}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Personal Note for this List Item (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Recommended by Nina in conversation"
              className="w-full px-3 py-1.5 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
            />
          </div>
        </div>

        <div className="px-5 py-3 bg-[#14181c] border-t border-[#2c3440] flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-[#8899aa] hover:text-white rounded-[2px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={saving || lists.length === 0}
            className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px] transition-colors shadow-md disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add to List'}
          </button>
        </div>
      </div>
    </div>
  );
};
