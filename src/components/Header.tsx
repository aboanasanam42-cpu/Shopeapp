import React from 'react';
import { ShoppingBag, Github, Globe, Cloud, CheckCircle2 } from 'lucide-react';
import { CartItem, VerifiedPurchase } from '../types';

interface HeaderProps {
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenGitHubModal: () => void;
  onOpenNetlifyModal: () => void;
  onOpenPurchasesModal: () => void;
  purchases: VerifiedPurchase[];
  totalProductsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  cart,
  onOpenCart,
  onOpenGitHubModal,
  onOpenNetlifyModal,
  onOpenPurchasesModal,
  purchases,
  totalProductsCount,
}) => {
  const isAr = lang === 'ar';
  const cartTotalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
        >
          {isAr ? 'متجر الدكتور مالك الرميمة' : 'Dr. Malik Al-Rumaima Store'}
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#catalog"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? `الكتالوج (${totalProductsCount})` : `Catalog (${totalProductsCount})`}
          </a>
          <a
            href="#gateway"
            className="hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0"
          >
            {isAr ? 'الدفع عبر Binance' : 'Binance Pay'}
          </a>
          <button
            onClick={onOpenGitHubModal}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            <Github className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'مزامنة Shopeapp' : 'Shopeapp Sync'}</span>
          </button>
          <button
            onClick={onOpenNetlifyModal}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors whitespace-nowrap shrink-0 text-slate-300"
          >
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'نشر Netlify' : 'Netlify Drop'}</span>
          </button>
          {purchases.length > 0 && (
            <button
              onClick={onOpenPurchasesModal}
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap shrink-0 font-semibold"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? `تنزيلاتي (${purchases.length})` : `Downloads (${purchases.length})`}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action + Utility */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleLang}
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isAr ? 'English' : 'عربي'}</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Open Shopping Cart"
            className="relative flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm shadow-emerald-950"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isAr ? 'السلة' : 'Cart'}</span>
            {cartTotalItems > 0 && (
              <span className="flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-slate-950 rounded-full">
                {cartTotalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
