import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Plus,
  User,
  ShieldAlert,
  Clock,
  Film,
  Tv,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { messagingService } from '../services/messagingService';
import { safetyService } from '../services/safetyService';
import { useAuth } from '../context/AuthContext';
import { ConversationSummary, MessageItem } from '../types';

export const MessagesPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [newMessageBody, setNewMessageBody] = useState<string>('');
  const [loadingConvs, setLoadingConvs] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  // New conversation modal
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [targetUsername, setTargetUsername] = useState<string>('');
  const [startingConv, setStartingConv] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = () => {
    if (!user) return;
    messagingService
      .getConversations()
      .then((data) => {
        setConversations(data);
        if (data.length > 0 && activeConvId === null) {
          setActiveConvId(data[0].id);
        }
        setLoadingConvs(false);
      })
      .catch(() => setLoadingConvs(false));
  };

  const loadMessages = (convId: number) => {
    setLoadingMessages(true);
    messagingService
      .getMessages(convId)
      .then((data) => {
        setMessages(data);
        setLoadingMessages(false);
        setTimeout(scrollToBottom, 50);
      })
      .catch(() => setLoadingMessages(false));
  };

  useEffect(() => {
    if (!user) {
      setLoadingConvs(false);
      return;
    }
    loadConversations();
  }, [user]);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      const interval = setInterval(() => {
        messagingService
          .getMessages(activeConvId)
          .then((data) => {
            setMessages(data);
          })
          .catch(() => {});
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeConvId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId || !newMessageBody.trim() || sending) return;

    setSending(true);
    try {
      await messagingService.sendMessage(activeConvId, newMessageBody.trim());
      setNewMessageBody('');
      loadMessages(activeConvId);
      loadConversations();
    } catch {
      alert('Unable to deliver message. The member may have blocked you or privacy settings restrict direct messages.');
    } finally {
      setSending(false);
    }
  };

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUsername.trim()) return;

    setStartingConv(true);
    try {
      const res = await messagingService.getOrCreateConversation(targetUsername.trim());
      setShowNewModal(false);
      setTargetUsername('');
      setActiveConvId(res.id);
      loadConversations();
    } catch (err: any) {
      alert(err.message || 'Could not start conversation with user.');
    } finally {
      setStartingConv(false);
    }
  };

  const handleBlockUser = async (_otherUserId: number, otherUsername: string) => {
    if (!confirm(`Are you sure you want to block @${otherUsername}? You will no longer receive messages or notifications from them.`)) return;
    try {
      await safetyService.toggleBlockUser(otherUsername);
      alert(`User @${otherUsername} has been blocked.`);
      setActiveConvId(null);
      loadConversations();
    } catch {
      alert('Failed to block user.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4 text-[#99aabb]">
        <MessageSquare className="w-10 h-10 mx-auto text-[#8899aa]" />
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Direct Messages</h1>
        <p className="text-sm text-[#8899aa]">
          Sign in to converse privately with fellow readers, filmgoers, and curators.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal()}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] transition-colors"
        >
          Sign In to Access Messages
        </button>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[#99aabb]">
      {/* Page Title */}
      <div className="border-b border-[#2c3440] pb-4 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">MESSAGES</h1>
          <p className="text-xs text-[#8899aa]">Direct dialogues between community members.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] hover:bg-[#00c84b] rounded-[3px] flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Dialogue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 border border-[#2c3440] rounded-[3px] bg-[#14181c] min-h-[550px] shadow-xl overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="md:col-span-4 border-r border-[#2c3440] bg-[#1b2228] flex flex-col">
          <div className="p-3 border-b border-[#2c3440] text-xs font-bold uppercase tracking-wider text-[#8899aa]">
            Conversations ({conversations.length})
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#2c3440]">
            {loadingConvs ? (
              <div className="p-4 space-y-3">
                <div className="h-10 bg-[#202830] rounded-[3px] animate-pulse" />
                <div className="h-10 bg-[#202830] rounded-[3px] animate-pulse" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#8899aa]">
                No active correspondences. Start a dialogue with a reader or curator.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                    activeConvId === c.id ? 'bg-[#202830] border-l-2 border-l-[#00e054]' : 'hover:bg-[#202830]/50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-[3px] bg-[#14181c] text-[#00e054] border border-[#2c3440] flex items-center justify-center text-xs uppercase font-bold flex-shrink-0">
                    {c.otherUser?.username?.substring(0, 2) || 'U'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white truncate">
                        @{c.otherUser?.username}
                      </span>
                      {c.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-[#00e054]" title="Unread message" />
                      )}
                    </div>
                    <p className="text-xs text-[#8899aa] truncate">
                      {c.latestMessage || 'No messages yet'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Thread Pane */}
        <div className="md:col-span-8 flex flex-col bg-[#14181c]">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-[#2c3440] flex items-center justify-between bg-[#1b2228]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[3px] bg-[#202830] border border-[#2c3440] text-white flex items-center justify-center text-xs uppercase font-bold">
                    {activeConv.otherUser?.username?.substring(0, 2)}
                  </div>
                  <div>
                    <Link
                      to={`/profile/${activeConv.otherUser?.username}`}
                      className="text-xs font-bold text-white hover:text-[#40bcf4] transition-colors"
                    >
                      @{activeConv.otherUser?.username}
                    </Link>
                    <p className="text-[11px] text-[#8899aa]">
                      {activeConv.otherUser?.displayName}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBlockUser(activeConv.otherUser.id, activeConv.otherUser.username)}
                  className="text-[#667788] hover:text-[#ff8000] text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                  title="Block this user"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Block</span>
                </button>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[460px]">
                {loadingMessages ? (
                  <div className="text-center py-10 text-xs text-[#8899aa]">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-16 text-xs text-[#8899aa]">
                    No messages in this dialogue yet. Say hello to @{activeConv.otherUser?.username}.
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-[#667788]">
                        <span>{m.isMine ? 'You' : `@${m.senderUsername}`}</span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>

                      <div
                        className={`max-w-[80%] p-3 rounded-[3px] text-xs font-sans leading-relaxed border ${
                          m.isMine
                            ? 'bg-[#202830] border-[#2c3440] text-white'
                            : 'bg-[#1b2228] border-[#2c3440] text-[#ccddee]'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{m.body}</p>

                        {/* Shared Content preview if attached */}
                        {m.sharedContent && (
                          <Link
                            to={`/content/${m.sharedContent.id}`}
                            className="mt-2.5 p-2 bg-[#14181c] border border-[#2c3440] rounded-[2px] flex items-center gap-2.5 hover:border-[#00e054] transition-colors block"
                          >
                            {m.sharedContent.posterUrl && (
                              <img
                                src={m.sharedContent.posterUrl}
                                alt={m.sharedContent.title}
                                className="w-8 aspect-[2/3] object-cover rounded-[2px] border border-[#2c3440]"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] uppercase font-bold text-[#8899aa] block">
                                {m.sharedContent.contentType}
                              </span>
                              <span className="text-xs font-bold text-white truncate block">
                                {m.sharedContent.title}
                              </span>
                            </div>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-[#2c3440] bg-[#1b2228] flex gap-2">
                <input
                  type="text"
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                  placeholder={`Write to @${activeConv.otherUser?.username}...`}
                  className="flex-1 px-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessageBody.trim()}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#8899aa]">
              <MessageSquare className="w-10 h-10 mb-3 opacity-40" />
              <p className="text-sm">Select an existing dialogue or start a new conversation.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Conversation Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#1b2228] border border-[#2c3440] rounded-[3px] p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Start New Dialogue</h2>
            <form onSubmit={handleStartConversation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                  Recipient Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#8899aa]">@</span>
                  <input
                    type="text"
                    required
                    value={targetUsername}
                    onChange={(e) => setTargetUsername(e.target.value)}
                    placeholder="username"
                    className="w-full pl-7 pr-3 py-2 text-xs bg-[#14181c] border border-[#2c3440] rounded-[3px] focus:outline-none focus:border-[#00e054] text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-3 py-1.5 text-xs font-bold text-[#8899aa] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={startingConv}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] disabled:opacity-50"
                >
                  {startingConv ? 'Opening...' : 'Start Dialogue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
