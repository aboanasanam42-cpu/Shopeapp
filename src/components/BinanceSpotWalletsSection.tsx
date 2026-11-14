import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  BINANCE_SPOT_NETWORKS,
  OFFICIAL_USDT_TRC20_ADDRESS,
  OFFICIAL_USDT_EVM_ADDRESS,
  OFFICIAL_USDT_SOL_ADDRESS,
  OFFICIAL_ONECASH_WALLET_NUMBER,
  OFFICIAL_SHAMEL_WALLET_NUMBER,
  ONECASH_QR_SVG_DATA_URI,
  SHAMEL_QR_SVG_DATA_URI,
} from '../data/products';

interface BinanceSpotWalletsSectionProps {
  lang: 'ar' | 'en';
}

interface WalletGroupCard {
  id: 'shamel' | 'onecash' | 'trc20' | 'evm' | 'sol';
  titleAr: string;
  titleEn: string;
  networksLabelAr: string;
  networksLabelEn: string;
  address: string;
  badgeText: string;
  accent?: 'sky' | 'orange' | 'emerald';
  details: { label: string; contract: string; minDeposit: string }[];
  warningAr?: string;
  warningEn?: string;
}

const WALLET_GROUPS: WalletGroupCard[] = [
  {
    id: 'shamel',
    titleAr: 'محفظة الشامل موني (AlShamel)',
    titleEn: 'AlShamel Money Wallet',
    networksLabelAr: 'دفع محلي فوري عبر الشامل موني',
    networksLabelEn: 'Instant AlShamel Money Payment',
    address: OFFICIAL_SHAMEL_WALLET_NUMBER,
    badgeText: 'AlShamel · 771134103',
    accent: 'sky',
    details: [
      { label: 'رقم محفظة الشامل موني', contract: '771134103', minDeposit: '$2.00 / ما يعادلها' },
    ],
    warningAr: 'امسح باركود الشامل موني أو حوّل إلى الرقم 771134103 مباشرة.',
    warningEn: 'Scan AlShamel Money QR or transfer directly to 771134103.',
  },
  {
    id: 'onecash',
    titleAr: 'محفظة ون كاش (OneCash)',
    titleEn: 'OneCash Wallet (Yemen)',
    networksLabelAr: 'دفع محلي فوري عبر ون كاش',
    networksLabelEn: 'Instant OneCash Local Payment',
    address: OFFICIAL_ONECASH_WALLET_NUMBER,
    badgeText: 'OneCash · 146158879',
    accent: 'orange',
    details: [
      { label: 'رقم المحفظة / الحساب', contract: '146158879', minDeposit: '$2.00 / ما يعادلها' },
    ],
    warningAr: 'بإمكان مشتركي ون كاش مسح هذا الرمز لإرسال النقود إليك مباشرة.',
    warningEn: 'OneCash subscribers can scan this QR code or transfer to 146158879.',
  },
  {
    id: 'trc20',
    titleAr: 'شبكة ترون (Tron TRC20)',
    titleEn: 'Tron Network (TRC20)',
    networksLabelAr: 'الشبكة: Tron (TRC20) · TRX',
    networksLabelEn: 'Network: Tron (TRC20) · TRX',
    address: OFFICIAL_USDT_TRC20_ADDRESS,
    badgeText: 'USDT · TRC20',
    details: [
      { label: 'TRC20', contract: '***jLj6t', minDeposit: '>0.01 USDT' },
    ],
  },
  {
    id: 'evm',
    titleAr: 'شبكات EVM (BSC · ETH · Polygon · Plasma)',
    titleEn: 'EVM Networks (BSC · ETH · Polygon · Plasma)',
    networksLabelAr: 'عنوان موحّد لـ 4 شبكات فورية',
    networksLabelEn: 'Unified address for 4 Binance networks',
    address: OFFICIAL_USDT_EVM_ADDRESS,
    badgeText: 'USDT · EVM (4 Networks)',
    details: [
      { label: 'BSC (BEP20)', contract: '***97955', minDeposit: '>0.01 USDT' },
      { label: 'ETH (ERC20)', contract: '***31ec7', minDeposit: '>0.001 USDT' },
      { label: 'Polygon (POL)', contract: '***58e8f', minDeposit: '>0.02 USDT' },
      { label: 'Plasma', contract: '***25ebb', minDeposit: '>0.000001 USDT' },
    ],
  },
  {
    id: 'sol',
    titleAr: 'شبكة سولانا (Solana SOL)',
    titleEn: 'Solana Network (SOL)',
    networksLabelAr: 'الشبكة: Solana · SOL',
    networksLabelEn: 'Network: Solana · SOL',
    address: OFFICIAL_USDT_SOL_ADDRESS,
    badgeText: 'USDT · SOL',
    details: [
      { label: 'SOL', contract: '***nwNYB', minDeposit: '>0.001 USDT' },
    ],
    warningAr: 'عناوين SOL حساسة لحالة الأحرف (Case-Sensitive)',
    warningEn: 'SOL addresses are case-sensitive',
  },
];

