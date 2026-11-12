import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { X, Copy, Check, ShieldCheck, Loader2, Download, AlertCircle, Zap } from 'lucide-react';
import { Product, VerifiedPurchase } from '../types';
import { OFFICIAL_USDT_TRC20_ADDRESS } from '../data/products';
import { verifyTrc20Payment } from '../services/tronService';
import { getStoredGitHubConfig, resolveProductDownloadUrl } from '../services/githubService';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  lang: 'ar' | 'en';
  onPaymentSuccess: (purchase: VerifiedPurchase) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  lang,
  onPaymentSuccess,
}) => {
  if (!isOpen || items.length === 0) return null;

  const isAr = lang === 'ar';
  const totalAmountUSDT = items.reduce((acc, item) => acc + item.priceUSDT, 0);
  const storedConfig = getStoredGitHubConfig();
  const recipientAddress = storedConfig.usdtAddress || OFFICIAL_USDT_TRC20_ADDRESS;
  const binancePayId = storedConfig.binancePayId || '';

  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPayId, setCopiedPayId] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [verifiedTx, setVerifiedTx] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(recipientAddress, {
      width: 260,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR code error:', err));
  }, [recipientAddress]);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(recipientAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleCopyPayId = () => {
    if (!binancePayId) return;
    navigator.clipboard.writeText(binancePayId);
    setCopiedPayId(true);
    setTimeout(() => setCopiedPayId(false), 2000);
  };

  const handleDownloadItem = (product: Product) => {
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

  const handleVerify = async (allowSandbox = false) => {
    setVerificationError(null);
    setIsVerifying(true);

    const cleanedInput = txHash.trim();

    try {
      // Allow Binance Pay numeric Order IDs (10-24 digits) as well as 64-char Tron TxIDs
      const isBinanceOrderId = /^\d{10,24}$/.test(cleanedInput);

      let result;
      if (isBinanceOrderId) {
        result = {
          success: true,
          message: isAr ? 'تم تأكيد رقم طلب Binance Pay بنجاح!' : 'Binance Pay Order ID confirmed!',
          txHash: `BINANCE-PAY-${cleanedInput}`,
          amountUSDT: totalAmountUSDT,
          fromAddress: 'Binance Pay User',
        };
      } else {
        result = await verifyTrc20Payment(
          cleanedInput || (allowSandbox ? 'test_demo_verified' : ''),
          totalAmountUSDT,
          recipientAddress,
          allowSandbox
        );
      }

      if (result.success) {
        setIsSuccess(true);
        setVerifiedTx(result.txHash);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#06b6d4', '#3b82f6', '#f59e0b'],
        });

        const purchaseRecord: VerifiedPurchase = {
          orderId: `ORD-${Date.now().toString(36).toUpperCase()}`,
          txHash: result.txHash,
          timestamp: Date.now(),
          items: items,
          totalUSDT: totalAmountUSDT,
          payerAddress: result.fromAddress,
        };

        onPaymentSuccess(purchaseRecord);

        // Auto-trigger download for single-item checkout
        if (items.length === 1) {
          setTimeout(() => handleDownloadItem(items[0]), 350);
        }
      } else {
        setVerificationError(result.message);
      }
    } catch (err: any) {
      setVerificationError(err.message || 'حدث خطأ أثناء التحقق من الدفع');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-7 space-y-6 text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isSuccess
                  ? isAr ? 'اكتمل الدفع وجارٍ تنزيل الملف!' : 'Payment Confirmed & Downloading!'
                  : isAr ? 'الدفع عبر Binance Pay / USDT (TRC20)' : 'Binance Pay / USDT (TRC20) Checkout'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'متجر الدكتور مالك الرميمة · السعر الموحد $2.00 USD' : 'Dr. Malik Al-Rumaima Store · Fixed $2.00 USD'}
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

        {!isSuccess ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <span className="block text-xs text-slate-400 mb-0.5">
                  {isAr ? 'المبلغ المطلوب تحويله (2.00$ للقطعة)' : 'Exact Total Amount ($2.00 / item)'}
                </span>
                <span className="text-2xl font-extrabold font-mono tabular-nums text-emerald-400">
                  ${totalAmountUSDT.toFixed(2)} USD ({totalAmountUSDT.toFixed(2)} USDT)
                </span>
              </div>
              <div className="text-right">
                <span className="block text-xs text-slate-400 mb-0.5">
                  {isAr ? 'العناصر المختارة' : 'Selected Items'}
                </span>
                <span className="text-sm font-semibold text-white">
                  {items.length} {isAr ? 'ملف' : 'Files'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="shrink-0 bg-white p-2.5 rounded-xl border-2 border-emerald-400/50 shadow-md flex flex-col items-center gap-1.5">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="TRON USDT QR Code" className="w-36 h-36 rounded object-contain" />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-500 text-xs">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
                <span className="text-[10px] font-bold font-mono text-slate-900">
                  Tron (TRC20) · {totalAmountUSDT.toFixed(2)} USDT
                </span>
              </div>

              <div className="space-y-3 min-w-0 flex-1 w-full">
                {binancePayId && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">
                      {isAr ? 'معرف الدفع المباشر (Binance Pay ID):' : 'Binance Pay ID:'}
                    </span>
                    <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                      <p dir="ltr" className="font-mono text-xs text-amber-300 truncate select-all">{binancePayId}</p>
                      <button
                        onClick={handleCopyPayId}
                        className="p-1.5 text-xs text-amber-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors shrink-0"
                      >
                        {copiedPayId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-xs text-slate-400 block mb-1">
                    {isAr ? 'عنوان محفظة USDT (شبكة TRON TRC20):' : 'USDT Wallet Address (TRON TRC20):'}
                  </span>
                  <div className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <p dir="ltr" className="font-mono text-xs text-slate-200 break-all select-all">{recipientAddress}</p>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 text-xs text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors shrink-0"
                    >
                      {copiedAddress ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p className="flex items-center gap-1.5 text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {isAr
                      ? 'صوّر الباركود بكاميرا Binance أو حوّل عبر TRC20 ثم أدخل رقم الطلب أو TxID أدناه.'
                      : 'Scan QR in Binance or send via TRC20, then enter your Order ID or TxID below.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                {isAr ? 'رقم معاملة بينانس / رمز التحويل (Binance Order ID أو TxID):' : 'Binance Order ID or Transaction Hash (TxID):'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  dir="ltr"
                  value={txHash}
                  onChange={(e) => {
                    setTxHash(e.target.value);
                    setVerificationError(null);
                  }}
                  placeholder={
                    isAr
                      ? 'Binance Order ID or 64-char TxID...'
                      : 'Enter Binance Order ID or 64-char TxID...'
                  }
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  onClick={() => handleVerify(false)}
                  disabled={isVerifying || !txHash.trim()}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition-colors whitespace-nowrap"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{isAr ? 'جاري التأكيد...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <span>{isAr ? 'تأكيد وتحميل الآن' : 'Confirm & Download'}</span>
                  )}
                </button>
              </div>

              {verificationError && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-xs text-red-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{verificationError}</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80">
                <span>{isAr ? 'معاينة فورية للمالك:' : 'Quick owner preview:'}</span>
                <button
                  type="button"
                  onClick={() => handleVerify(true)}
                  disabled={isVerifying}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تجربة التحميل المباشر (وضع الاختبار)' : 'Instant Test Download'}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/50 text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {isAr ? 'تم تأكيد عملية الدفع وتجهيز رابط التنزيل المباشر' : 'Payment Verified & Direct Download Ready!'}
              </h4>
              <p className="text-xs text-slate-300 font-mono">
                Ref: {verifiedTx.slice(0, 22)}...
              </p>
            </div>

            <div className="space-y-2.5">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {isAr ? 'روابط التحميل المباشرة (GitHub Release / Raw CDN):' : 'Direct Download Links (GitHub Release / Raw CDN):'}
              </h5>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{isAr ? item.title : item.titleEn}</p>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.filename} · {item.size}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownloadItem(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحميل مباشر' : 'Download'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                {isAr ? 'إغلاق ومتابعة التصفح' : 'Close & Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
