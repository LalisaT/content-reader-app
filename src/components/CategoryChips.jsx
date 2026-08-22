import React from 'react';
import {
  Sparkles,
  Zap,
  Cpu,
  Heart,
  DollarSign,
  Brain,
  Flame,
  Rocket,
  Compass,
  Globe,
  BookOpen,
  Award,
  Smile,
  Sun,
  Target,
  Coffee
} from 'lucide-react';

const ICON_COMPONENTS = {
  Sparkles,
  Zap,
  Cpu,
  Heart,
  DollarSign,
  Brain,
  Flame,
  Rocket,
  Compass,
  Globe,
  BookOpen,
  Award,
  Smile,
  Sun,
  Target,
  Coffee,
};

export default function CategoryChips({
  categories = [],
  activeCategory,
  onSelectCategory,
}) {
  const allCategories = [{ id: 'All', label: 'All Stories', icon: 'Sparkles' }, ...categories];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto py-3 px-4 no-scrollbar scroll-smooth">
      {allCategories.map((cat) => {
        const Icon = ICON_COMPONENTS[cat.icon] || Sparkles;
        const isSelected = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/30'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400 dark:text-slate-400'}`} />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
