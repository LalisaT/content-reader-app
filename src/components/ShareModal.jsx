import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle, Globe } from 'lucide-react';
import { Share } from '@capacitor/share';

export default function ShareModal({ isOpen, onClose, article, shareUrl, shareText }) {
  const [copied, setCopied] = useState(false);

  // Close modal if hardware back button is pressed on Android
  useEffect(() => {
    if (!isOpen) return;
    const handleHardwareBack = (e) => {
      e.preventDefault();
      onClose();
    };
    window.addEventListener('tippulse_hardware_back', handleHardwareBack);
    return () => window.removeEventListener('tippulse_hardware_back', handleHardwareBack);
  }, [isOpen, onClose]);

  // Reset copied state on open
  useEffect(() => {
    if (isOpen) setCopied(false);
  }, [isOpen]);

  if (!isOpen || !article) return null;

  const url = shareUrl || window.location.href;
  const text = shareText || article.title;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleOpenTelegram = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenTwitter = () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(xUrl, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    try {
      await Share.share({
        title: article.title,
        text: text,
        url: url,
        dialogTitle: 'Share this Tip',
      });
      onClose();
    } catch {
      // Fallback to web share if available
      if (navigator.share) {
        try {
          await navigator.share({
            title: article.title,
            text: text,
            url: url,
          });
          onClose();
        } catch {
          // Cancelled
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal / Bottom Sheet Box */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom-6 sm:slide-in-from-bottom-2 duration-200 z-10"
      >
        {/* Top Handle on Mobile */}
        <div className="w-12 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto sm:hidden mb-1"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                Share this Tip
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[240px]">
                {article.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channels Grid: Telegram, Facebook, WhatsApp, X, More */}
        <div>
          <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
            Share to
          </span>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 text-center">
            {/* 1. Telegram */}
            <button
              onClick={handleOpenTelegram}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200/60 dark:border-sky-800/50 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-sm mb-1.5 group-hover:scale-105 transition-transform">
                <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Telegram</span>
            </button>

            {/* 2. Facebook */}
            <button
              onClick={handleOpenFacebook}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/60 dark:border-blue-800/50 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-bold text-xl shadow-sm mb-1.5 group-hover:scale-105 transition-transform">
                f
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Facebook</span>
            </button>

            {/* 3. WhatsApp */}
            <button
              onClick={handleOpenWhatsApp}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/60 dark:border-emerald-800/50 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-sm mb-1.5 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">WhatsApp</span>
            </button>

            {/* 4. X (Twitter) */}
            <button
              onClick={handleOpenTwitter}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-transform active:scale-95 group"
            >
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-black text-base shadow-sm mb-1.5 group-hover:scale-105 transition-transform">
                𝕏
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Twitter / 𝕏</span>
            </button>

            {/* 5. More / Native System Sheet */}
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/50 transition-transform active:scale-95 group col-span-4 sm:col-span-1"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm mb-1.5 group-hover:scale-105 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">More Apps</span>
            </button>
          </div>
        </div>

        {/* Copy Link Row */}
        <div className="pt-2">
          <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Or Copy Link
          </span>

          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/80 p-1.5 pl-3 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-mono truncate flex-1 select-all">
              {url}
            </span>

            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Dismiss Button */}
        <div className="pt-1 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
