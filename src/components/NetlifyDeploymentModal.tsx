import React, { useState } from 'react';
import { X, Cloud, Check, Copy, ExternalLink, Globe, Sparkles, Terminal, FileCode } from 'lucide-react';

interface NetlifyDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const NetlifyDeploymentModal: React.FC<NetlifyDeploymentModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';
  const [copiedToml, setCopiedToml] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const netlifyTomlContent = `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"`;

  const handleCopyToml = () => {
    navigator.clipboard.writeText(netlifyTomlContent);
    setCopiedToml(true);
    setTimeout(() => setCopiedToml(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard.writeText('npm run build');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'دليل نشر المتجر على Netlify Drop (بث مباشر 24/7)' : 'Netlify Drop 24/7 Live Broadcast Guide'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'خطوات رفع المتجر وتشغيله عالمياً ومجانياً على شبكة Netlify CDN' : 'Zero-cost continuous global hosting with SSL on Netlify CDN'}
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

        {/* Method 1: Netlify Drop (Instant Drag & Drop) */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              {isAr ? 'الطريقة 1: النشر المباشر عبر Netlify Drop (سحب وإفلات في 30 ثانية)' : 'Method 1: Netlify Drop (Drag & Drop in 30 Seconds)'}
            </span>
            <a
              href="https://app.netlify.com/drop"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
            >
              <span>{isAr ? 'فتح Netlify Drop' : 'Open Netlify Drop'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>
              <span>{isAr ? 'قم ببناء مجلد الإنتاج التوزيعي عبر الأمر:' : 'Build the distribution folder via:'}</span>
              <div className="mt-1 flex items-center justify-between bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400">
                <span>npm run build</span>
                <button onClick={handleCopyCmd} className="text-slate-400 hover:text-white">
                  {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </li>
            <li>
              {isAr
                ? 'سينتج مجلد باسم dist يحتوي على ملفات المتجر المجمعة والمحسنة بالكامل.'
                : 'This generates an optimized production folder named dist.'}
            </li>
            <li>
              {isAr
                ? 'توجه إلى رابط app.netlify.com/drop واسحب مجلد dist وأفلته في المستطيل المخصص.'
                : 'Go to app.netlify.com/drop and drag & drop the dist folder into the upload box.'}
            </li>
            <li>
              {isAr
                ? 'سيتم توليد رابط مباشر فوري (مثال: https://drmalik-store.netlify.app) يعمل 24 ساعة يومياً!'
                : 'Netlify gives you an instant 24/7 live HTTPS URL (e.g., https://drmalik-store.netlify.app).'}
            </li>
          </ol>
        </div>

        {/* Method 2: GitHub Repository CI/CD on Netlify */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
          <span className="font-bold text-white block">
            {isAr ? 'الطريقة 2: الربط المباشر مع مستودع GitHub (تحديث تلقائي مستمر)' : 'Method 2: Connect GitHub Repository (Auto-Deploy)'}
          </span>
          <p className="text-slate-400 leading-relaxed">
            {isAr
              ? 'في حسابك على Netlify، اضغط "Add new site" ثم "Import an existing project" واختر مستودعك. اضبط الإعدادات التالية:'
              : 'In your Netlify account, select "Import an existing project" and connect your repo with these settings:'}
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-1">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Build Command:</span>
              <span className="text-emerald-400">npm run build</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Publish Directory:</span>
              <span className="text-emerald-400">dist</span>
            </div>
          </div>
        </div>

        {/* Config File netlify.toml */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>netlify.toml (جاهز ومضمن في مشروعك)</span>
            </span>
            <button
              onClick={handleCopyToml}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              {copiedToml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToml ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ الملف' : 'Copy TOML')}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto">
            {netlifyTomlContent}
          </pre>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            {isAr ? 'فهمت، إغلاق الدليل' : 'Got it, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
