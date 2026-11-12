export type AssetCategory = 'medical' | 'trading' | 'utilities' | 'books';

export type AssetType = 'apk' | 'aab' | 'exe' | 'zip' | 'pdf';

export interface Product {
  id: string;
  title: string;
  titleEn: string;
  category: AssetCategory;
  type: AssetType;
  version: string;
  size: string;
  sizeBytes?: number;
  priceUSDT: number;
  filename: string;
  descriptionAr: string;
  descriptionEn: string;
  featuresAr: string[];
  featuresEn: string[];
  tags: string[];
  sha256: string;
  releaseDownloadUrl?: string;
  rawDownloadUrl?: string;
  hasReleaseAsset?: boolean;
  downloadsCount: number;
  rating: number;
  author: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface VerifiedPurchase {
  orderId: string;
  txHash: string;
  timestamp: number;
  items: Product[];
  totalUSDT: number;
  payerAddress?: string;
}

export interface GitHubConfig {
  owner: string;
  repo: string;
  tag: string;
  token?: string;
  binancePayId?: string;
  usdtAddress?: string;
  isConfigured: boolean;
}

export type BinanceNetworkId = 'TRC20' | 'BSC' | 'SOL' | 'ETH' | 'POL' | 'PLASMA';

export interface BinanceNetworkConfig {
  id: BinanceNetworkId;
  shortCode: string;
  labelAr: string;
  labelEn: string;
  address: string;
  contractSuffix: string;
  minDeposit: string;
  confirmations: string;
  noteAr?: string;
  noteEn?: string;
}

