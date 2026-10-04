import React, { useState, useEffect } from 'react';
import {
  FolderPlus, Plus, Trash2, CheckCircle2, AlertCircle, Sparkles,
  Zap, Cpu, Music, Headphones, Heart, DollarSign, Brain, Flame,
  Rocket, Compass, Globe, BookOpen, Award, Smile, Sun, Target,
  Coffee, Radio, Disc, Video, Shield, Trophy, Star, RefreshCw, Loader2, Tag
} from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { db } from '../firebaseAdmin';

const ICON_MAP = {
  Zap, Cpu, Music, Headphones, Heart, DollarSign, Brain, Flame, Sparkles, Rocket,
  Compass, Globe, BookOpen, Award, Smile, Sun, Target, Coffee, Radio, Disc,
  Video, Shield, Trophy, Star
};

const DEFAULT_CATEGORIES = [
  { id: 'Productivity', label: 'Productivity', icon: 'Zap', gradient: 'from-amber-500 to-orange-600' },
  { id: 'Tech & AI', label: 'Tech & AI', icon: 'Cpu', gradient: 'from-blue-600 to-cyan-600' },
  { id: 'Music', label: 'Music', icon: 'Music', gradient: 'from-fuchsia-600 to-pink-600', isMusicCategory: true },
  { id: 'Health', label: 'Health', icon: 'Heart', gradient: 'from-rose-500 to-pink-600' },
  { id: 'Finance', label: 'Finance', icon: 'DollarSign', gradient: 'from-emerald-600 to-teal-600' },
  { id: 'Mindset', label: 'Mindset', icon: 'Brain', gradient: 'from-purple-600 to-indigo-600' },
];

const GRADIENT_PRESETS = [
  { label: 'Amber Flame', val: 'from-amber-500 to-orange-600' },
  { label: 'Tech Cyan', val: 'from-blue-600 to-cyan-600' },
  { label: 'Music Pink', val: 'from-fuchsia-600 to-pink-600' },
  { label: 'Health Rose', val: 'from-rose-500 to-pink-600' },
  { label: 'Finance Emerald', val: 'from-emerald-600 to-teal-600' },
  { label: 'Mindset Violet', val: 'from-purple-600 to-indigo-600' },
  { label: 'Sky Blue', val: 'from-sky-500 to-blue-600' },
  { label: 'Crimson Red', val: 'from-red-600 to-rose-700' },
];

