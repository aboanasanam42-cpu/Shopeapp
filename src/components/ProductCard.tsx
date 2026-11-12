import React from 'react';
import { Download, ShoppingBag, Eye, Stethoscope, TrendingUp, Cpu, BookOpen } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  lang: 'ar' | 'en';
  onQuickBuy: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
  isUnlocked: boolean;
  onDirectDownload: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  lang,
  onQuickBuy,
  onAddToCart,
  onViewDetails,
  isUnlocked,
  onDirectDownload,
}) => {
  const isAr = lang === 'ar';

  const getTypeIcon = () => {
    switch (product.category) {
      case 'medical':
        return <Stethoscope className="w-4 h-4 text-emerald-400" />;
      case 'trading':
        return <TrendingUp className="w-4 h-4 text-cyan-400" />;
      case 'utilities':
        return <Cpu className="w-4 h-4 text-sky-400" />;
      case 'books':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
    }
  };

  const getCategoryLabel = () => {
    switch (product.category) {
      case 'medical':
        return isAr ? 'طبي وعيادات' : 'Medical & Clinic';
      case 'trading':
        return isAr ? 'بوت تداول' : 'Trading Bot';
      case 'utilities':
        return isAr ? 'أدوات وتطبيقات' : 'App & Utility';
      case 'books':
        return isAr ? 'كتاب ومؤلف' : 'Book & PDF';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-5 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900 shadow-sm hover:shadow-md hover:shadow-black/50">
      <div className="space-y-3">
        {/* Unboxed Metadata Header */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            {getTypeIcon()}
            <span>{getCategoryLabel()}</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="font-mono uppercase text-slate-300">{product.type}</span>
          </div>
          <span className="font-mono tabular-nums text-slate-400 text-[11px]">{product.size}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onViewDetails(product)}
          className="text-base font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer line-clamp-2 leading-snug"
          title={isAr ? product.title : product.titleEn}
        >
          {isAr ? product.title : product.titleEn}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {isAr ? product.descriptionAr : product.descriptionEn}
        </p>

        {/* Quiet technical metadata row */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono truncate">
          <span>{product.hasReleaseAsset ? 'Release CDN' : 'GitHub Main'}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate" dir="ltr">{product.filename}</span>
        </div>
      </div>

      {/* Footer: Price & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider">
            {isAr ? 'السعر الموحد' : 'Fixed Price'}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono tabular-nums text-emerald-400">
              $2.00
            </span>
            <span className="text-[11px] font-semibold text-slate-400">USD</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {isUnlocked ? (
            <button
              onClick={() => onDirectDownload(product)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isAr ? 'تنزيل فوري' : 'Download'}</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => onViewDetails(product)}
                title={isAr ? 'عرض التفاصيل والخصائص' : 'View Details'}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onAddToCart(product)}
                title={isAr ? 'إضافة إلى السلة' : 'Add to Cart'}
                className="p-2 text-slate-300 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onQuickBuy(product)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>{isAr ? 'شراء وتحميل (2.00$)' : 'Buy & Download ($2.00)'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
