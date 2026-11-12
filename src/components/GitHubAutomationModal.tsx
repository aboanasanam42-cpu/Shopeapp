import React, { useState, useEffect } from 'react';
import { X, Github, Check, Loader2, Copy, ExternalLink, RefreshCw, Key, Box, Wallet } from 'lucide-react';
import {
  getStoredGitHubConfig,
  saveGitHubConfig,
  fetchGitHubRelease,
  createGitHubRelease,
  generateGitHubActionsWorkflow,
  GitHubReleaseStatus,
  resolveProductDownloadUrl,
} from '../services/githubService';
import { Product } from '../types';
import { OFFICIAL_USDT_TRC20_ADDRESS } from '../data/products';

interface GitHubAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  products: Product[];
  onRefreshCatalog: () => void;
}

export const GitHubAutomationModal: React.FC<GitHubAutomationModalProps> = ({
  isOpen,
  onClose,
  lang,
  products,
  onRefreshCatalog,
}) => {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [tag, setTag] = useState('v1.0.0');
  const [token, setToken] = useState('');
  const [binancePayId, setBinancePayId] = useState('');
  const [usdtAddress, setUsdtAddress] = useState(OFFICIAL_USDT_TRC20_ADDRESS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [isChecking, setIsChecking] = useState(false);
  const [releaseStatus, setReleaseStatus] = useState<GitHubReleaseStatus | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isCreatingRelease, setIsCreatingRelease] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'workflow' | 'urls'>('config');

  useEffect(() => {
    const config = getStoredGitHubConfig();
    setOwner(config.owner);
    setRepo(config.repo);
    setTag(config.tag || 'v1.0.0');
    setToken(config.token || '');
    setBinancePayId(config.binancePayId || '');
    setUsdtAddress(config.usdtAddress || OFFICIAL_USDT_TRC20_ADDRESS);
    checkRelease(config.owner, config.repo, config.tag, config.token);
  }, []);

  const checkRelease = async (o: string, r: string, t: string, tok?: string) => {
    if (!o || !r) return;
    setIsChecking(true);
    setStatusMessage(null);
    try {
      const status = await fetchGitHubRelease(o, r, t, tok);
      setReleaseStatus(status);
    } catch (e: any) {
      setStatusMessage(e.message);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSaveConfig = () => {
    saveGitHubConfig({ owner, repo, tag, token, binancePayId, usdtAddress });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    checkRelease(owner, repo, tag, token);
    onRefreshCatalog();
  };

  const handleCreateRelease = async () => {
    if (!token) {
      setStatusMessage(isAr ? 'يرجى إدخال GitHub Personal Access Token لإنشاء الإصدار تلقائياً' : 'Please provide a GitHub Personal Access Token');
      return;
    }
    setIsCreatingRelease(true);
    setStatusMessage(null);
    try {
      await createGitHubRelease(owner, repo, tag, token);
      setStatusMessage(isAr ? `تم إنشاء الإصدار ${tag} بنجاح على مستودع ${owner}/${repo}!` : `Release ${tag} created successfully!`);
      await checkRelease(owner, repo, tag, token);
      onRefreshCatalog();
    } catch (e: any) {
      setStatusMessage(e.message);
    } finally {
      setIsCreatingRelease(false);
    }
  };

  const handleCopyWorkflow = () => {
    const content = generateGitHubActionsWorkflow();
    navigator.clipboard.writeText(content);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-100 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {isAr ? 'إدارة مستودع Shopeapp وإصدار v1.0.0 وبوابة Binance' : 'Shopeapp Repo, Release v1.0.0 & Binance Config'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'ربط مباشر مع aboanasanam42-cpu/Shopeapp ومزامنة الروابط التلقائية' : 'Live sync with aboanasanam42-cpu/Shopeapp & Release CDN'}
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

        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'config' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'إعدادات المستودع وبينانس' : 'Repo & Binance Setup'}
          </button>
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'workflow' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? 'ملف أتمتة GitHub Actions' : 'GitHub Actions Workflow'}
          </button>
          <button
            onClick={() => setActiveTab('urls')}
            className={`flex-1 py-2 px-3 rounded-lg transition-all text-center ${
              activeTab === 'urls' ? 'bg-slate-800 text-emerald-400 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isAr ? `روابط التحميل (${products.length})` : `Download URLs (${products.length})`}
          </button>
        </div>

        {activeTab === 'config' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isAr ? 'المستخدم (Owner)' : 'GitHub Owner'}
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isAr ? 'المستودع (Repo)' : 'Repository'}
                </label>
                <input
                  type="text"
                  value={repo}
                  onChange={(e) => setRepo(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isAr ? 'وسم الإصدار (Tag)' : 'Release Tag'}
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1">
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'معرف Binance Pay ID (اختياري)' : 'Binance Pay ID (Optional)'}</span>
                </label>
                <input
                  type="text"
                  value={binancePayId}
                  onChange={(e) => setBinancePayId(e.target.value)}
                  placeholder="مثال: 123456789"
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-1">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'عنوان محفظة USDT (TRC20)' : 'USDT TRC20 Wallet'}</span>
                </label>
                <input
                  type="text"
                  value={usdtAddress}
                  onChange={(e) => setUsdtAddress(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  {isAr ? 'رمز الوصول الشخصي (GitHub PAT - للمتصفح فقط، اختياري):' : 'GitHub PAT (Browser-local only, Optional):'}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isAr ? 'مُؤمّن أيضاً عبر GitHub Actions Secret' : 'Also automated via GitHub Actions Secret'}
                </span>
              </label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_..."
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Box className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'حالة الإصدار الحالي على GitHub:' : 'Current GitHub Release Status:'}
                </span>
                <button
                  onClick={() => checkRelease(owner, repo, tag, token)}
                  disabled={isChecking}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                  <span>{isAr ? 'فحص' : 'Check'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-300 space-y-1">
                <p>
                  <span className="text-slate-500">{isAr ? 'المستودع:' : 'Repo:'}</span>{' '}
                  <span className="font-mono text-emerald-400">{owner}/{repo}</span>
                </p>
                {releaseStatus && (
                  <p>
                    <span className="text-slate-500">{isAr ? 'الحالة:' : 'Status:'}</span>{' '}
                    <span className="font-mono text-cyan-400">
                      {releaseStatus.exists
                        ? `${releaseStatus.tagName} (${releaseStatus.assetsCount} assets)`
                        : isAr ? 'لم يتم إنشاء Release v1.0.0 بعد — يستخدم حالياً روابط Raw المباشرة' : 'No Release yet — seamless Raw CDN active'}
                    </span>
                  </p>
                )}
              </div>

              {statusMessage && <p className="text-xs text-emerald-400 pt-1 font-medium">{statusMessage}</p>}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleSaveConfig}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : null}
                <span>{savedSuccess ? (isAr ? 'تم الحفظ والمزامنة' : 'Saved & Synced!') : (isAr ? 'حفظ ومزامنة المتجر' : 'Save & Sync Store')}</span>
              </button>

              <button
                onClick={handleCreateRelease}
                disabled={isCreatingRelease || !token}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded-lg transition-colors border border-slate-700"
              >
                {isCreatingRelease ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>{isAr ? 'إنشاء Release v1.0.0 عبر التوكن' : 'Create Release v1.0.0'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-white">
                {isAr
                  ? 'أتمتة نشر كافة ملفات الشعبة main إلى Release v1.0.0 باستخدام GitHub Secret:'
                  : 'Automated Release v1.0.0 Publishing via GitHub Actions Secret:'}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {isAr
                  ? 'يقرأ سير العمل هذا التوكن تلقائياً من الأسرار (PAT_TOKEN أو GITHUB_TOKEN المدمج) ويقوم بفحص جميع ملفات .apk و .zip و .pdf في مستودع Shopeapp وإنشاء الإصدار v1.0.0 ورفع جميع الملفات عليه.'
                  : 'Reads your repository secret automatically, scans all .apk, .zip, and .pdf files in Shopeapp, creates Release v1.0.0, and attaches every file as a Release CDN asset.'}
              </p>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between p-2.5 bg-slate-950 rounded-t-xl border border-b-0 border-slate-800 text-xs">
                <span className="font-mono text-slate-400">.github/workflows/release.yml</span>
                <button
                  onClick={handleCopyWorkflow}
                  className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  {copiedWorkflow ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWorkflow ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ YAML' : 'Copy YAML')}</span>
                </button>
              </div>
              <pre className="p-4 rounded-b-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56" dir="ltr">
                {generateGitHubActionsWorkflow()}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'urls' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{isAr ? 'الروابط النشطة حالياً (Release CDN مع Fallback إلى Raw):' : 'Active Download Endpoints (Release CDN + Raw Fallback):'}</span>
              <span className="font-mono tabular-nums text-emerald-400 font-bold">{products.length}</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {products.map((p) => {
                const url = resolveProductDownloadUrl(p);
                return (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-bold text-white block truncate">{p.title}</span>
                      <span className="font-mono text-[11px] text-slate-400 truncate block select-all" dir="ltr">
                        {url}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => navigator.clipboard.writeText(url)}
                        className="px-2 py-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 rounded"
                      >
                        {isAr ? 'نسخ' : 'Copy'}
                      </button>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-emerald-400"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
