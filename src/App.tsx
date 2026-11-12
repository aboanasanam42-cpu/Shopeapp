import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PaymentModal } from './components/PaymentModal';
import { CartDrawer } from './components/CartDrawer';
import { GitHubAutomationModal } from './components/GitHubAutomationModal';
import { NetlifyDeploymentModal } from './components/NetlifyDeploymentModal';
import { PurchasedDownloadsModal } from './components/PurchasedDownloadsModal';
import { Footer } from './components/Footer';

import { PRODUCTS_CATALOG } from './data/products';
import { Product, CartItem, VerifiedPurchase } from './types';
import {
  getStoredGitHubConfig,
  fetchLiveRepositoryCatalog,
  resolveProductDownloadUrl,
} from './services/githubService';
import { Sparkles, Package, ShieldCheck } from 'lucide-react';

const STORAGE_KEYS = {
  CART: 'drmalik_store_cart_v2',
  PURCHASES: 'drmalik_store_purchases_v2',
  LANG: 'drmalik_store_lang_v2',
};

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return (saved as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const [products, setProducts] = useState<Product[]>(PRODUCTS_CATALOG);
  const [releaseAssetsCount, setReleaseAssetsCount] = useState<number>(0);
  const [isLiveSynced, setIsLiveSynced] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [purchases, setPurchases] = useState<VerifiedPurchase[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [itemsToCheckout, setItemsToCheckout] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [isNetlifyModalOpen, setIsNetlifyModalOpen] = useState(false);
  const [isPurchasesModalOpen, setIsPurchasesModalOpen] = useState(false);

  const syncWithGitHub = useCallback(async () => {
    setIsSyncing(true);
    try {
      const cfg = getStoredGitHubConfig();
      const { products: liveProducts, releaseStatus, isLiveSynced: synced } =
        await fetchLiveRepositoryCatalog(cfg.owner, cfg.repo, cfg.tag, cfg.token);
      if (liveProducts.length > 0) {
        setProducts(liveProducts);
      }
      setReleaseAssetsCount(releaseStatus.assetsCount);
      setIsLiveSynced(synced);
    } catch (err) {
      console.warn('Using bundled repository catalog fallback:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    syncWithGitHub();
  }, [syncWithGitHub]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASES, JSON.stringify(purchases));
    } catch {}
  }, [purchases]);

  const unlockedProductIds = useMemo(() => {
    const ids = new Set<string>();
    purchases.forEach((p) => {
      p.items.forEach((item) => ids.add(item.id));
    });
    return ids;
  }, [purchases]);

  const categoryCounts = useMemo(() => {
    return {
      all: products.length,
      medical: products.filter((p) => p.category === 'medical').length,
      trading: products.filter((p) => p.category === 'trading').length,
      utilities: products.filter((p) => p.category === 'utilities').length,
      books: products.filter((p) => p.category === 'books').length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        item.title.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.descriptionAr.toLowerCase().includes(q) ||
        item.descriptionEn.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [products, activeCategory, searchQuery]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) return prev;
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleQuickBuy = (product: Product) => {
    setItemsToCheckout([product]);
    setIsPaymentModalOpen(true);
  };

  const handleCheckoutCart = () => {
    setIsCartOpen(false);
    setItemsToCheckout(cart.map((c) => c.product));
    setIsPaymentModalOpen(true);
  };

  const handleCheckoutAllBundle = () => {
    setItemsToCheckout(products);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (purchase: VerifiedPurchase) => {
    setPurchases((prev) => [purchase, ...prev]);
    const purchasedIds = new Set(purchase.items.map((i) => i.id));
    setCart((prev) => prev.filter((item) => !purchasedIds.has(item.product.id)));
  };

  const handleDirectDownload = (product: Product) => {
    const url = resolveProductDownloadUrl(product);
    const link = document.createElement('a');
    link.href = url;
    link.download = product.filename.trim();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isAr = lang === 'ar';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenNetlifyModal={() => setIsNetlifyModalOpen(true)}
        onOpenPurchasesModal={() => setIsPurchasesModalOpen(true)}
        purchases={purchases}
        totalProductsCount={products.length}
      />

      <main className="flex-1">
        <Hero
          lang={lang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalProductsCount={products.length}
          releaseAssetsCount={releaseAssetsCount}
          isLiveSynced={isLiveSynced}
          isSyncing={isSyncing}
          onRefreshSync={syncWithGitHub}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        />

        <section id="catalog">
          <CategoryFilter
            lang={lang}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={categoryCounts}
          />
        </section>

        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {isAr ? 'مكتبة التطبيقات والأكواد والمؤلفات الرقمية' : 'Available Software, Bots & Books'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {isAr
                  ? `عرض ${filteredProducts.length} من أصل ${products.length} ملفاً في مستودع Shopeapp · تسعير موحد $2.00 USD`
                  : `Showing ${filteredProducts.length} of ${products.length} files from Shopeapp · Flat $2.00 USD`}
              </p>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                {isAr ? 'مسح تصفية البحث' : 'Clear search'}
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center rounded-2xl border border-slate-800 bg-slate-900/50 space-y-3">
              <Package className="w-12 h-12 text-slate-700 mx-auto" />
              <h3 className="text-base font-semibold text-white">
                {isAr ? 'لم يتم العثور على ملفات مطابقة' : 'No matching files found'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {isAr
                  ? 'جرّب كلمات بحث أخرى أو انتقل بين تصنيفات الطبية، التداول، الأدوات، والكتب.'
                  : 'Try different keywords or switch between Medical, Trading, Utilities, and Books.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  lang={lang}
                  onQuickBuy={handleQuickBuy}
                  onAddToCart={handleAddToCart}
                  onViewDetails={setSelectedProduct}
                  isUnlocked={unlockedProductIds.has(product.id)}
                  onDirectDownload={handleDirectDownload}
                />
              ))}
            </div>
          )}

          {/* Complete Archive Spotlight */}
          <div
            id="gateway"
            className="mt-16 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>{isAr ? 'حزمة المستودع الشاملة' : 'FULL SHOPEAPP REPOSITORY BUNDLE'}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{products.length} ITEMS</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {isAr
                    ? `امتلك كامل مكتبة الدكتور مالك الرميمة (${products.length} تطبيقاً وكتاباً)`
                    : `Unlock All ${products.length} Dr. Malik Apps, Bots & Books`}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {isAr
                    ? 'إتاحة فورية لجميع الملفات المرفوعة في مستودع Shopeapp وإصدار Release v1.0.0 عبر بوابة الدفع الرسمية Binance Pay / USDT TRC20.'
                    : 'Instant unlock for all files hosted in Shopeapp main branch & Release v1.0.0 via Binance Pay / USDT TRC20.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <button
                  onClick={handleCheckoutAllBundle}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-xl shadow-emerald-950 whitespace-nowrap"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? `شراء الحزمة الكاملة ($${(products.length * 2).toFixed(2)})` : `Buy Full Bundle ($${(products.length * 2).toFixed(2)})`}</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ProductDetailModal
        product={selectedProduct}
        lang={lang}
        onClose={() => setSelectedProduct(null)}
        onQuickBuy={handleQuickBuy}
        onAddToCart={handleAddToCart}
        isUnlocked={selectedProduct ? unlockedProductIds.has(selectedProduct.id) : false}
        onDirectDownload={handleDirectDownload}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        items={itemsToCheckout}
        lang={lang}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lang={lang}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckoutCart}
      />

      <GitHubAutomationModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        lang={lang}
        products={products}
        onRefreshCatalog={syncWithGitHub}
      />

      <NetlifyDeploymentModal
        isOpen={isNetlifyModalOpen}
        onClose={() => setIsNetlifyModalOpen(false)}
        lang={lang}
      />

      <PurchasedDownloadsModal
        isOpen={isPurchasesModalOpen}
        onClose={() => setIsPurchasesModalOpen(false)}
        purchases={purchases}
        lang={lang}
      />

      <Footer
        lang={lang}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenNetlifyModal={() => setIsNetlifyModalOpen(true)}
      />
    </div>
  );
}
