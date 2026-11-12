import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, ShieldCheck, Zap, Terminal, RefreshCw, ExternalLink } from 'lucide-react';
import { BINANCE_SPOT_NETWORKS, LIVE_NETLIFY_URL } from '../data/products';
import { BinanceNetworkId } from '../types';

interface HeroProps {
  lang: 'ar' | 'en';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  totalProductsCount: number;
  releaseAssetsCount: number;
  isLiveSynced: boolean;
  isSyncing: boolean;
  onRefreshSync: () => void;
  onOpenGitHubModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  totalProductsCount,
  releaseAssetsCount,
  isLiveSynced,
  isSyncing,
  onRefreshSync,
  onOpenGitHubModal,
}) => {
  const isAr = lang === 'ar';
  const [selectedNetId, setSelectedNetId] = useState<BinanceNetworkId>('TRC20');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const activeNet =
    BINANCE_SPOT_NETWORKS.find((n) => n.id === selectedNetId) || BINANCE_SPOT_NETWORKS[0];

  useEffect(() => {
    QRCode.toDataURL(activeNet.address, {
      width: 220,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('Hero QR code error:', err));
  }, [activeNet.address]);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeNet.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-12 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.06),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400 tracking-wider">
                <span>{isAr ? 'متجر الدكتور مالك الرميمة' : 'DR. MALIK AL-RUMAIMA STORE'}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>aboanasanam42-cpu/Shopeapp</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span>{isLiveSynced ? (isAr ? 'مزامنة مباشرة مع GitHub API' : 'Live GitHub Synced') : 'Release v1.0.0'}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight text-balance">
                {isAr
                  ? 'متجر الدكتور مالك الرميمة للتطبيقات والأكواد والمؤلفات'
                  : 'Dr. Malik Al-Rumaima Digital Apps, Bots & Literature Store'}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {isAr
                  ? `عرض مباشر وتلقائي لكافة ملفات مستودع Shopeapp (${totalProductsCount} تطبيقاً وحزمة برمجية وكتاباً علمياً). تسعير موحد 2.00 دولار (2 USDT عبر Binance Spot) عبر جميع الشبكات مع تحميل فوري.`
                  : `Live-synchronized catalog of ${totalProductsCount} Android APKs, medical systems, MEXC trading bots, and Dr. Malik publications from Shopeapp. Uniform $2.00 USD price via Binance Spot Wallet across all 6 networks.`}
              </p>
            </div>

            {/* Official Binance Spot Multi-Network Gateway Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 sm:p-5 shadow-lg shadow-black/40 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {isAr ? 'المحفظة الفورية Binance · الدفع عبر 6 شبكات USDT' : 'Binance Spot Wallet · 6 USDT Networks'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {isAr ? 'اختر الشبكة ثم امسح الباركود أو انسخ العنوان · $2.00 للملف' : 'Select network, scan QR or copy address · $2.00/file'}
                    </p>
                  </div>
                </div>

                <a
                  href="#binance-spot-wallets"
                  className="text-xs font-mono tabular-nums text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded self-start sm:self-center hover:border-emerald-500 transition-colors"
                >
                  {isAr ? 'عرض جميع الباركودات' : 'All QR Boxes'}
                </a>
              </div>

              {/* 6-Network Selector Tabs */}
              <div className="flex flex-wrap gap-1.5">
                {BINANCE_SPOT_NETWORKS.map((net) => {
                  const isActive = net.id === activeNet.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedNetId(net.id)}
                      className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/60'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {net.shortCode} · {net.id === 'TRC20' ? 'TRC20' : net.id === 'BSC' ? 'BEP20' : net.id === 'ETH' ? 'ERC20' : net.id}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {qrCodeUrl && (
                  <div className="bg-white p-2 rounded-xl border-2 border-emerald-400/50 shadow-md shrink-0 flex flex-col items-center gap-1">
                    <img
                      src={qrCodeUrl}
                      alt={`${activeNet.labelEn} USDT QR Code`}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded object-contain"
                    />
                    <span className="text-[10px] font-bold font-mono text-slate-900">USDT · {activeNet.shortCode}</span>
                  </div>
                )}

                <div className="flex-1 w-full min-w-0 space-y-2">
                  <div className="flex items-center justify-between gap-2 bg-slate-950 px-3.5 py-2.5 rounded-lg border border-slate-800">
                    <div className="min-w-0 flex-1">
                      <span className="block text-[11px] text-slate-400 mb-0.5">
                        {isAr ? `عنوان إيداع ${activeNet.labelAr}` : `${activeNet.labelEn} Deposit Address`}
                      </span>
                      <p dir="ltr" className="font-mono text-xs sm:text-sm text-slate-100 break-all select-all">
                        {activeNet.address}
                      </p>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1">
                    <span>
                      {isAr ? 'العقد:' : 'Contract:'} <strong dir="ltr" className="font-mono text-slate-200">{activeNet.contractSuffix}</strong>
                    </span>
                    <span>
                      {isAr ? 'الحد الأدنى:' : 'Min:'} <strong dir="ltr" className="font-mono text-emerald-400">{activeNet.minDeposit}</strong>
                    </span>
                    <span>
                      {isAr ? 'التأكيد:' : 'Conf:'} <strong className="text-slate-200">{activeNet.confirmations}</strong>
                    </span>
                  </div>
                  {(activeNet.noteAr || activeNet.noteEn) && (
                    <p className="text-[11px] text-amber-300 px-1">
                      {isAr ? activeNet.noteAr : activeNet.noteEn}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  {isAr ? 'أدخل Binance Order ID أو TxID ليبدأ التنزيل فوراً' : 'Enter Binance Order ID / TxID for instant download'}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onRefreshSync}
                    disabled={isSyncing}
                    className="text-cyan-400 hover:text-cyan-300 text-xs inline-flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isAr ? 'تحديث من GitHub' : 'Sync GitHub'}</span>
                  </button>
                  <button
                    onClick={onOpenGitHubModal}
                    className="text-emerald-400 hover:text-emerald-300 text-xs inline-flex items-center gap-1 font-medium"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إدارة المستودع' : 'Repo Tools'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isAr
                    ? `ابحث في ${totalProductsCount} ملفاً: عيادة الرحمن، MEXC، الهندسي، كتب الدكتور مالك...`
                    : `Search ${totalProductsCount} files: Clinic, MEXC, Engineering, Books...`
                }
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3.5 text-sm text-white placeholder-slate-500 shadow-inner focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl h-full min-h-[340px] flex flex-col">
              <img
                src="/src/assets/images/marketplace_hero_banner_1794500203955.jpg"
                alt="متجر الدكتور مالك الرميمة للبرمجيات والتطبيقات"
                className="w-full h-56 sm:h-64 object-cover"
                loading="eager"
              />
              <div className="p-5 flex-1 flex flex-col justify-between bg-slate-900/95 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-base font-bold text-white">
                      {isAr ? 'مستودع Shopeapp وإصدار v1.0.0' : 'Shopeapp Repo & Release v1.0.0'}
                    </h4>
                    <a
                      href={LIVE_NETLIFY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      <span>Netlify Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr
                      ? 'متزامن مباشرة مع الفرع الرئيسي main في GitHub لتحديث كافة ملفات APK و ZIP و PDF تلقائياً مع دعم Google SEO.'
                      : 'Directly synchronized with GitHub main branch & releases/latest for real-time APK, ZIP, and PDF updates with Google SEO.'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="block text-slate-400 text-[11px]">{isAr ? 'الملفات المتزامنة' : 'Synced Files'}</span>
                    <span className="font-bold text-white text-sm tabular-nums">{totalProductsCount} {isAr ? 'ملف' : 'Files'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">{isAr ? 'السعر الموحد' : 'Fixed Price'}</span>
                    <span className="font-bold text-emerald-400 text-sm tabular-nums">$2.00 USD</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">{isAr ? 'ملفات Release v1.0.0' : 'Release Assets'}</span>
                    <span className="font-bold text-white text-sm tabular-nums">{releaseAssetsCount} {isAr ? 'مرفوع' : 'Hosted'}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px]">{isAr ? 'استضافة 24/7' : 'Live Hosting'}</span>
                    <span className="font-bold text-cyan-400 text-sm">Netlify Drop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
