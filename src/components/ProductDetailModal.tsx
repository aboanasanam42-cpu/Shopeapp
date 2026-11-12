import React, { useState } from 'react';
import { X, Check, Copy, Download, Shield, FileCheck, ExternalLink, Hash, HardDrive, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { OFFICIAL_USDT_TRC20_ADDRESS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  lang: 'ar' | 'en';
  onClose: () => void;
  onQuickBuy: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isUnlocked: boolean;
  onDirectDownload: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  lang,
  onClose,
  onQuickBuy,
  onAddToCart,
  isUnlocked,
  onDirectDownload,
}) => {
  if (!product) return null;
  const isAr = lang === 'ar';
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(product.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 md:p-8 space-y-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-emerald-400 uppercase tracking-wide">
                {product.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{product.version}</span>
              <span aria-hidden="true">·</span>
              <span>{product.author}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug">
              {isAr ? product.title : product.titleEn}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Overview Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
          <div>
            <span className="block text-slate-500 text-[11px] mb-0.5">{isAr ? 'اسم الملف' : 'Filename'}</span>
            <span className="font-mono text-slate-200 truncate block font-medium" title={product.filename}>
              {product.filename}
            </span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px] mb-0.5">{isAr ? 'الحجم' : 'File Size'}</span>
            <span className="font-mono text-slate-200 font-medium tabular-nums">{product.size}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px] mb-0.5">{isAr ? 'النوع والامتداد' : 'Format'}</span>
            <span className="font-mono uppercase text-emerald-400 font-bold">{product.type}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[11px] mb-0.5">{isAr ? 'السعر الرسمي' : 'Uniform Price'}</span>
            <span className="font-mono text-emerald-400 font-bold tabular-nums">2.00 USDT</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-white">
            {isAr ? 'الوصف الأكاديمي والتقني' : 'Technical Specification'}
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed">
            {isAr ? product.descriptionAr : product.descriptionEn}
          </p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5">
          <h4 className="text-sm font-semibold text-white">
            {isAr ? 'الميزات والخصائص البرمجية المدمجة' : 'Included Capabilities & Architecture'}
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            {(isAr ? product.featuresAr : product.featuresEn).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Integrity Checksum SHA-256 */}
        <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'بصمة النزاهة الرقمية (SHA-256 Checksum)' : 'Cryptographic Integrity (SHA-256)'}</span>
            </span>
            <button
              onClick={handleCopyHash}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
            >
              {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHash ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ البصمة' : 'Copy')}</span>
            </button>
          </div>
          <p className="font-mono text-[11px] text-slate-300 break-all select-all bg-slate-900/80 p-2 rounded border border-slate-800/60">
            {product.sha256}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-400">
              {isAr ? 'تسليم تلقائي فوري بعد الدفع على شبكة ترون' : 'Instant delivery via TRC20 verification'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isUnlocked ? (
              <button
                onClick={() => onDirectDownload(product)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-lg shadow-emerald-950"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تنزيل الملف فوراً' : 'Download File Now'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onAddToCart(product)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAr ? 'إضافة للسلة' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => onQuickBuy(product)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-colors font-mono"
                >
                  <span>{isAr ? 'شراء فوري بـ 2 USDT' : 'Buy Now for 2 USDT'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
