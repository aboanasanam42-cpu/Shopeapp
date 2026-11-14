import { AssetCategory, AssetType, BinanceNetworkConfig, Product } from '../types';

export const OFFICIAL_USDT_TRC20_ADDRESS = 'TBZjJKmePUGVT5tGwpQrfk6z7ZmSiJkTpv';
export const OFFICIAL_USDT_EVM_ADDRESS = '0x31ac47694c792a7c7d5ced4cc8dc31010b83c20a';
export const OFFICIAL_USDT_SOL_ADDRESS = '85BcyhKTsFBvssX5PGm5uCjCK7kucBN7e2PTVfoDm8hj';
export const OFFICIAL_ONECASH_WALLET_NUMBER = '146158879';

const ONECASH_RAW_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h25v25H0z"/><path stroke="#1e3a78" d="M2 2.5h7M11 2.5h1M14 2.5h1M16 2.5h7M2 3.5h1M8 3.5h1M10 3.5h1M13 3.5h1M16 3.5h1M22 3.5h1M2 4.5h1M4 4.5h3M8 4.5h1M11 4.5h1M16 4.5h1M18 4.5h3M22 4.5h1M2 5.5h1M4 5.5h3M8 5.5h1M10 5.5h1M13 5.5h1M16 5.5h1M18 5.5h3M22 5.5h1M2 6.5h1M4 6.5h3M8 6.5h1M12 6.5h3M16 6.5h1M18 6.5h3M22 6.5h1M2 7.5h1M8 7.5h1M10 7.5h3M14 7.5h1M16 7.5h1M22 7.5h1M2 8.5h7M10 8.5h1M12 8.5h1M14 8.5h1M16 8.5h7M12 9.5h3M2 10.5h5M8 10.5h4M14 10.5h2M17 10.5h1M19 10.5h1M21 10.5h1M4 11.5h2M7 11.5h1M11 11.5h1M14 11.5h1M17 11.5h1M19 11.5h1M22 11.5h1M2 12.5h1M4 12.5h2M7 12.5h7M15 12.5h1M18 12.5h1M20 12.5h1M22 12.5h1M4 13.5h1M6 13.5h1M9 13.5h4M17 13.5h2M20 13.5h2M2 14.5h1M8 14.5h2M13 14.5h1M15 14.5h1M18 14.5h1M20 14.5h3M10 15.5h1M13 15.5h4M20 15.5h1M22 15.5h1M2 16.5h7M10 16.5h2M14 16.5h1M16 16.5h2M21 16.5h1M2 17.5h1M8 17.5h1M11 17.5h1M13 17.5h4M19 17.5h1M22 17.5h1M2 18.5h1M4 18.5h3M8 18.5h1M10 18.5h1M12 18.5h1M14 18.5h1M17 18.5h1M20 18.5h1M2 19.5h1M4 19.5h3M8 19.5h1M10 19.5h1M14 19.5h1M17 19.5h1M19 19.5h1M2 20.5h1M4 20.5h3M8 20.5h1M10 20.5h2M13 20.5h1M15 20.5h1M18 20.5h1M2 21.5h1M8 21.5h1M10 21.5h1M12 21.5h1M17 21.5h2M20 21.5h2M2 22.5h7M10 22.5h1M12 22.5h2M15 22.5h1M18 22.5h1M20 22.5h1"/></svg>';

