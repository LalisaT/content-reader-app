import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Save, Eye, Edit3, Image as ImageIcon,
  Lock, CheckCircle2, AlertCircle, Plus, Trash2,
  Heading1, Heading2, Heading3, Bold, Italic,
  Quote, List, ListOrdered, Lightbulb, AlertTriangle, Link as LinkIcon,
  Wifi, Bell, MousePointerClick, ExternalLink, X
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import RichPreview from './RichPreview';

const PRESET_IMAGES = [
  { label: 'Tech & Code', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Work & Desk', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80' },
  { label: 'Health & Wellness', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Finance & Money', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80' },
  { label: 'Books & Mind', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Coffee & Routine', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80' },
];

const DEFAULT_CATEGORIES = ['Productivity', 'Tech & AI', 'Health', 'Finance', 'Mindset', 'Life Hacks'];

export default function ArticleEditor({ editingArticle, onArticleSaved, onCancelEdit }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [author, setAuthor] = useState('TipPulse Editor');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [summary, setSummary] = useState('');
  const [takeaways, setTakeaways] = useState(['', '']);
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [needsData, setNeedsData] = useState(false);
  const [broadcastNotification, setBroadcastNotification] = useState(true);

  // Interactive Button Creator State
  const [isButtonModalOpen, setIsButtonModalOpen] = useState(false);
  const [btnLabel, setBtnLabel] = useState('Click Here');
  const [btnUrl, setBtnUrl] = useState('https://');

  const [activeView, setActiveView] = useState('split'); // 'editor' | 'preview' | 'split'
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setCategory(editingArticle.category || DEFAULT_CATEGORIES[0]);
      setAuthor(editingArticle.author || 'TipPulse Editor');
      setImage(editingArticle.image || PRESET_IMAGES[0].url);
      setSummary(editingArticle.summary || '');
      setTakeaways(
        Array.isArray(editingArticle.keyTakeaways) && editingArticle.keyTakeaways.length > 0
          ? editingArticle.keyTakeaways
          : ['', '']
      );
      setContent(editingArticle.content || '');
      setIsPremium(Boolean(editingArticle.isPremium));
      setNeedsData(Boolean(editingArticle.needsData || editingArticle.requiresOnline));
    } else {
      resetForm();
    }
  }, [editingArticle]);

  const resetForm = () => {
    setTitle('');
    setCategory(DEFAULT_CATEGORIES[0]);
    setAuthor('TipPulse Editor');
    setImage(PRESET_IMAGES[0].url);
    setSummary('');
    setTakeaways(['', '']);
    setContent('');
    setIsPremium(false);
    setNeedsData(false);
  };

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  const openButtonModal = () => {
    const textarea = textareaRef.current;
    let label = 'Click Here';
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = content.substring(start, end).trim();
      if (selected) {
        label = selected;
      }
    }
    setBtnLabel(label);
    setBtnUrl('https://');
    setIsButtonModalOpen(true);
  };

  const handleInsertButton = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const finalLabel = btnLabel.trim() || 'Click Here';
    let finalUrl = btnUrl.trim() || 'https://';
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://') && !finalUrl.startsWith('mailto:') && !finalUrl.startsWith('tel:')) {
      finalUrl = `https://${finalUrl}`;
    }
    const buttonSnippet = `\n\n[🔘 ${finalLabel}](${finalUrl})\n\n`;

    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}${buttonSnippet}`);
    } else {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + buttonSnippet + content.substring(end);
      setContent(newContent);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + buttonSnippet.length, start + buttonSnippet.length);
      }, 50);
    }
    setIsButtonModalOpen(false);
  };

  const insertText = (beforeText, afterText = '', defaultPlaceholder = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setContent((prev) => `${prev}\n${beforeText}${defaultPlaceholder}${afterText}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultPlaceholder;
    const newText = content.substring(0, start) + beforeText + selected + afterText + content.substring(end);
    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + beforeText.length, start + beforeText.length + selected.length);
    }, 50);
  };

  const handleTakeawayChange = (idx, value) => {
    const copy = [...takeaways];
    copy[idx] = value;
    setTakeaways(copy);
  };

  const handleAddTakeaway = () => {
    setTakeaways([...takeaways, '']);
  };

  const handleRemoveTakeaway = (idx) => {
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  const calculateReadTime = (text) => {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 180));
    return `${mins} min read`;
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showToast('Please provide both Title and Article Content.', true);
      return;
    }

    setIsSaving(true);
    try {
      const articleId = editingArticle?.id || `tip-${Date.now()}`;
      const nowFormatted = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date());

      const articlePayload = {
        id: articleId,
        title: title.trim(),
        category: category.trim(),
        author: author.trim() || 'TipPulse Editor',
        image: image.trim(),
        summary: summary.trim(),
        keyTakeaways: takeaways.filter((t) => t.trim().length > 0),
        content: content,
        isPremium: Boolean(isPremium),
        needsData: Boolean(needsData),
        requiresOnline: Boolean(needsData),
        readTime: calculateReadTime(content),
        date: editingArticle?.date || nowFormatted,
        updatedAt: Date.now(),
        createdAt: editingArticle?.createdAt || Date.now(),
      };

      // 1. Save to Cloud Firestore
      await setDoc(doc(db, 'articles', articleId), articlePayload, { merge: true });

      // 2. Broadcast push notification if selected
      if (broadcastNotification) {
        try {
          const notifId = `notif-${Date.now()}`;
          await setDoc(doc(db, 'notifications', notifId), {
            id: notifId,
            articleId: articleId,
            title: editingArticle ? `📝 Updated: ${title.trim()}` : `🔔 New Tip: ${title.trim()}`,
            body: summary.trim() || content.substring(0, 90) + '...',
            category: category.trim(),
            imageUrl: image.trim() || null,
            createdAt: Date.now(),
            author: author.trim()
          });
        } catch (notifErr) {
          console.warn('Notification broadcast warning:', notifErr);
        }
      }

      showToast(editingArticle ? 'Article updated successfully!' : 'Article published live to mobile app!');
      if (onArticleSaved) onArticleSaved(articlePayload);
      if (!editingArticle) resetForm();
    } catch (err) {
      console.error('Publish error:', err);
      showToast(`Publish failed: ${err.message || err}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const currentPreviewData = {
    title: title || 'Title of the Tip',
    category,
    author: author || 'TipPulse Editor',
    image,
    summary,
    keyTakeaways: takeaways,
    content,
    isPremium,
    needsData,
    requiresOnline: needsData,
    readTime: calculateReadTime(content),
    date: 'Today',
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold border animate-in slide-in-from-bottom ${
          toast.isError
            ? 'bg-rose-950/90 text-rose-200 border-rose-800'
            : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          {toast.isError ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>{editingArticle ? `Editing: "${editingArticle.title}"` : 'Create New Tip / Article'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Articles publish directly to Google Cloud Firestore and sync live to all user devices.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {editingArticle && (
            <button
              onClick={onCancelEdit}
              type="button"
              className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-semibold"
            >
              Cancel Edit
            </button>
          )}

          {/* View toggles (Split vs Edit vs Preview) */}
          <div className="hidden md:flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveView('editor')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${activeView === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Editor Only
            </button>
            <button
              onClick={() => setActiveView('split')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${activeView === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${activeView === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Phone Preview
            </button>
          </div>

          <button
            onClick={handlePublish}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing...' : editingArticle ? 'Update Article' : 'Publish to App'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Preview */}
      <div className={`grid gap-6 ${activeView === 'split' ? 'md:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Editor Form Column */}
        <div className={activeView === 'split' ? 'md:col-span-7' : activeView === 'editor' ? 'col-span-1' : 'hidden'}>
          <form onSubmit={handlePublish} className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Article Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5 Rules for Deep Work and Flow State"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Category + Author */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. TipPulse Editor"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Featured Image Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Featured Banner Image</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                {PRESET_IMAGES.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setImage(p.url)}
                    className={`relative rounded-lg overflow-hidden h-14 border transition-all ${
                      image === p.url ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {p.label}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="Or paste any custom image URL (https://...)"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Summary / Catchphrase (Shows on mobile feed card)
              </label>
              <textarea
                rows={2}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="A 1-2 sentence compelling summary of the guide..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Key Takeaways */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">Key Takeaways (Bullet highlights)</label>
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Point</span>
                </button>
              </div>
              <div className="space-y-2">
                {takeaways.map((t, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={t}
                      onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                      placeholder={`Takeaway #${idx + 1}`}
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                    {takeaways.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTakeaway(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Markdown Content & Toolbar */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Article Body Content <span className="text-rose-400">*</span>
              </label>

              {/* Formatting Toolbar */}
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-900 border border-slate-700 rounded-t-xl text-xs">
                <button
                  type="button"
                  onClick={() => insertText('### ')}
                  title="Heading 3"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Heading3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('## ')}
                  title="Heading 2"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('**', '**', 'bold text')}
                  title="Bold"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('*', '*', 'italic text')}
                  title="Italic"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button
                  type="button"
                  onClick={() => insertText('- ')}
                  title="Bullet List"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('> ')}
                  title="Quote"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText('> [!TIP]\n> ', '', 'Write your pro tip here')}
                  title="Tip Callout Box"
                  className="p-1.5 rounded hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Tip</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertText('> [!WARNING]\n> ', '', 'Important note or caution')}
                  title="Warning Callout Box"
                  className="p-1.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Alert</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertText('[Link Title](', ')', 'https://example.com')}
                  title="Insert Link"
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button
                  type="button"
                  onClick={openButtonModal}
                  title="Insert Interactive Call-to-Action Button"
                  className="px-2 py-1 rounded-lg hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 flex items-center space-x-1.5 font-bold transition-colors bg-indigo-500/15 border border-indigo-500/30"
                >
                  <MousePointerClick className="w-3.5 h-3.5" />
                  <span className="text-[10px]">🔘 Button</span>
                </button>
              </div>

              <textarea
                ref={textareaRef}
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article in markdown format..."
                className="w-full p-3 bg-slate-950 border border-t-0 border-slate-700 rounded-b-xl text-xs text-white placeholder-slate-600 font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Options: Premium PRO, Online Data Required, and Push Notification */}
            <div className="pt-3 border-t border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                  <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Lock as PRO Article (Video Ad)</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={needsData}
                  onChange={(e) => setNeedsData(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0"
                />
                <span className="text-slate-300 flex items-center space-x-1.5 font-medium">
                  <Wifi className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Require Internet Data</span>
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none p-2 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={broadcastNotification}
                  onChange={(e) => setBroadcastNotification(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-0"
                />
                <span className="text-indigo-300 font-semibold flex items-center space-x-1.5">
                  <Bell className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Send Notification Alert</span>
                </span>
              </label>
            </div>
          </form>
        </div>

        {/* Live Phone Preview Column */}
        <div className={activeView === 'split' ? 'md:col-span-5' : activeView === 'preview' ? 'col-span-1' : 'hidden'}>
          <div className="sticky top-4">
            <RichPreview article={currentPreviewData} />
          </div>
        </div>
      </div>

      {/* Interactive Button Creator Modal */}
      {isButtonModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                  <MousePointerClick className="w-4 h-4" />
                </div>
                <span>Create Interactive Action Button</span>
              </div>
              <button
                type="button"
                onClick={() => setIsButtonModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInsertButton} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Button Label (Text on Button)</label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={btnLabel}
                  onChange={(e) => setBtnLabel(e.target.value)}
                  placeholder="e.g. Visit Website, Download App, Get Tips"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Target Link URL</label>
                <input
                  type="text"
                  required
                  value={btnUrl}
                  onChange={(e) => setBtnUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
                <span className="block font-medium mb-1.5 text-slate-400">Preview Button:</span>
                <div className="text-center py-1">
                  <span className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer hover:bg-indigo-500 transition-colors">
                    <span>{btnLabel || 'Button Text'}</span>
                    <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsButtonModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Insert Button into Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
