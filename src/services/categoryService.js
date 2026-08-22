// Category Management Service
// Supports dynamic creation, deletion, and customization of categories across the app

const CATEGORIES_KEY = 'tippulse_custom_categories';

export const DEFAULT_CATEGORIES = [
  { id: 'Productivity', label: 'Productivity', icon: 'Zap', gradient: 'from-amber-500 to-orange-600' },
  { id: 'Tech & AI', label: 'Tech & AI', icon: 'Cpu', gradient: 'from-blue-600 to-cyan-600' },
  { id: 'Health', label: 'Health', icon: 'Heart', gradient: 'from-rose-500 to-pink-600' },
  { id: 'Finance', label: 'Finance', icon: 'DollarSign', gradient: 'from-emerald-600 to-teal-600' },
  { id: 'Mindset', label: 'Mindset', icon: 'Brain', gradient: 'from-purple-600 to-indigo-600' },
];

export const AVAILABLE_ICONS = [
  'Zap', 'Cpu', 'Heart', 'DollarSign', 'Brain', 'Flame', 'Sparkles', 'Rocket', 
  'Compass', 'Globe', 'BookOpen', 'Award', 'Smile', 'Sun', 'Target', 'Coffee'
];

export const categoryService = {
  getCategories: () => {
    try {
      const stored = localStorage.getItem(CATEGORIES_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  addCategory: (label, icon = 'Sparkles', gradient = 'from-indigo-600 to-violet-600') => {
    const cleanLabel = label.trim();
    if (!cleanLabel) return null;

    const list = categoryService.getCategories();
    const existing = list.find((c) => c.label.toLowerCase() === cleanLabel.toLowerCase());
    if (existing) return list;

    const newCat = {
      id: cleanLabel,
      label: cleanLabel,
      icon,
      gradient,
    };

    const updated = [...list, newCat];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return updated;
  },

  deleteCategory: (id) => {
    const list = categoryService.getCategories();
    const updated = list.filter((c) => c.id !== id);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    return updated;
  },

  resetCategories: () => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  },
};