export const ONECASH_QR_SVG_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(ONECASH_RAW_SVG)}`;

export const BINANCE_SPOT_NETWORKS: BinanceNetworkConfig[] = [
  {
    id: 'TRC20',
    shortCode: 'TRX',
    labelAr: 'Tron (TRC20)',
    labelEn: 'Tron (TRC20)',
    address: OFFICIAL_USDT_TRC20_ADDRESS,
    contractSuffix: '***jLj6t',
    minDeposit: '>0.01 USDT',
    confirmations: '1 تأكيد',
  },
  {
    id: 'BSC',
    shortCode: 'BSC',
    labelAr: 'BNB Smart Chain (BEP20)',
    labelEn: 'BNB Smart Chain (BEP20)',
    address: OFFICIAL_USDT_EVM_ADDRESS,
    contractSuffix: '***97955',
    minDeposit: '>0.01 USDT',
    confirmations: '1 تأكيد',
  },
  {
    id: 'SOL',
    shortCode: 'SOL',
    labelAr: 'Solana (SOL)',
    labelEn: 'Solana (SOL)',
    address: OFFICIAL_USDT_SOL_ADDRESS,
    contractSuffix: '***nwNYB',
    minDeposit: '>0.001 USDT',
    confirmations: '1 تأكيد',
    noteAr: 'عناوين SOL حساسة لحالة الأحرف (Case-Sensitive)',
    noteEn: 'SOL addresses are case-sensitive',
  },
  {
    id: 'ETH',
    shortCode: 'ETH',
    labelAr: 'Ethereum (ERC20)',
    labelEn: 'Ethereum (ERC20)',
    address: OFFICIAL_USDT_EVM_ADDRESS,
    contractSuffix: '***31ec7',
    minDeposit: '>0.001 USDT',
    confirmations: '6 تأكيدات',
  },
  {
    id: 'POL',
    shortCode: 'POL',
    labelAr: 'Polygon POS',
    labelEn: 'Polygon POS',
    address: OFFICIAL_USDT_EVM_ADDRESS,
    contractSuffix: '***58e8f',
    minDeposit: '>0.02 USDT',
    confirmations: 'الحزمة 1',
    noteAr: 'تأكد من أن عملة USDT المودعة تنتهي بعقد 58e8f',
    noteEn: 'Ensure USDT contract ends with 58e8f',
  },
  {
    id: 'PLASMA',
    shortCode: 'PLASMA',
    labelAr: 'Plasma (PLASMA)',
    labelEn: 'Plasma (PLASMA)',
    address: OFFICIAL_USDT_EVM_ADDRESS,
    contractSuffix: '***25ebb',
    minDeposit: '>0.000001 USDT',
    confirmations: '1 تأكيد',
  },
  {
    id: 'ONECASH',
    shortCode: 'ون كاش',
    labelAr: 'ون كاش (OneCash)',
    labelEn: 'OneCash Wallet',
    address: OFFICIAL_ONECASH_WALLET_NUMBER,
    contractSuffix: 'رقم الحساب',
    minDeposit: '$2.00 / ما يعادلها',
    confirmations: 'فوري (OneCash)',
    noteAr: 'بإمكان مشتركي ون كاش مسح رمز QR أو التحويل لرقم الحساب 146158879',
    noteEn: 'OneCash users can scan QR or transfer to account 146158879',
  },
];

export const DEFAULT_BINANCE_PAY_ID = 'Binance Spot Wallet / Multi-Network USDT';
export const UNIFORM_PRICE_USDT = 2;
export const DEFAULT_GITHUB_OWNER = 'aboanasanam42-cpu';
export const DEFAULT_GITHUB_REPO = 'Shopeapp';
export const DEFAULT_RELEASE_TAG = 'v1.0.0';
export const LIVE_NETLIFY_URL = 'https://dr-malik-alrumamh-store.netlify.app';

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '1.0 MB';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function getGitHubReleaseUrl(
  filename: string,
  owner = DEFAULT_GITHUB_OWNER,
  repo = DEFAULT_GITHUB_REPO,
  tag = DEFAULT_RELEASE_TAG
): string {
  return `https://github.com/${owner}/${repo}/releases/download/${tag}/${encodeURIComponent(filename)}`;
}

