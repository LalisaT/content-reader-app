import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  FileText,
  Sliders,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Trash2,
  PlusCircle,
  Download,
  FolderEdit,
  User,
  KeyRound,
  LogOut,
  Lock,
  Edit3,
  Palette,
  Upload,
  Camera
} from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { THEME_PALETTES } from '../services/appConfigService';

export default function SettingsView({
  readerTheme,
  onChangeReaderTheme,
  fontSize,
  onChangeFontSize,
  onOpenPolicy,
  onOpenAdminPost,
  onOpenCustomizer,
  onEditArticle,
  customArticles = [],
  onDeleteCustomArticle,
  currentUser,
  onOpenAuth,
  onLogout,
  appConfig,
}) {
  const [adConsent, setAdConsent] = useState(storageService.getAdConsent());
  const [copiedId, setCopiedId] = useState(null);

  // Admin credential change state
  const [showChangeAdminPass, setShowChangeAdminPass] = useState(false);
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [adminPassUpdatedMsg, setAdminPassUpdatedMsg] = useState(false);

  const avatarInputRef = useRef(null);
  const isAdmin = currentUser && currentUser.role === 'admin';

  const togglePersonalizedAds = () => {
    const updated = { ...adConsent, personalized: !adConsent.personalized };
    setAdConsent(updated);
    storageService.setAdConsent(updated);
  };

  const handleCopyId = (idName, idValue) => {
    navigator.clipboard?.writeText(idValue);
    setCopiedId(idName);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customArticles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "custom_articles.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleUpdateAdminCredentials = (e) => {
    e.preventDefault();
    if (!newAdminPass && !newAdminName) return;
    authService.updateAdminCredentials(newAdminPass, newAdminName);
    setAdminPassUpdatedMsg(true);
    setNewAdminPass('');
    setTimeout(() => setAdminPassUpdatedMsg(false), 3000);
  };

  // Avatar upload from device gallery
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (currentUser) {
        const updated = { ...currentUser, avatar: event.target.result };
        localStorage.setItem('tippulse_current_user', JSON.stringify(updated));
        window.location.reload();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearCache = () => {
    if (window.confirm('Clear all saved bookmarks, reading history, and cache?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 animate-in fade-in duration-200">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Account, Themes & App Customization
        </h2>
        <p className="text-xs text-slate-500">
          Customize app branding, upload gallery images, manage posts & AdMob
        </p>
      </div>

      <div className="space-y-4">
        {/* Section 0: User Profile & Avatar Upload */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <input
            type="file"
            ref={avatarInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group cursor-pointer" onClick={() => currentUser && avatarInputRef.current?.click()}>
                {currentUser ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 group-hover:opacity-80 transition-opacity"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <User className="w-6 h-6" />
                  </div>
                )}
                {currentUser && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {currentUser ? currentUser.name : 'Guest Reader'}
                  </h3>
                  {isAdmin ? (
                    <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full border border-amber-300">
                      👑 Admin
                    </span>
                  ) : currentUser ? (
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-semibold text-[9px] px-2 py-0.5 rounded-full">
                      Reader
                    </span>
                  ) : (
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 text-[9px] px-2 py-0.5 rounded-full">
                      Not Signed In
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser
                    ? `@${currentUser.username} • Tap photo to change avatar from gallery`
                    : 'Sign in to access creator studio & customize'}
                </p>
              </div>
            </div>

            <div>
              {currentUser ? (
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => onOpenAuth(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: App Branding & Theme Customizer (Admin Studio) */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-1.5 font-black text-xs uppercase tracking-wide text-indigo-200">
                <Palette className="w-4 h-4" />
                <span>Live App Theme & Branding</span>
              </div>
              <h3 className="text-base font-bold mt-1">
                Customize "{appConfig?.appName || 'TipPulse'}"
              </h3>
              <p className="text-xs text-indigo-100/80 mt-0.5">
                Change app name, brand color palette, font styles & daily tips.
              </p>
            </div>

            <button
              onClick={onOpenCustomizer}
              className="px-4 py-2 bg-white text-indigo-900 font-extrabold text-xs rounded-xl shadow-md hover:bg-indigo-50 active:scale-95 transition-all"
            >
              Edit Entire App
            </button>
          </div>
        )}

        {/* Section 2: Article & Post Management Studio */}
        <div className={`rounded-2xl p-4 border transition-all ${
          isAdmin
            ? 'bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-slate-800 dark:to-amber-950/30 border-amber-300/80 dark:border-amber-700/80'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
        } shadow-xs`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
              <FolderEdit className="w-4 h-4" />
              <span>Article & Post Management</span>
            </div>
            {isAdmin && (
              <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                {customArticles.length} Custom Articles
              </span>
            )}
          </div>

          {isAdmin ? (
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                Create new articles with photos from your gallery, or edit and delete published posts.
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={onOpenAdminPost}
                  className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-md shadow-amber-500/30 flex items-center justify-center space-x-1.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Create New Article</span>
                </button>

                {customArticles.length > 0 && (
                  <button
                    onClick={handleExportJSON}
                    title="Export custom articles as JSON"
                    className="bg-white dark:bg-slate-750 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold text-xs py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export JSON</span>
                  </button>
                )}
              </div>

              {/* List of Custom Posts with EDIT and DELETE buttons */}
              {customArticles.length > 0 ? (
                <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-slate-700 space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Your Published Articles (Edit & Delete)
                  </span>
                  {customArticles.map((art) => (
                    <div
                      key={art.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                    >
                      <div className="min-w-0 flex-1 pr-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200 truncate block">
                          {art.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {art.category} • {art.date} {art.isPremium ? '• (PRO Locked)' : ''}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onEditArticle(art)}
                          title="Edit this post"
                          className="flex items-center space-x-1 px-2.5 py-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => onDeleteCustomArticle(art.id)}
                          title="Delete this post"
                          className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                  No custom articles published yet. Tap "+ Create New Article" to upload images and post.
                </div>
              )}

              {/* Admin Password Change */}
              <div className="mt-4 pt-3 border-t border-amber-200/60 dark:border-slate-700">
                <button
                  onClick={() => setShowChangeAdminPass(!showChangeAdminPass)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{showChangeAdminPass ? 'Hide Admin Security' : 'Change Admin Password'}</span>
                </button>

                {showChangeAdminPass && (
                  <form onSubmit={handleUpdateAdminCredentials} className="mt-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
                    {adminPassUpdatedMsg && (
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Admin credentials updated successfully!</span>
                      </div>
                    )}
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                        New Admin Display Name
                      </label>
                      <input
                        type="text"
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="e.g. Chief Editor"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                        New Admin Password
                      </label>
                      <input
                        type="password"
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="mt-2 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mx-auto mb-2 text-slate-500">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                Admin Privileges Required
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Sign in with the Administrator credentials (`admin` / `admin123`) to post, edit, or customize branding.
              </p>
              <button
                onClick={() => onOpenAuth(true)}
                className="mt-3.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all"
              >
                Sign In as Administrator
              </button>
            </div>
          )}
        </div>

        {/* Section 3: AdMob Compliance & SDK Status */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Google AdMob Integration Status</span>
          </div>

          <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/50 rounded-xl border border-indigo-200/60 dark:border-indigo-800/40 text-xs mb-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-800 dark:text-slate-200">AdMob SDK Mode</span>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full border border-emerald-300/50">
                Active (Test IDs)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Using official Google Test Ad Unit IDs. Safe from policy violations during testing.
            </p>
          </div>

          {/* Ad Unit IDs List */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-[11px] text-slate-500 uppercase tracking-wide">
              Configured Ad Units
            </span>
            {Object.entries(ADMOB_CONFIG.TEST_IDS).map(([name, id]) => (
              <div
                key={name}
                onClick={() => handleCopyId(name, id)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-750 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-[11px] text-slate-700 dark:text-slate-300 truncate">
                    {name.replace('_ANDROID', '')}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{id}</div>
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold ml-2 flex-shrink-0">
                  {copiedId === name ? 'Copied!' : 'Copy'}
                </span>
              </div>
            ))}
          </div>

          {/* GDPR / Personalized Ads Consent Toggle */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                Personalized Ads (GDPR / UMP)
              </div>
              <p className="text-[11px] text-slate-500">
                {adConsent.personalized ? 'Serving tailored ads based on consent' : 'Serving non-personalized ads'}
              </p>
            </div>
            <button
              onClick={togglePersonalizedAds}
              className="text-indigo-600 dark:text-indigo-400 p-1"
            >
              {adConsent.personalized ? (
                <ToggleRight className="w-8 h-8 fill-indigo-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Section 4: Reader Themes & Font Scale */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            <Sliders className="w-4 h-4" />
            <span>Reading Appearance</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Theme mode */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Reader Theme Mode</span>
              <div className="flex space-x-1.5">
                {[
                  { id: 'light', label: 'Light' },
                  { id: 'sepia', label: 'Sepia' },
                  { id: 'dark', label: 'Dark' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onChangeReaderTheme(t.id)}
                    className={`px-3 py-1 rounded-lg font-semibold capitalize border transition-all ${
                      readerTheme === t.id
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Default Font Size</span>
              <div className="flex space-x-1">
                {['sm', 'base', 'lg', 'xl'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onChangeFontSize(sz)}
                    className={`px-2.5 py-1 rounded-lg font-mono uppercase font-bold border transition-all ${
                      fontSize === sz
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Legal & Store Policy Documents */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
            <FileText className="w-4 h-4" />
            <span>Store & AdMob Legal Documents</span>
          </div>

          <div className="space-y-2 text-xs">
            <button
              onClick={onOpenPolicy}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Privacy Policy (GDPR & COPPA Compliant)
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </button>

            <a
              href="/app-ads.txt"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
            >
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                Authorized Digital Sellers (app-ads.txt)
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Section 6: Diagnostics */}
        <div className="text-center pt-2">
          <button
            onClick={handleClearCache}
            className="inline-flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 hover:underline p-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset App Storage & Cache</span>
          </button>
          <p className="text-[11px] text-slate-400 mt-2">
            {appConfig?.appName || 'TipPulse'} v1.0.0 • Built for Google AdMob & Play Store Policy Compliance
          </p>
        </div>
      </div>
    </div>
  );
}
