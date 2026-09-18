import React, { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import { Bell, Send, CheckCircle2 } from 'lucide-react';

export default function NotificationSender() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('Announcement');
  const [articleId, setArticleId] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSending(true);
    try {
      const notifId = `notif-${Date.now()}`;
      await setDoc(doc(db, 'notifications', notifId), {
        id: notifId,
        articleId: articleId.trim() || null,
        title: title.trim(),
        body: body.trim() || 'Tap to open TipPulse and see what is new!',
        category: category.trim(),
        imageUrl: '/app-icon.png',
        createdAt: Date.now(),
        author: 'Admin'
      });
      setSentSuccess(true);
      setTitle('');
      setBody('');
      setArticleId('');
      setTimeout(() => setSentSuccess(false), 3500);
    } catch (err) {
      alert(`Broadcast failed: ${err.message}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
      <div>
        <h2 className="text-base font-bold text-white flex items-center space-x-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span>Broadcast Instant Notification to All Devices</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Sends an alert to all mobile app users that appears in their notification center.
        </p>
      </div>

      {sentSuccess && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Notification broadcasted to all users successfully!</span>
        </div>
      )}

      <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Notification Title <span className="text-rose-400">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 📢 Weekend Special: 3 New Productive Morning Habits"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-300 mb-1">
            Notification Message
          </label>
          <textarea
            rows={2}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Short preview text displayed in the user notification bell..."
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Category Tag</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Announcement, Weekend Tip"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Target Article ID (Optional)</label>
            <input
              type="text"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              placeholder="e.g. prod-1 (Tapping opens article)"
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSending || !title.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-1.5 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isSending ? 'Broadcasting...' : 'Send to All Users'}</span>
        </button>
      </form>
    </div>
  );
}
