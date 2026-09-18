import React from 'react';
import { Sparkles, Clock, Calendar, User, Tag, Lock, Lightbulb, AlertTriangle, ExternalLink } from 'lucide-react';

export default function RichPreview({ article }) {
  if (!article) return null;

  const renderContent = (raw) => {
    if (!raw) return <p className="text-slate-400 italic">No content written yet...</p>;
    const lines = raw.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={i} className="text-base font-bold text-white mt-4 mb-1.5 flex items-center space-x-1.5">
            <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block mr-1"></span>
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={i} className="text-lg font-bold text-white mt-5 mb-2 border-b border-slate-800 pb-1">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h1 key={i} className="text-xl font-black text-white mt-6 mb-2.5">
            {trimmed.replace('# ', '')}
          </h1>
        );
      }
      if (trimmed.startsWith('> [!TIP]') || trimmed.startsWith('> [!NOTE]')) {
        return (
          <div key={i} className="my-2.5 p-3 rounded-xl bg-indigo-950/60 border border-indigo-700/60 text-indigo-200 text-xs flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-indigo-300">Pro Tip</span>
              <span>{trimmed.replace(/> \[!(TIP|NOTE)\]\s*/, '')}</span>
            </div>
          </div>
        );
      }
      if (trimmed.startsWith('> [!WARNING]') || trimmed.startsWith('> [!ALERT]')) {
        return (
          <div key={i} className="my-2.5 p-3 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-200 text-xs flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-300">Important Warning</span>
              <span>{trimmed.replace(/> \[!(WARNING|ALERT)\]\s*/, '')}</span>
            </div>
          </div>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={i} className="my-2 pl-3 border-l-2 border-indigo-500 italic text-slate-300 text-xs">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 list-disc text-slate-300 text-xs my-0.5">
            {trimmed.replace(/^[-*]\s+/, '')}
          </li>
        );
      }
      if (!trimmed) {
        return <div key={i} className="h-2"></div>;
      }
      return (
        <p key={i} className="text-slate-300 text-xs leading-relaxed my-1">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden max-w-sm mx-auto shadow-2xl">
      {/* Mobile Header Bar Mockup */}
      <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-bold text-slate-300">TipPulse Mobile Preview</span>
        <span>{article.category || 'Category'}</span>
      </div>

      {/* Featured Banner Image */}
      {article.image && (
        <div className="relative h-44 w-full bg-slate-900">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
              {article.category || 'Guide'}
            </span>
            {article.isPremium && (
              <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-500 text-slate-950 flex items-center space-x-1 shadow-xs">
                <Lock className="w-2.5 h-2.5" />
                <span>PRO</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* Title */}
        <h1 className="text-base font-black text-white leading-tight">
          {article.title || 'Untitled Article'}
        </h1>

        {/* Metadata */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-400 border-y border-slate-800/80 py-1.5">
          <span className="flex items-center space-x-1">
            <User className="w-3 h-3 text-indigo-400" />
            <span>{article.author || 'Author'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{article.readTime || '3 min read'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-slate-500" />
            <span>{article.date || 'Today'}</span>
          </span>
        </div>

        {/* Summary Card */}
        {article.summary && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs leading-relaxed italic">
            "{article.summary}"
          </div>
        )}

        {/* Key Takeaways */}
        {article.keyTakeaways && article.keyTakeaways.filter(Boolean).length > 0 && (
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Key Takeaways</span>
            </span>
            <ul className="space-y-1 text-xs text-indigo-200">
              {article.keyTakeaways.filter(Boolean).map((t, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Body */}
        <div className="pt-2 text-xs text-slate-300">
          {renderContent(article.content)}
        </div>
      </div>
    </div>
  );
}