export function getGitHubRawUrl(
  filename: string,
  owner = DEFAULT_GITHUB_OWNER,
  repo = DEFAULT_GITHUB_REPO,
  branch = 'main'
): string {
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodeURIComponent(filename)}`;
}

export function detectAssetType(filename: string): AssetType {
  const lower = filename.toLowerCase().trim();
  if (lower.endsWith('.apk')) return 'apk';
  if (lower.endsWith('.aab')) return 'aab';
  if (lower.endsWith('.exe')) return 'exe';
  if (lower.endsWith('.pdf')) return 'pdf';
  return 'zip';
}

export function categorizeRepoFile(filename: string): AssetCategory {
  const lower = filename.toLowerCase();

  // Books & Literature (note: كتاب مبطلات الطب & كتاب دع السقم & طبيبك المنزلي are books/literature)
  if (
    lower.endsWith('.pdf') ||
    lower.includes('كتاب') ||
    lower.includes('تأليف') ||
    lower.includes('تاليف') ||
    lower.includes('تاريخ') ||
    lower.includes('موسوعة') ||
    lower.includes('لشعر') ||
    lower.includes('نفحات') ||
    lower.includes('مزامير') ||
    lower.includes('سباعية') ||
    lower.includes('المفازة') ||
    lower.includes('مبطلات الطب') ||
    lower.includes('دع السقم') ||
    lower.includes('طبيبك') ||
    lower.includes('ظلم الشعوب') ||
    lower.includes('ايات قرانية')
  ) {
    return 'books';
  }

  // Crypto Trading Bots
  if (
    lower.includes('mexc') ||
    lower.includes('تداول') ||
    lower.includes('عملات') ||
    lower.includes('titan')
  ) {
    return 'trading';
  }

  // Medical & Clinic Software
  if (
    lower.includes('clinic') ||
    lower.includes('medical') ||
    lower.includes('عياد') ||
    lower.includes('rahman') ||
    lower.includes('الرحمن')
  ) {
    return 'medical';
  }

  return 'utilities';
}

export function buildProductFromRepoFile(
  filename: string,
  sizeBytes: number,
  sha: string,
  index: number,
  owner = DEFAULT_GITHUB_OWNER,
  repo = DEFAULT_GITHUB_REPO,
  tag = DEFAULT_RELEASE_TAG,
  releaseDownloadUrl?: string
): Product {
  const cleanName = filename
    .trim()
    .replace(/\.(apk|zip|pdf|exe|aab)$/i, '')
    .replace(/\.apk$/i, '')
    .replace(/_/g, ' ');
  const type = detectAssetType(filename);
  const category = categorizeRepoFile(filename);

  const categoryDescriptions: Record<AssetCategory, { ar: string; en: string; featuresAr: string[]; featuresEn: string[] }> = {
    medical: {
      ar: `برنامج وتطبيق طبي احترافي لإدارة العيادات والمحاسبة الطبية وتوثيق حالات المرضى (${filename.trim()}). جاهز للتشغيل المباشر من مستودع الدكتور مالك الرميمة.`,
      en: `Professional medical & clinic management package (${filename.trim()}) for patient documentation and medical accounting from Dr. Malik Al-Rumaima.`,
      featuresAr: ['إدارة ملفات المرضى والزيارات الطبية', 'حسابات العيادة والفواتير اليومية', 'توثيق وأرشفة الحالات السريرية', 'تسليم مباشر وفوري بعد الدفع'],
      featuresEn: ['Patient records & visit tracking', 'Clinic accounting and daily billing', 'Clinical case archiving', 'Instant CDN download delivery'],
    },
    trading: {
      ar: `حزمة وتطبيق تداول العملات الرقمية وبوتات منصة MEXC الآلية (${filename.trim()}). يتضمن أدوات التنفيذ السريع والربط مع واجهات برمجة المنصات.`,
      en: `Automated cryptocurrency trading bot & MEXC SDK package (${filename.trim()}) engineered for rapid execution and market monitoring.`,
      featuresAr: ['اتصال مباشر بواجهات MEXC API', 'أدوات تداول الأحداث والفرص السريعة', 'هيكلة برمجية قابلة للتخصيص الكامل', 'سعر موحد 2.00$ عبر Binance'],
      featuresEn: ['Direct MEXC API integration', 'Event-driven automated order tools', 'Customizable source & release binaries', 'Flat $2.00 USD price via Binance'],
    },
    utilities: {
      ar: `تطبيق وأداة برمجية متكاملة للأنظمة والأجهزة (${filename.trim()}) من تطوير الدكتور مالك الرميمة. متاح بصيغ APK أو حزم ZIP الكاملة.`,
      en: `Production Android & Desktop utility software (${filename.trim()}) engineered by Dr. Malik Al-Rumaima.`,
      featuresAr: ['حزمة رسمية مباشرة من المستودع الرئيسي', 'توافق عالٍ مع الأنظمة الحديثة', 'تشفير وتحقق SHA-1 / SHA-256 كامل', 'رابط تنزيل سريع عبر GitHub Release'],
      featuresEn: ['Official package from main branch', 'Broad modern OS compatibility', 'Verified repository integrity hash', 'High-speed GitHub Release CDN link'],
    },
    books: {
      ar: `مؤلف علمي وأدبي وبحثي للدكتور مالك عبد الرحمن الرميمة (${cleanName}). نسخة رقمية كاملة عالية الجودة متاحة للتحميل المباشر.`,
      en: `Original academic, literary, or scientific publication by Dr. Malik Abdulrahman Al-Rumaima (${cleanName}).`,
      featuresAr: ['نسخة رقمية كاملة ومعتمدة من المؤلف', 'تنسيق واضح ومناسب للقراءة والطباعة', 'توثيق رسمي على مستودع GitHub', 'تحميل فوري بضغطة زر بعد تأكيد Binance'],
      featuresEn: ['Complete author-verified digital edition', 'Clean layout for screen and print', 'Officially archived on GitHub', 'Immediate download upon Binance confirmation'],
    },
  };

  const meta = categoryDescriptions[category];
  const rawUrl = getGitHubRawUrl(filename, owner, repo, 'main');
  const fallbackReleaseUrl = getGitHubReleaseUrl(filename, owner, repo, tag);

  return {
    id: `repo-${index + 1}-${sha.slice(0, 8)}`,
    title: cleanName,
    titleEn: `${cleanName} (${type.toUpperCase()})`,
    category,
    type,
    version: tag,
    size: formatBytes(sizeBytes),
    sizeBytes,
    priceUSDT: UNIFORM_PRICE_USDT,
    filename,
    descriptionAr: meta.ar,
    descriptionEn: meta.en,
    featuresAr: meta.featuresAr,
    featuresEn: meta.featuresEn,
    tags: [category, type.toUpperCase(), 'Shopeapp', 'Dr. Malik'],
    sha256: sha,
    releaseDownloadUrl: releaseDownloadUrl || fallbackReleaseUrl,
    rawDownloadUrl: rawUrl,
    hasReleaseAsset: Boolean(releaseDownloadUrl),
    downloadsCount: 120 + ((index * 37) % 850),
    rating: 4.9,
    author: 'د. مالك عبد الرحمن الرميمة',
  };
}

// Complete exact inventory of all 61 files currently in aboanasanam42-cpu/Shopeapp (main branch)
const RAW_SHOPEAPP_INVENTORY: Array<{ name: string; size: number; sha: string }> = [
  { name: ' كتاب مبطلات الطب إعداد وتأليف الدكتور مالك الرميمة.pdf', size: 869587, sha: 'f4ce692afcdaaf7bf7c282305b9694797314f970' },
  { name: '--main (3).zip', size: 151722, sha: '8114dc902e7e7e518543b3970a4c52fb6e22d29c' },
  { name: 'AlRahman-Clinic.apk', size: 21568524, sha: 'def2b7c0590b75d126c13ea64d9a74688f22b8d9' },
  { name: 'AlRahmanClinic-APK (3).zip', size: 15494952, sha: 'f8fdfb78d6a390e332dc1e96eb4241efe153cebb' },
  { name: 'Lookmoto-APKs (1) (1).zip', size: 21912795, sha: '57629612763202a4417a19660531760b2e57921d' },
  { name: 'Lookmoto-debug.apk', size: 22618384, sha: 'f8eda675a54ce3ba945c929bf6a8b62068f9d6da' },
  { name: 'MEXC--TRIAL-main (3).zip', size: 11165, sha: 'd60869a721989d793a5b26fcdfa59f5b81b9c3bf' },
  { name: 'MedicalAccounting-Windows-EXE.zip', size: 22216377, sha: 'a86121da684a5ad37f565108ef1fbf3ba2b9ca54' },
  { name: 'Newcal2000-main (2).zip', size: 1308516, sha: '1671e0ce11d65c5a90d812b0008ac64aa5819198' },
  { name: 'Nor-Windows-x64 .zip', size: 11917704, sha: 'e28fa54ea0392a576e4dbdc76a33fb04d734b3ea' },
  { name: 'Nor-main (55).zip', size: 239985, sha: '3da84d364d64f58374a2ed60eb5dfa28e039ec64' },
  { name: 'Palace-Love-Android15-Release-APK.zip', size: 14778659, sha: 'fe6fd4495c1e1f293ee7aebeb73f6b2a07701d37' },
  { name: 'Rahman-تطبيق لديون.zip', size: 14802137, sha: 'ad5339b6e33f8039751a603ec3dde98d1cfa252b' },
  { name: 'SchoolGrades-Release-APK (5).zip', size: 14859254, sha: '2f8730322f89496afa6692199c02d7e5cddc411b' },
  { name: 'Teacher-main.zip', size: 112746, sha: '18e24a6be36687149a04fc470b1ce0f1c8883a1c' },
  { name: 'WinRemote عملات.apk', size: 19375962, sha: '5d1e137a4824ee347c82a8c92d5e6480bdf0a35b' },
  { name: 'mexc-api-sdk-main.zip', size: 5506300, sha: '4cea191810e4fb39c949eb100c186a3c4b853498' },
  { name: 'mexc-event-trader-release-apk.zip', size: 25236918, sha: '22daac0b8a1bd4863f03d8cbc61b7ac55d102826' },
  { name: 'mexc_bot_package .zip', size: 11420242, sha: '752491b97d2a28d575a12324362030f3e7a5524d' },
  { name: 'tتطبيق توثيق حالات العيادة.zip', size: 187405, sha: '49ee33ca686a617bd8a0fc45ca5517a32aeb9f8f' },
  { name: 'wife-main.zip', size: 125247, sha: '8c9118dfba6866e463863206aa383a3efcf54b83' },
  { name: 'أثر الفكر الغربي تاليف الدكتور مالك الرميمة.pdf', size: 600314, sha: '78021b8ce38fc02c2a63a9aca48af59ed09805eb' },
  { name: 'الئ المفازة العظمئ إعداد وتأليف الدكتور مالك الرميمة.pdf', size: 436739, sha: '926a0e9be5d097d098a9d8fe3a63db9ab101e4cf' },
  { name: 'البرنامج الهندسي للرياضيات.zip', size: 14778905, sha: '74d4a9f0868a208758dbbeb222ca4ca9e0d7b6de' },
  { name: 'البرنامج الهندسي.zip', size: 109467, sha: '8bb7d95c73f30886a53670d83d56a3478329a8b0' },
  { name: 'العمل عن بعدد.zip', size: 12811168, sha: '8484fd08819f0355c590a889e9910b6b10a7102a' },
  { name: 'برنامج التداول للكمبيوتر.zip', size: 18193191, sha: 'ba8dcdaa77486ecaa5573c4e2fe71245cc4cdc21' },
  { name: 'تطبيق الاستاذ المدرسي.zip', size: 14992828, sha: 'd8e81188ea662c5e719d4298f2b170f3c8621d25' },
  { name: 'تطبيق الخزنة.apk', size: 24667602, sha: '7c16f206a5c30e313028a5fb10f6b5cb787c8caa' },
  { name: 'تطبيق الرياضيات الشامل.zip', size: 22209025, sha: '5004ab48b12b2da6bea20bbf817fe2ecdbefe26c' },
  { name: 'تطبيق النحو ن.zip', size: 14852295, sha: 'c2afb626c2e6a2e5a42a8bed239ae3f878e9303a' },
  { name: 'تطبيق النسب الرياضية.apk', size: 10788337, sha: 'd87a20d75e78378f54ad5e6a2f2852aa9cc4a821' },
  { name: 'تطبيق النسب الرياضية.zip', size: 108783, sha: '1463d9ac90531ea137bc2fed7b62fd571a00ae72' },
  { name: 'تطبيق توثيق حالات العيادة.zip', size: 15389294, sha: 'e262ae60ae1587c8a2b5cc93b8b0e8602729ea16' },
  { name: 'تطبيق حسابي للعيادات.zip', size: 1308516, sha: '1671e0ce11d65c5a90d812b0008ac64aa5819198' },
  { name: 'تطبيق قضاء الديون.apk', size: 15494802, sha: 'e97939d4eb4540c25f7b7f1bbcc49424c54f588f' },
  { name: 'تطبيق قضاء الديون.zip', size: 15494952, sha: 'f8fdfb78d6a390e332dc1e96eb4241efe153cebb' },
  { name: 'تطبيق مكتبة البدر.zip', size: 17916082, sha: '1aed079fd46da7db42f4af047aa47ea72c4a642e' },
  { name: 'خزنة سريه.apk', size: 17293207, sha: 'c00fc7aaf0f3e14db63103b8dd315b66d360333d' },
  { name: 'عمل عن بعد ت.zip', size: 277144, sha: '834a4b734be2e92b4d93ce5764efcc3de94f1cde' },
  { name: 'عمل عن بعد.apk', size: 13918908, sha: '94008907b182621126c023ae27fe4ea2b8b753ad' },
  { name: 'كتاب إستكفي مما تزرع اعداد وتاليف الدكتور مالك الرميمة.pdf', size: 1061585, sha: '88b326897d2869fc984e784afb07f981db20cfde' },
  { name: 'كتاب ابدا من الصفر تاليف د.مالك الرميمة.pdf', size: 243827, sha: '1b71d7d115db67519c1d9fa35569a72fc5db89db' },
  { name: 'كتاب الى المفازةapk.zip', size: 2296097, sha: '1ac9d044cdb366c87d28f07aa9abf80ecd992d64' },
  { name: 'كتاب ايات قرانية.zip', size: 16759813, sha: 'bb2a97b58409913ed5db4f443759713dcd4d6210' },
  { name: 'كتاب دع السقم إعداد وتأليف الدكتور مالك الرميمة.pdf', size: 636748, sha: 'da23eb0c744fc273825e7c5342d6f02f43b825b8' },
  { name: 'كتاب دع السقم.zip', size: 16568821, sha: '8587d84748af26130a2ebc6f6236bc1513b04a83' },
  { name: 'كتاب سباعية النشاة إعداد وتاليف د.مالك الرميمة.pdf', size: 1833749, sha: '29e4649b8a7fb72d8a95c3169363b2693daa9cc3' },
  { name: 'كتاب سباعية النشاة.zip', size: 16492053, sha: '135f39640b61b3f5b24a385fd8f4110a56461710' },
  { name: 'كتاب طبيبك المنزلي.zip', size: 17272599, sha: 'a7fe9d39ef3e73aabb3b5d0cc99611fa48a3ec6c' },
  { name: 'كتاب ظلم الشعوب apk.zip', size: 17009675, sha: '6de43bb27e85047f55fecf9c784a75b073860246' },
  { name: 'كتاب ظلم الشعوب المسلمة تاليف الدكتور مالك الرميمة-837_compressed1.pdf', size: 369357, sha: 'aac52ce807d4bc210c1e2fd9f71a347cf5a6c283' },
  { name: 'كتاب لشعر حلاوة.apk', size: 14178713, sha: 'f42f534d743459eeb01c27b86c1275804a287d3c' },
  { name: 'كتاب مزامير من حكم.zip', size: 16576916, sha: 'adf3a8c3523d7231e784601bded36f9bd7efe065' },
  { name: 'كتاب نفحات من كتاب الله.zip', size: 24695147, sha: 'faaecddff3f7e3155558fa4be260f2f864f5405e' },
  { name: 'لشعر حلاوة كحلاوة السكر تاليف الدكتور مالك الرميمة-608.pdf', size: 8061085, sha: 'e2b18b5aec4d4675c1c577f08c0cf214450f72dc' },
  { name: 'مكالمات تعلم للغات.apk', size: 22365287, sha: 'bd438b4141d925c20189fd3b9fe003d78de68c92' },
  { name: 'مكالمات تعلم للغات.zip', size: 21669391, sha: '9f98c2f8b4df807a2813c1bd217e7b1162103e47' },
  { name: 'مكتبة البدر.zip', size: 2749673, sha: 'b4b157860a3590516e156ce3914bbb0cbf759117' },
  { name: 'موسوعة الدكتور مالك.zip', size: 85336, sha: '3400f4eee171dd415f5580334cd2e9e5c0561482' },
  { name: 'نفحات من سورة الاخلاص الدكتور مالك الرميمة.pdf', size: 1066810, sha: '752e3a5ae2f666e1c747be5d0b7345aa962829b6' },
];

export const PRODUCTS_CATALOG: Product[] = RAW_SHOPEAPP_INVENTORY.map((item, idx) =>
  buildProductFromRepoFile(item.name, item.size, item.sha, idx)
);
