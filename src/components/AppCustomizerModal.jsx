import React, { useState, useRef } from 'react';
import {
  X,
  Palette,
  Type,
  Sparkles,
  Sliders,
  CheckCircle2,
  RotateCcw,
  LayoutTemplate,
  FolderPlus,
  Trash2,
  Upload,
  BookOpen,
  Flame,
  Rocket,
  Compass,
  Diamond,
  Crown,
  Globe,
  Zap,
  Heart,
  Award,
  Smile,
  Sun,
  Target,
  Coffee,
  Plus
} from 'lucide-react';
import { THEME_PALETTES, FONT_OPTIONS, LOGO_ICONS } from '../services/appConfigService';
import { AVAILABLE_ICONS } from '../services/categoryService';

const ICON_MAP = {
  BookOpen, Sparkles, Flame, Rocket, Compass, Diamond, Crown, Globe, Zap, Heart, Award, Smile, Sun, Target, Coffee
};

export default function AppCustomizerModal({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetConfig,
  categories = [],
  onAddCategory,
  onDeleteCategory,
  onResetCategories,
}) {
  const [appName, setAppName] = useState(config.appName || 'TipPulse');
  const [appTagline, setAppTagline] = useState(config.appTagline || 'Daily Tips & News');
  const [appIconBadge, setAppIconBadge] = useState(config.appIconBadge || 'AdMob');
  const [logoType, setLogoType] = useState(config.logoType || 'icon');
  const [logoIcon, setLogoIcon] = useState(config.logoIcon || 'BookOpen');
  const [logoImageUrl, setLogoImageUrl] = useState(config.logoImageUrl || '');
  const [accentPalette, setAccentPalette] = useState(config.accentPalette || 'indigo');
  const [fontFamily, setFontFamily] = useState(config.fontFamily || 'sans');
  const [dailyTipTitle, setDailyTipTitle] = useState(config.dailyTipTitle || '2-Minute Rule');
  const [dailyTipContent, setDailyTipContent] = useState(config.dailyTipContent || 'If an action takes less than two minutes, do it immediately.');

  // New Category form state
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Sparkles');

  const logoFileRef = useRef(null);

  if (!isOpen) return null;

  // Handle Logo Upload from device gallery
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImageUrl(event.target.result);
      setLogoType('image');
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewCategory = (e) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;
    onAddCategory(newCatLabel.trim(), newCatIcon);
    setNewCatLabel('');
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSaveConfig({
      appName: appName.trim() || 'TipPulse',
      appTagline: appTagline.trim(),
      appIconBadge: appIconBadge.trim(),
      logoType,
      logoIcon,
      logoImageUrl,
      accentPalette,
      fontFamily,
      dailyTipTitle: dailyTipTitle.trim(),
      dailyTipContent: dailyTipContent.trim(),
    });
    onClose();
  };

  const handleReset = () => {
    if (window.confirm('Reset all app branding, logo, and themes back to defaults?')) {
      onResetConfig();
      onResetCategories();
      onClose();
    }
  };

  const SelectedLogoIcon = ICON_MAP[logoIcon] || BookOpen;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">Customize Logo, Themes & Categories</h2>
              <p className="text-[11px] text-slate-400">Change Logo, App Name, Add Categories & Colors</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto flex-1 space-y-4 text-xs text-slate-900 dark:text-slate-100">
          {/* Section 1: Logo & App Icon Manager */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span>App Logo & Icon Design</span>
              </span>
              <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setLogoType('icon')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${logoType === 'icon' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  Icon Symbol
                </button>
                <button
                  type="button"
                  onClick={() => setLogoType('image')}
                  className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${logoType === 'image' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  Custom Photo
                </button>
              </div>
            </div>

            {/* Live Logo Preview Box */}
            <div className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md flex-shrink-0 overflow-hidden">
                {logoType === 'image' && logoImageUrl ? (
                  <img src={logoImageUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <SelectedLogoIcon className="w-6 h-6" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Live Header Preview</span>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                  {appName || 'TipPulse'}
                </h4>
              </div>
            </div>

            {/* Logo Options: Icon Picker vs Upload */}
            {logoType === 'icon' ? (
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                  Choose App Logo Symbol
                </label>
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                  {LOGO_ICONS.map((iconName) => {
                    const IconComp = ICON_MAP[iconName] || BookOpen;
                    const isSelected = logoIcon === iconName;
                    return (
                      <button
                        type="button"
                        key={iconName}
                        onClick={() => setLogoIcon(iconName)}
                        title={iconName}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={logoFileRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 shadow-sm transition-all"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom Logo from Gallery</span>
                  </button>
                  {logoImageUrl && (
                    <button
                      type="button"
                      onClick={() => setLogoImageUrl('')}
                      className="px-3 py-2.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-bold"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Category Manager (Add & Delete Categories) */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
                <FolderPlus className="w-3.5 h-3.5 text-indigo-500" />
                <span>Categories Manager ({categories.length})</span>
              </span>
            </div>

            {/* List of current categories */}
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const IconComp = ICON_MAP[cat.icon] || Sparkles;
                return (
                  <div
                    key={cat.id}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs text-xs font-semibold text-slate-800 dark:text-slate-200"
                  >
                    <IconComp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>{cat.label}</span>
                    {categories.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onDeleteCategory(cat.id)}
                        title={`Delete ${cat.label}`}
                        className="p-0.5 ml-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Form to Add New Category */}
            <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block">
                + Add New Category
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="e.g. Science, Fitness, Travel..."
                  className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                />

                <select
                  value={newCatIcon}
                  onChange={(e) => setNewCatIcon(e.target.value)}
                  className="px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: App Name & Tagline */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>App Branding & Identity</span>
            </span>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                App Name (Header & Store Title)
              </label>
              <input
                type="text"
                required
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="e.g. DailyPulse, HealthGuide, TechPulse..."
                className="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  value={appTagline}
                  onChange={(e) => setAppTagline(e.target.value)}
                  placeholder="e.g. Daily Tips & Life Hacks"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Header Pill Badge
                </label>
                <input
                  type="text"
                  value={appIconBadge}
                  onChange={(e) => setAppIconBadge(e.target.value)}
                  placeholder="e.g. PRO, AdMob, v1.0"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Color Palette Accent */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
              <Palette className="w-3.5 h-3.5" />
              <span>Global Color Palette</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEME_PALETTES.map((palette) => {
                const isSelected = accentPalette === palette.id;
                return (
                  <button
                    type="button"
                    key={palette.id}
                    onClick={() => setAccentPalette(palette.id)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-slate-900 dark:border-white ring-2 ring-indigo-500 bg-white dark:bg-slate-900 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                      {palette.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Typography Font */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
              <Type className="w-3.5 h-3.5" />
              <span>App Typography Font</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              {FONT_OPTIONS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFontFamily(f.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    fontFamily === f.id
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className={f.id === 'serif' ? 'font-serif' : 'font-sans'}>{f.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Daily Nugget / Tip Editor */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Daily Quick Tip Nugget</span>
            </span>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tip Headline
              </label>
              <input
                type="text"
                value={dailyTipTitle}
                onChange={(e) => setDailyTipTitle(e.target.value)}
                placeholder="e.g. The 2-Minute Rule"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tip Content
              </label>
              <textarea
                rows={2}
                value={dailyTipContent}
                onChange={(e) => setDailyTipContent(e.target.value)}
                placeholder="Enter the advice displayed when users tap the Daily Tip button..."
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Defaults</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save App Theme & Logo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
