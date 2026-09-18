import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseAdmin';
import { Search, Edit3, Trash2, Lock, Eye, Sparkles, AlertCircle } from 'lucide-react';

export default function ArticlesTable({ onEditArticle }) {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'articles'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setArticles(list);
        setLoading(false);
      },
      (err) => {
        console.error('Articles fetch error:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?\n\nThis will remove it immediately from all mobile app users.`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'articles', String(id)));
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  const filteredArticles = articles.filter((a) => {
    const matchCat = selectedCategory === 'All' || a.category === selectedCategory;
    const matchSearch =
      (a.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.summary || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.author || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700 space-y-4">
      {/* Header with Search and Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <span>All Published Articles</span>
            <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {articles.length} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time synchronization with TipPulse mobile app
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Table / List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading articles from Firestore...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
          No articles match your search or filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="p-3 bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 transition-colors"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                {art.image ? (
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-800"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-slate-800 shrink-0 flex items-center justify-center text-slate-500">
                    <Eye className="w-5 h-5" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white truncate block">
                      {art.title}
                    </span>
                    {art.isPremium && (
                      <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                        PRO
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {art.summary || art.content?.substring(0, 80) || 'No summary'}
                  </p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-1">
                    <span className="text-indigo-400 font-semibold">{art.category || 'General'}</span>
                    <span>•</span>
                    <span>{art.author || 'TipPulse'}</span>
                    <span>•</span>
                    <span>{art.date || 'Recently'}</span>
                    <span>•</span>
                    <span>{art.readTime || '3 min'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={() => onEditArticle(art)}
                  title="Edit article"
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold transition-colors flex items-center space-x-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(art.id, art.title)}
                  title="Delete article"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
