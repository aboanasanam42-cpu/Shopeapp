import React from 'react';
import { Stethoscope, TrendingUp, Cpu, BookOpen, Layers } from 'lucide-react';

interface CategoryFilterProps {
  lang: 'ar' | 'en';
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts: {
    all: number;
    medical: number;
    trading: number;
    utilities: number;
    books: number;
  };
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  lang,
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  const isAr = lang === 'ar';

  const categories = [
    {
      id: 'all',
      labelAr: 'كافة ملفات المستودع',
      labelEn: 'All Repository Files',
      count: counts.all,
      icon: Layers,
    },
    {
      id: 'medical',
      labelAr: 'البرمجيات الطبية والعيادات',
      labelEn: 'Medical & Clinic Software',
      count: counts.medical,
      icon: Stethoscope,
    },
    {
      id: 'trading',
      labelAr: 'بوتات ومنصات التداول (MEXC)',
      labelEn: 'Crypto Trading Bots',
      count: counts.trading,
      icon: TrendingUp,
    },
    {
      id: 'utilities',
      labelAr: 'تطبيقات الأندرويد وأدوات سطح المكتب',
      labelEn: 'Android & Desktop Utilities',
      count: counts.utilities,
      icon: Cpu,
    },
    {
      id: 'books',
      labelAr: 'مؤلفات وكتب د. مالك الرميمة',
      labelEn: 'Books & Literature',
      count: counts.books,
      icon: BookOpen,
    },
  ];

  return (
    <div className="w-full border-b border-slate-800 bg-slate-950/60 py-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                <span
                  className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-slate-950 text-emerald-300' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
