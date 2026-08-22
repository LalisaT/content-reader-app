import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Image as ImageIcon,
  Lock,
  CheckCircle2,
  FileText,
  Eye,
  Edit3,
  Upload,
  Camera
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Work & Desk', url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tech & Code', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Health & Nature', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Finance & Growth', url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80' },
  { label: 'Books & Mind', url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80' },
];

export default function AdminPostModal({
  isOpen,
  onClose,
  onSaveArticle,
  editingArticle = null,
  categories = [],
}) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.label || 'Productivity');
  const [author, setAuthor] = useState('Editor');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [summary, setSummary] = useState('');
  const [takeaways, setTakeaways] = useState(['', '']);
  const [content, setContent] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview'
  const fileInputRef = useRef(null);

  // Pre-populate if editing an existing article
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || '');
      setCategory(editingArticle.category || (categories[0]?.label || 'Productivity'));
      setAuthor(editingArticle.author || 'Editor');
      setImage(editingArticle.image || PRESET_IMAGES[0].url);
      setSummary(editingArticle.summary || '');
      setTakeaways(editingArticle.keyTakeaways && editingArticle.keyTakeaways.length > 0 ? editingArticle.keyTakeaways : ['', '']);
      setContent(editingArticle.content || '');
      setIsPremium(!!editingArticle.isPremium);
    } else {
      setTitle('');
      setCategory(categories[0]?.label || 'Productivity');
      setAuthor('Editor');
      setImage(PRESET_IMAGES[0].url);
      setSummary('');
      setTakeaways(['', '']);
      setContent('');
      setIsPremium(false);
    }
  }, [editingArticle, isOpen, categories]);

  if (!isOpen) return null;

  // Handle local image file upload from Gallery / Device
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Read and compress file to base64 DataURL
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddTakeaway = () => {
    setTakeaways([...takeaways, '']);
  };

  const handleTakeawayChange = (index, val) => {
    const updated = [...takeaways];
    updated[index] = val;
    setTakeaways(updated);
  };

  const handleRemoveTakeaway = (index) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  const calculateReadTime = (text) => {
    const words = (text || '').trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 180));
    return `${minutes} min read`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please enter both a title and article body content.');
      return;
    }

    const matchedCat = categories.find((c) => c.label === category);
    const categoryIcon = matchedCat ? matchedCat.icon : 'Sparkles';

    const savedData = {
      id: editingArticle ? editingArticle.id : `custom-${Date.now()}`,
      title: title.trim(),
      category,
      categoryIcon,
      readTime: calculateReadTime(content),
      date: editingArticle ? editingArticle.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      author: author.trim() || 'Editor',
      isPremium,
      image: image || PRESET_IMAGES[0].url,
      summary: summary.trim() || title.trim(),
      keyTakeaways: takeaways.map((t) => t.trim()).filter(Boolean),
      content: content.trim(),
    };

    onSaveArticle(savedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              {editingArticle ? <Edit3 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight">
                {editingArticle ? 'Edit Article / Tip' : 'Admin & Creator Studio'}
              </h2>
              <p className="text-[11px] text-slate-400">
                Upload images from gallery, pick custom category & publish
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle: Editor vs Preview */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 py-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-2 transition-all ${
              activeTab === 'preview'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Reader Preview</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-5 overflow-y-auto flex-1 text-slate-900 dark:text-slate-100 text-xs">
          {activeTab === 'editor' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 5 Micro-Habits for 2x Daily Focus"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>

              {/* Category & Author Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category Pillar
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.label}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Author Display Name
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image: Gallery Upload or URL / Presets */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Cover Photo (Gallery Upload or Presets)
                </label>

                {image && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3 border border-slate-300 dark:border-slate-600 bg-slate-100">
                    <img src={image} alt="Selected cover" className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md font-semibold">
                      Cover Preview
                    </span>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-wrap gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Phone / Gallery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImage(PRESET_IMAGES[0].url)}
                    className="px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-xs hover:bg-slate-100 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <input
                  type="text"
                  value={image.startsWith('data:') ? 'Image uploaded from device (Base64)' : image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste an image URL..."
                  disabled={image.startsWith('data:')}
                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-[10px] focus:outline-none mb-2 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-500"
                />

                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setImage(preset.url)}
                      className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-colors ${
                        image === preset.url
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Summary / Excerpt */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Excerpt (shows in feed cards)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A quick 1-2 sentence preview of the main tip or insight..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                />
              </div>

              {/* Key Takeaways */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Key Actionable Takeaways (Bullet Box)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddTakeaway}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold flex items-center space-x-0.5 hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Point</span>
                  </button>
                </div>
                <div className="space-y-1.5">
                  {takeaways.map((t, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <input
                        type="text"
                        value={t}
                        onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                        placeholder={`Takeaway #${idx + 1}`}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                      {takeaways.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTakeaway(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Article Body Content (Markdown) */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Full Article Body (Markdown supported with `###` headings and `&gt;` quotes) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="### Why this method works&#10;Explain the core technique here in detail...&#10;&#10;### Step-by-step action plan&#10;1. Do this first&#10;2. Follow with this"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/40 focus:outline-none"
                />
              </div>

              {/* Premium Rewarded Ad Lock Toggle */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      Sponsored Video Reward Lock
                    </div>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      Requires readers to watch a 5s sponsor video to unlock this masterclass
                    </p>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 text-xs font-black rounded-xl shadow-md shadow-amber-500/30 flex items-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{editingArticle ? 'Save Changes' : 'Publish Article'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Live Preview Mode */
            <div className="space-y-4 animate-in fade-in">
              <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                  {category}
                </span>
                <h2 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                  {title || 'Untitled Article'}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  By {author} • {calculateReadTime(content)}
                </p>
              </div>

              {takeaways.filter(Boolean).length > 0 && (
                <div className="p-3 bg-indigo-50/70 dark:bg-slate-800 rounded-xl border border-indigo-200 dark:border-indigo-900">
                  <h4 className="font-bold text-[11px] text-indigo-700 dark:text-indigo-400 mb-1.5">
                    Key Actionable Takeaways
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {takeaways.filter(Boolean).map((t, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="prose dark:prose-invert text-xs space-y-2 text-slate-700 dark:text-slate-300 font-serif leading-relaxed">
                {(content || 'Write your article body in the editor tab...').split('\n\n').map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
