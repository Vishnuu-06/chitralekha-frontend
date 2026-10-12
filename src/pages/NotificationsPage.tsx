import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [markingAll, setMarkingAll] = useState<boolean>(false);

  const loadNotifications = () => {
    if (!user) return;
    setLoading(true);
    notificationService
      .getNotifications()
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    loadNotifications();
  }, [user]);

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      await notificationService.markAllAsRead();
      loadNotifications();
    } catch {
      // ignore
    } finally {
      setMarkingAll(false);
    }
  };

  const handleClickNotification = async (item: NotificationItem) => {
    if (!item.readFlag) {
      try {
        await notificationService.markAsRead(item.id);
      } catch {
        // ignore
      }
    }
    if (item.targetUrl) {
      navigate(item.targetUrl);
    }
  };

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4 text-[#99aabb]">
        <Bell className="w-10 h-10 mx-auto text-[#8899aa]" />
        <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Notifications</h1>
        <p className="text-sm text-[#8899aa]">
          Sign in to view interactions, review appreciations, and correspondence updates.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal()}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#00e054] text-[#14181c] rounded-[3px] hover:bg-[#00c84b] transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#99aabb]">
      <div className="border-b border-[#2c3440] pb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1 text-[#8899aa]">
            <Bell className="w-4 h-4 text-[#00e054]" />
            <span className="text-xs uppercase tracking-widest font-bold">Activity</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase">NOTIFICATIONS</h1>
        </div>

        {notifications.some((n) => !n.readFlag) && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-[#2c3440] bg-[#1b2228] hover:border-[#00e054] text-white rounded-[3px] flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5 text-[#00e054]" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-14 bg-[#1b2228] border border-[#2c3440] rounded-[3px] animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-[#1b2228] border border-[#2c3440] rounded-[3px]">
          <p className="text-sm text-[#8899aa]">
            No notifications logged. Your ledger is completely clear.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => handleClickNotification(item)}
              className={`w-full text-left p-4 rounded-[3px] border transition-all flex items-center justify-between group ${
                !item.readFlag
                  ? 'bg-[#1b2228] border-[#00e054]/50 shadow-md'
                  : 'bg-[#14181c] border-[#2c3440] hover:border-[#445566]'
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    !item.readFlag ? 'bg-[#00e054]' : 'bg-transparent'
                  }`}
                />
                <div>
                  <p className="text-xs sm:text-sm font-sans text-white leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8899aa]">
                    <Clock className="w-3 h-3 text-[#667788]" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-[#667788] group-hover:text-[#00e054] group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-4" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
