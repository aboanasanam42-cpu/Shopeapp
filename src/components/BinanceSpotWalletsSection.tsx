import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, QrCode, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  BINANCE_SPOT_NETWORKS,
  OFFICIAL_USDT_TRC20_ADDRESS,
  OFFICIAL_USDT_EVM_ADDRESS,
  OFFICIAL_USDT_SOL_ADDRESS,
} from '../data/products';

interface BinanceSpotWalletsSectionProps {
  lang: 'ar' | 'en';
}

interface WalletGroupCard {
  id: 'trc20' | 'evm' | 'sol';
  titleAr: string;
  titleEn: string;
  networksLabelAr: string;
  networksLabelEn: string;
  address: string;
  details: { label: string; contract: string; minDeposit: string }[];
  warningAr?: string;
  warningEn?: string;
}

const WALLET_GROUPS: WalletGroupCard[] = [
  {
    id: 'trc20',
    titleAr: 'شبكة ترون (Tron TRC20)',
    titleEn: 'Tron Network (TRC20)',
    networksLabelAr: 'الشبكة: Tron (TRC20) · TRX',
    networksLabelEn: 'Network: Tron (TRC20) · TRX',
    address: OFFICIAL_USDT_TRC20_ADDRESS,
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
    details: [
      { label: 'SOL', contract: '***nwNYB', minDeposit: '>0.001 USDT' },
    ],
    warningAr: 'عناوين SOL حساسة لحالة الأحرف (Case-Sensitive)',
    warningEn: 'SOL addresses are case-sensitive',
  },
];

export const BinanceSpotWalletsSection: React.FC<BinanceSpotWalletsSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [qrMap, setQrMap] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all(
      WALLET_GROUPS.map(async (group) => {
        const dataUrl = await QRCode.toDataURL(group.address, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        return [group.id, dataUrl] as const;
      })
    )
      .then((entries) => setQrMap(Object.fromEntries(entries)))
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
                  ? `المحفظة الفورية لمنصة Binance (${BINANCE_SPOT_NETWORKS.length} شبكات معتمدة)`
                  : `Official Binance Spot Wallet (${BINANCE_SPOT_NETWORKS.length} Networks)`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {isAr
                ? 'مربعات الباركود وعناوين الإيداع لجميع شبكات Binance USDT'
                : 'Binance Spot Wallet QR Codes & Deposit Addresses'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'اختر أو امسح الباركود المناسب لشبكتك المفضلة لإرسال 2.00 USDT إلى المحفظة الفورية مباشرة.'
                : 'Scan any QR code below with Binance or your crypto wallet to send 2.00 USDT via your preferred network.'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>$2.00 USD / 2.00 USDT</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WALLET_GROUPS.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isAr ? group.titleAr : group.titleEn}
                  </h3>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    {isAr ? group.networksLabelAr : group.networksLabelEn}
                  </p>
                </div>

                {/* High-Contrast QR Box */}
                <div className="flex justify-center">
                  <div className="bg-white p-3 rounded-xl border-2 border-emerald-400/50 shadow-lg flex flex-col items-center gap-1.5">
                    {qrMap[group.id] ? (
                      <img
                        src={qrMap[group.id]}
                        alt={`${group.titleEn} USDT QR Code`}
                        className="w-36 h-36 rounded object-contain"
                      />
                    ) : (
                      <div className="w-36 h-36 bg-slate-100 rounded" />
                    )}
                    <span className="text-[11px] font-bold font-mono text-slate-900">
                      USDT · {group.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Address & Copy */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-400">
                      {isAr ? 'عنوان الإيداع:' : 'Deposit Address:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(group.id, group.address)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      {copiedId === group.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedId === group.id ? (isAr ? 'تم النسخ' : 'Copied') : isAr ? 'نسخ' : 'Copy'}</span>
                    </button>
                  </div>
                  <p dir="ltr" className="font-mono text-xs text-slate-100 break-all select-all leading-relaxed">
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
                <p className="flex items-center gap-1.5 text-[11px] text-amber-300 bg-amber-950/30 border border-amber-800/40 px-2.5 py-1.5 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{isAr ? group.warningAr : group.warningEn}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
