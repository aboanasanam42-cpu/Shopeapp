import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lang: 'ar' | 'en';
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  lang,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';
  const totalAmountUSDT = cart.reduce((acc, item) => acc + item.product.priceUSDT * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between text-slate-100">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                {isAr ? 'سلة المشتريات الرقمية' : 'Digital Shopping Bag'}
              </h3>
              <span className="text-xs text-slate-400 font-mono">({cart.length})</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-700" />
                <p className="text-sm font-medium">
                  {isAr ? 'سلتك فارغة حالياً' : 'Your cart is currently empty'}
                </p>
                <p className="text-xs text-slate-500 max-w-xs">
                  {isAr
                    ? 'اختر من بين 47+ تطبيق وسورس كود وبرمجيات ويندوز ومؤلفات بسعر موحد 2 USDT.'
                    : 'Choose from 47+ Android apps, Windows tools, source code and books at 2 USDT each.'}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      {item.product.type} · {item.product.size}
                    </span>
                    <h4 className="text-xs font-semibold text-white leading-snug line-clamp-2">
                      {isAr ? item.product.title : item.product.titleEn}
                    </h4>
                    <p className="font-mono text-xs text-emerald-400 font-bold tabular-nums">
                      {item.product.priceUSDT.toFixed(2)} USDT
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors"
                    title={isAr ? 'حذف من السلة' : 'Remove item'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'عدد العناصر' : 'Items Count'}</span>
                  <span className="font-mono text-white tabular-nums">{cart.length}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>{isAr ? 'العملة والشبكة' : 'Currency & Network'}</span>
                  <span className="font-medium text-emerald-400">USDT (TRC-20)</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>{isAr ? 'الإجمالي المطلوب' : 'Total Amount'}</span>
                  <span className="font-mono text-emerald-400 tabular-nums">
                    {totalAmountUSDT.toFixed(2)} USDT
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors shadow-lg shadow-emerald-950"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isAr ? `إتمام الدفع (${totalAmountUSDT.toFixed(2)} USDT)` : `Checkout (${totalAmountUSDT.toFixed(2)} USDT)`}</span>
                </button>

                <button
                  onClick={onClearCart}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {isAr ? 'تفريغ السلة' : 'Clear Bag'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
