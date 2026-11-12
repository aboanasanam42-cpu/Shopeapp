import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { OFFICIAL_USDT_TRC20_ADDRESS, LIVE_NETLIFY_URL } from '../data/products';

interface FooterProps {
  lang: 'ar' | 'en';
  onOpenGitHubModal: () => void;
  onOpenNetlifyModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onOpenGitHubModal,
  onOpenNetlifyModal,
}) => {
  const isAr = lang === 'ar';

  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-base font-bold text-white">
              {isAr ? 'متجر الدكتور مالك الرميمة' : 'Dr. Malik Al-Rumaima Store'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {isAr
                ? 'المنصة الرقمية الرسمية لبيع وتوزيع تطبيقات الأندرويد، المنظومات الطبية، بوتات التداول، ومؤلفات الدكتور مالك الرميمة العلمية بسعر موحد 2.00$ عبر Binance مع مزامنة فورية مع مستودع Shopeapp.'
                : 'Official digital store for Android apps, clinic systems, MEXC trading bots, and Dr. Malik Al-Rumaima academic books at a uniform $2.00 USD price via Binance.'}
            </p>
            <div className="pt-2 text-xs text-slate-500 font-mono space-y-1">
              <div>
                <span>{isAr ? 'الرابط الرسمي: ' : 'Live Store: '}</span>
                <a href={LIVE_NETLIFY_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                  {LIVE_NETLIFY_URL}
                </a>
              </div>
              <div>
                <span>{isAr ? 'محفظة TRC20: ' : 'TRC20 Wallet: '}</span>
                <span className="text-slate-300">{OFFICIAL_USDT_TRC20_ADDRESS}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isAr ? 'أقسام المتجر' : 'Categories'}
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#catalog" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'البرمجيات الطبية والعيادات' : 'Medical & Clinic Software'}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'بوتات التداول (MEXC)' : 'Crypto Trading Bots'}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'تطبيقات الأندرويد وسطح المكتب' : 'Android & Desktop Utilities'}
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-emerald-400 transition-colors">
                  {isAr ? 'مؤلفات الدكتور مالك الرميمة' : 'Books & Literature'}
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {isAr ? 'المستودع والاستضافة' : 'Repository & Hosting'}
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={onOpenGitHubModal}
                  className="hover:text-emerald-400 transition-colors text-right"
                >
                  {isAr ? 'إعدادات Shopeapp و Release v1.0.0' : 'Shopeapp & Release v1.0.0'}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenNetlifyModal}
                  className="hover:text-cyan-400 transition-colors text-right"
                >
                  {isAr ? 'نشر Netlify Drop والفهرسة' : 'Netlify Drop & Google SEO'}
                </button>
              </li>
              <li>
                <a
                  href="https://github.com/aboanasanam42-cpu/Shopeapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-200 transition-colors inline-flex items-center gap-1"
                >
                  <span>GitHub: aboanasanam42-cpu/Shopeapp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {isAr ? 'متجر الدكتور مالك الرميمة. جميع الحقوق محفوظة.' : 'Dr. Malik Al-Rumaima Store. All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'دفع مؤمّن عبر Binance & TronGrid' : 'Verified via Binance & TronGrid'}</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
