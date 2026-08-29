import React from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  X,
  Sparkles,
  ExternalLink,
  Volume2,
  Clock,
  ChevronRight,
  ShieldCheck,
  User
} from 'lucide-react';
import { notificationService, playNotificationChime } from '../services/notificationService';

export default function NotificationModal({
  isOpen,
  onClose,
  notifications = [],
  onSelectArticle,
  onMarkAllRead,
  onClearAll,
  currentUser,
  onOpenAuth,
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (isoString) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Recently';
    }
  };

  const handleItemClick = (item) => {
    notificationService.markAsRead(item.id);
    onClose();
    if (item.articleId && typeof onSelectArticle === 'function') {
      onSelectArticle(item.articleId);
    }
  };

  const handleTestChime = () => {
    playNotificationChime();
    notificationService.notifyNewArticle({
      id: `test_${Date.now()}`,
      title: 'Welcome to TipPulse Notifications!',
      summary: 'You will receive instant alerts with sound whenever a new tip or article is published.',
      category: 'Pulse Update'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[85vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Bell className="w-5 h-5 fill-sky-500/20 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Notifications
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-black rounded-full bg-sky-500 text-white shadow-xs">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live alerts for newly published tips & guides
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={handleTestChime}
              title="Test Notification Sound"
              className="p-2 rounded-xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Bar (Mark all read / Clear) */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
            <button
              onClick={onMarkAllRead}
              className="flex items-center space-x-1 text-sky-600 dark:text-sky-400 hover:underline font-medium"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center space-x-1 text-rose-500 hover:text-rose-600 dark:text-rose-400 font-medium hover:underline"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2 sm:p-3">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center mx-auto mb-3.5 text-slate-400 dark:text-slate-500">
                <Bell className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                You're all caught up!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                When new smart tips or insights are posted, they will pop up here with instant phone alerts and sound.
              </p>
              <button
                onClick={handleTestChime}
                className="mt-5 inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Send a Test Notification</span>
              </button>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-2xl flex items-start space-x-3 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60 group ${
                  !item.read ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                }`}
              >
                {/* Unread indicator */}
                <div className="pt-1.5 shrink-0">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      !item.read ? 'bg-sky-500 shadow-xs shadow-sky-500/50' : 'bg-transparent'
                    }`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.category || 'Tip'}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(item.timestamp)}</span>
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.body}
                  </p>
                </div>

                {/* Arrow */}
                <div className="pt-2 shrink-0 text-slate-300 group-hover:text-sky-500 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Centered Footer Branding */}
        <div className="py-2.5 px-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
            TipPulse Alert Center
          </span>
        </div>
      </div>
    </div>
  );
}