export default function CategoriesManager() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [articleCounts, setArticleCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // New Category Form State
  const [newLabel, setNewLabel] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Sparkles');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].val);
  const [isMusicCat, setIsMusicCat] = useState(false);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Subscribe to Cloud Categories in Firestore
  useEffect(() => {
    const catRef = doc(db, 'settings', 'categories');
    const unsub = onSnapshot(
      catRef,
      (docSnap) => {
        if (docSnap.exists() && Array.isArray(docSnap.data().list) && docSnap.data().list.length > 0) {
          setCategories(docSnap.data().list);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
        setIsLoading(false);
      },
      (err) => {
        console.warn('Categories listener error:', err);
        setIsLoading(false);
      }
    );

    // 2. Count articles per category from Firestore
    const articlesRef = collection(db, 'articles');
    const unsubArticles = onSnapshot(articlesRef, (snapshot) => {
      const counts = {};
      snapshot.docs.forEach((d) => {
        const cat = d.data()?.category;
        if (cat) {
          counts[cat.toLowerCase().trim()] = (counts[cat.toLowerCase().trim()] || 0) + 1;
        }
      });
      setArticleCounts(counts);
    }, () => {});

    return () => {
      unsub();
      unsubArticles();
    };
  }, []);

  const handleSaveToCloud = async (newList) => {
    setIsSaving(true);
    try {
      const catRef = doc(db, 'settings', 'categories');
      await setDoc(catRef, { list: newList, updatedAt: Date.now() }, { merge: true });
      showToast('Categories updated successfully and synced to all user apps!');
    } catch (err) {
      console.error('Save categories error:', err);
      showToast(`Failed to update categories: ${err.message || err}`, true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const cleanLabel = newLabel.trim();
    if (!cleanLabel) {
      showToast('Please enter a valid Category Name.', true);
      return;
    }

    if (categories.some((c) => c.label.toLowerCase() === cleanLabel.toLowerCase())) {
      showToast('A category with this name already exists.', true);
      return;
    }

    const newCategory = {
      id: cleanLabel,
      label: cleanLabel,
      icon: selectedIcon,
      gradient: selectedGradient,
      isMusicCategory: Boolean(isMusicCat)
    };

    const updated = [...categories, newCategory];
    setCategories(updated);
    setNewLabel('');
    setSelectedIcon('Sparkles');
    setIsMusicCat(false);

    await handleSaveToCloud(updated);
  };

  const handleDeleteCategory = async (catId) => {
    const target = categories.find((c) => c.id === catId);
    if (!target) return;

    if (categories.length <= 1) {
      showToast('You must maintain at least 1 category.', true);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the "${target.label}" category?`)) {
      return;
    }

    const updated = categories.filter((c) => c.id !== catId);
    setCategories(updated);
    await handleSaveToCloud(updated);
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all categories back to default system set?')) return;
    setCategories(DEFAULT_CATEGORIES);
    await handleSaveToCloud(DEFAULT_CATEGORIES);
  };

  const renderIcon = (iconName, className = 'w-4 h-4') => {
    const IconComponent = ICON_MAP[iconName] || Sparkles;
    return <IconComponent className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center space-x-2.5 text-xs font-bold border animate-in slide-in-from-bottom ${
          toast.isError ? 'bg-rose-950/90 text-rose-200 border-rose-800' : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
        }`}>
          {toast.isError ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <span>Category Manager</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                Cloud Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Create, customize, and manage topic categories visible on the app home screen.
            </p>
          </div>
        </div>

        <button
          onClick={handleResetDefaults}
          disabled={isSaving}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Create Category Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>Add New Category</span>
            </h3>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              {/* Category Name */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Science & Space, Life Hacks, Meditation"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Icon Picker */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Select Category Icon ({selectedIcon})
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 bg-slate-950 border border-slate-800 rounded-xl max-h-36 overflow-y-auto">
                  {Object.keys(ICON_MAP).map((iconKey) => {
                    const isSelected = selectedIcon === iconKey;
                    return (
                      <button
                        key={iconKey}
                        type="button"
                        onClick={() => setSelectedIcon(iconKey)}
                        title={iconKey}
                        className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        {renderIcon(iconKey, 'w-4 h-4')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Gradient Presets */}
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Badge Gradient Color
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GRADIENT_PRESETS.map((grad) => (
                    <button
                      key={grad.label}
                      type="button"
                      onClick={() => setSelectedGradient(grad.val)}
                      className={`p-2 rounded-xl border flex items-center space-x-2 text-left transition-all ${
                        selectedGradient === grad.val
                          ? 'border-indigo-500 bg-slate-800 ring-1 ring-indigo-500'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${grad.val} shrink-0`}></div>
                      <span className="text-[11px] font-semibold text-slate-300 truncate">{grad.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Music Hub Toggle */}
              <div className="p-3 rounded-xl bg-pink-950/30 border border-pink-800/40">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMusicCat}
                    onChange={(e) => setIsMusicCat(e.target.checked)}
                    className="w-4 h-4 rounded text-pink-600 focus:ring-0"
                  />
                  <div>
                    <span className="text-pink-300 font-bold block text-xs">Audio / Music Hub Category</span>
                    <span className="text-slate-400 text-[10px]">Enables legal YouTube Music player features</span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>{isSaving ? 'Saving to Cloud...' : 'Create & Publish Category'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Active Categories List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <span>Active Categories</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-bold">
                  {categories.length}
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">Live in Mobile App</span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2 text-indigo-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">Loading categories...</span>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No categories found. Click "Reset Defaults" to restore.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const articleCount = articleCounts[cat.label.toLowerCase().trim()] || 0;
                  return (
                    <div
                      key={cat.id || cat.label}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${cat.gradient || 'from-indigo-600 to-violet-600'} flex items-center justify-center text-white shadow-sm shrink-0`}>
                          {renderIcon(cat.icon, 'w-4 h-4')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-extrabold text-white truncate flex items-center space-x-1.5">
                            <span>{cat.label}</span>
                            {cat.isMusicCategory && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                                Music
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {articleCount} {articleCount === 1 ? 'article' : 'articles'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id || cat.label)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
