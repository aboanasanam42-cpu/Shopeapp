import React from 'react';
import { X, Download, CheckCircle2 } from 'lucide-react';
import { VerifiedPurchase, Product } from '../types';
import { resolveProductDownloadUrl } from '../services/githubService';

interface PurchasedDownloadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: VerifiedPurchase[];
  lang: 'ar' | 'en';
}

export const PurchasedDownloadsModal: React.FC<PurchasedDownloadsModalProps> = ({
  isOpen,
  onClose,
  purchases,
  lang,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleDownload = (p: Product) => {
    const url = resolveProductDownloadUrl(p);
    const link = document.createElement('a');
    link.href = url;
    link.download = p.filename.trim();
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'خزينة التنزيلات المعتمدة والمشتريات' : 'Purchased Downloads & Digital Vault'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'سجل المعاملات المؤكدة وروابط التحميل المباشرة' : 'Confirmed orders and direct downloads'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {purchases.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {isAr ? 'لم تقم بأي عمليات شراء بعد.' : 'No purchases found yet.'}
            </div>
          ) : (
            purchases.map((purchase) => (
              <div key={purchase.orderId} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs pb-2 border-b border-slate-800/80">
                  <div>
                    <span className="font-mono text-emerald-400 font-bold">{purchase.orderId}</span>
                    <span className="text-slate-500 mx-2">·</span>
                    <span className="text-slate-400">
                      {new Date(purchase.timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    ${purchase.totalUSDT.toFixed(2)} USD
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-500 truncate">
                  Ref: {purchase.txHash}
                </div>

                <div className="space-y-2 pt-1">
                  {purchase.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-slate-900 border border-slate-800/80"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">
                          {isAr ? item.title : item.titleEn}
                        </p>
                        <span className="text-[11px] font-mono text-slate-400">
                          {item.filename} · {item.size}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownload(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isAr ? 'تنزيل' : 'Download'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
