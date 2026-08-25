// App Branding & Theme Customizer Service
// Controls dynamic app name, logo, accent colors, typography, and theme modes

const CONFIG_KEY = 'tippulse_app_branding_config';

export const THEME_PALETTES = [
  { id: 'indigo', name: 'Indigo Modern', primary: '#4f46e5', primaryHover: '#4338ca', lightBg: '#eef2ff' },
  { id: 'emerald', name: 'Emerald Forest', primary: '#059669', primaryHover: '#047857', lightBg: '#ecfdf5' },
  { id: 'violet', name: 'Royal Purple', primary: '#7c3aed', primaryHover: '#6d28d9', lightBg: '#f5f3ff' },
  { id: 'rose', name: 'Vibrant Rose', primary: '#e11d48', primaryHover: '#be123c', lightBg: '#fff1f2' },
  { id: 'amber', name: 'Sunset Amber', primary: '#d97706', primaryHover: '#b45309', lightBg: '#fffbeb' },
  { id: 'cyan', name: 'Ocean Cyan', primary: '#0891b2', primaryHover: '#0e7490', lightBg: '#ecfeff' },
  { id: 'blue', name: 'Electric Blue', primary: '#2563eb', primaryHover: '#1d4ed8', lightBg: '#eff6ff' },
  { id: 'slate', name: 'Minimal Slate', primary: '#334155', primaryHover: '#1e293b', lightBg: '#f1f5f9' },
];

export const FONT_OPTIONS = [
  { id: 'sans', name: 'Inter (Clean Modern Sans)' },
  { id: 'serif', name: 'Merriweather (Classic Editorial Serif)' },
];

export const LOGO_ICONS = [
  'BookOpen', 'Sparkles', 'Flame', 'Rocket', 'Compass', 'Diamond', 'Crown', 'Globe', 'Zap', 'Heart', 'Award'
];

const DEFAULT_CONFIG = {
  appName: 'TipPulse',
  appTagline: 'Daily Tips & News',
  logoType: 'icon', // 'icon' | 'image'
  logoIcon: 'BookOpen',
  logoImageUrl: '',
  accentPalette: 'indigo',
  fontFamily: 'sans',
  appIconBadge: 'READY',
  dailyTipTitle: '2-Minute Rule',
  dailyTipContent: 'If an action takes less than two minutes, do it immediately to clear cognitive clutter.',
};

export const appConfigService = {
  getConfig: () => {
    try {
      const stored = localStorage.getItem(CONFIG_KEY);
      return stored ? { ...DEFAULT_CONFIG, ...JSON.parse(stored) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  },

  saveConfig: (newConfig) => {
    const updated = { ...appConfigService.getConfig(), ...newConfig };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
    return updated;
  },

  resetConfig: () => {
    localStorage.removeItem(CONFIG_KEY);
    return DEFAULT_CONFIG;
  },
};