export const BinanceSpotWalletsSection: React.FC<BinanceSpotWalletsSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [qrMap, setQrMap] = useState<Record<string, string>>({
    shamel: SHAMEL_QR_SVG_DATA_URI,
    onecash: ONECASH_QR_SVG_DATA_URI,
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const cryptoGroups = WALLET_GROUPS.filter((g) => g.id !== 'onecash' && g.id !== 'shamel');
    Promise.all(
      cryptoGroups.map(async (group) => {
        const dataUrl = await QRCode.toDataURL(group.address, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        return [group.id, dataUrl] as const;
      })
    )
      .then((entries) =>
        setQrMap({
          shamel: SHAMEL_QR_SVG_DATA_URI,
          onecash: ONECASH_QR_SVG_DATA_URI,
          ...Object.fromEntries(entries),
        })
      )
      .catch((err) => console.error('Spot wallets QR generation error:', err));
  }, []);

  const handleCopy = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="binance-spot-wallets" className="border-t border-slate-800 bg-slate-950/90 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <QrCode className="w-4 h-4" />
              <span>
                {isAr
                  ? `بوابات الدفع المعتمدة (${BINANCE_SPOT_NETWORKS.length} خيارات: الشامل موني + ون كاش + Binance الفورية)`
                  : `Official Payment Gateways (${BINANCE_SPOT_NETWORKS.length} Methods: AlShamel + OneCash + Binance Spot)`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr
                ? 'مربعات الباركود وأرقام الحسابات: الشامل موني وون كاش و Binance USDT'
                : 'Payment QR Codes & Wallets: AlShamel Money, OneCash & Binance Spot'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'امسح باركود الشامل موني (771134103) أو ون كاش (146158879) أو أي باركود من شبكات Binance الفورية لإتمام الدفع فوراً.'
                : 'Scan the AlShamel Money QR (771134103), OneCash QR (146158879), or any Binance Spot network QR below.'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>$2.00 USD / 2.00 USDT</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {WALLET_GROUPS.map((group) => {
            const isOrange = group.accent === 'orange';
            const isSky = group.accent === 'sky';
            return (
              <div
                key={group.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between space-y-4 transition-colors ${
                  isSky
                    ? 'border-sky-500/40 bg-slate-900/95 hover:border-sky-400/70'
                    : isOrange
                      ? 'border-orange-500/40 bg-slate-900/95 hover:border-orange-400/70'
                      : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {isAr ? group.titleAr : group.titleEn}
                    </h3>
                    <p
                      className={`text-xs font-medium mt-0.5 ${
                        isSky ? 'text-sky-400' : isOrange ? 'text-orange-400' : 'text-emerald-400'
                      }`}
                    >
                      {isAr ? group.networksLabelAr : group.networksLabelEn}
                    </p>
                  </div>

                  {/* High-Contrast QR Box */}
                  <div className="flex justify-center">
                    <div
                      className={`bg-white p-3 rounded-xl border-2 shadow-lg flex flex-col items-center gap-1.5 ${
                        isSky
                          ? 'border-sky-400/60'
                          : isOrange
                            ? 'border-orange-400/60'
                            : 'border-emerald-400/50'
                      }`}
                    >
                      {qrMap[group.id] ? (
                        <img
                          src={qrMap[group.id]}
                          alt={`${group.titleEn} QR Code`}
                          className="w-36 h-36 rounded object-contain"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-slate-100 rounded" />
                      )}
                      <span className="text-[11px] font-bold font-mono text-slate-900">
                        {group.badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Address / Wallet Number & Copy */}
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        {group.id === 'shamel'
                          ? isAr ? 'رقم الشامل موني:' : 'AlShamel Number:'
                          : group.id === 'onecash'
                            ? isAr ? 'رقم محفظة ون كاش:' : 'OneCash Wallet Number:'
                            : isAr ? 'عنوان الإيداع:' : 'Deposit Address:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(group.id, group.address)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 rounded transition-colors ${
                          isSky
                            ? 'text-sky-300 hover:text-white'
                            : isOrange
                              ? 'text-orange-300 hover:text-white'
                              : 'text-emerald-300 hover:text-white'
                        }`}
                      >
                        {copiedId === group.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === group.id ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ' : 'Copy'}</span>
                      </button>
                    </div>
                    <p
                      dir="ltr"
                      className={`font-mono break-all select-all leading-relaxed ${
                        group.id === 'shamel'
                          ? 'text-base font-bold text-sky-300'
                          : group.id === 'onecash'
                            ? 'text-base font-bold text-orange-300'
                            : 'text-xs text-slate-100'
                      }`}
                    >
                      {group.address}
                    </p>
                  </div>

                  {/* Network Contracts & Minimums */}
                  <div className="space-y-1.5 text-xs">
                    {group.details.map((d) => (
                      <div
                        key={d.label}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800/80"
                      >
                        <span className="font-semibold text-slate-200">{d.label}</span>
                        <span dir="ltr" className="font-mono text-[11px] text-slate-400">
                          {d.contract} · {d.minDeposit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {(group.warningAr || group.warningEn) && (
                  <p
                    className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-lg border ${
                      isSky
                        ? 'text-sky-200 bg-sky-950/30 border-sky-800/40'
                        : isOrange
                          ? 'text-orange-200 bg-orange-950/30 border-orange-800/40'
                          : 'text-amber-300 bg-amber-950/30 border-amber-800/40'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{isAr ? group.warningAr : group.warningEn}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
