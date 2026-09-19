import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, LogOut, FileText,
  FolderOpen, Sparkles, Bell, ArrowRight, CheckCircle2, KeyRound, Wifi
} from 'lucide-react';
import ArticleEditor from './components/ArticleEditor';
import ArticlesTable from './components/ArticlesTable';
import BrandingSettings from './components/BrandingSettings';
import NotificationSender from './components/NotificationSender';

// One-way SHA-256 cryptographic hash (Cannot be reversed or decoded back to plain text)
const MASTER_KEY_HASH = 'f7760d6b76aa1ad0f33caf137d2777730cf57d2e9c8b5e8c9663c574a5fcaf2e';
const STORAGE_KEY = 'tippulse_admin_session_auth';

async function computeHash(text) {
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'authenticated';
    } catch {
      return false;
    }
  });

  // Auth Form State
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [rememberDevice, setRememberDevice] = useState(true);

  // Navigation State
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'articles' | 'branding' | 'notifications'
  const [editingArticle, setEditingArticle] = useState(null);

  const handleUnlock = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const inputHash = await computeHash(passcode.trim());
      if (inputHash === MASTER_KEY_HASH) {
        if (rememberDevice) {
          localStorage.setItem(STORAGE_KEY, 'authenticated');
        }
        setIsAuthenticated(true);
      } else {
        setAuthError('Incorrect passcode. Access denied.');
      }
    } catch {
      setAuthError('Error verifying credentials.');
    }
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasscode('');
  };

  // If Not Authenticated -> Show Master Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">TipPulse Admin Studio</h1>
              <p className="text-xs text-slate-400">Direct Firestore Cloud Management</p>
            </div>
          </div>

          <div className="mb-5 p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/50 flex items-center space-x-2 text-xs text-indigo-300">
            <Wifi className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Connected to Cloud Firestore Project: <strong className="text-white">tippulse</strong></span>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Admin Master Passcode</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  autoFocus
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Master Passcode"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono tracking-widest text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="remember" className="text-slate-400 text-xs cursor-pointer select-none">
                Remember this computer (Stay signed in)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all mt-2"
            >
              <span>Unlock Admin Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-white flex items-center space-x-2">
                <span>TipPulse</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Admin Studio
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">Cloud Management & Live Publishing</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => {
                setActiveTab('editor');
                setEditingArticle(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'editor'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'articles'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>All Articles</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'branding'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Daily Tip</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Alerts</span>
            </button>
          </nav>

          {/* Status badge & Lock */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full hidden sm:flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Firestore Connected</span>
            </span>
            <button
              onClick={handleSignOut}
              title="Lock Studio"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'editor' && (
          <ArticleEditor
            editingArticle={editingArticle}
            onArticleSaved={() => {
              setEditingArticle(null);
            }}
            onCancelEdit={() => {
              setEditingArticle(null);
            }}
          />
        )}

        {activeTab === 'articles' && (
          <ArticlesTable
            onEditArticle={(art) => {
              setEditingArticle(art);
              setActiveTab('editor');
            }}
          />
        )}

        {activeTab === 'branding' && <BrandingSettings />}

        {activeTab === 'notifications' && <NotificationSender />}
      </main>
    </div>
  );
}
