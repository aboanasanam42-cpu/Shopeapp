import { Product } from '../types';
import {
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
  DEFAULT_RELEASE_TAG,
  OFFICIAL_USDT_TRC20_ADDRESS,
  buildProductFromRepoFile,
} from '../data/products';

export interface ReleaseAssetInfo {
  name: string;
  size: number;
  downloadUrl: string;
  contentType: string;
}

export interface GitHubReleaseStatus {
  exists: boolean;
  tagName: string;
  name: string;
  htmlUrl: string;
  publishedAt?: string;
  assetsCount: number;
  assets: ReleaseAssetInfo[];
}

const GITHUB_CONFIG_STORAGE_KEY = 'dr_malik_store_github_config_v2';

export function getStoredGitHubConfig() {
  try {
    const saved = localStorage.getItem(GITHUB_CONFIG_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        owner: parsed.owner || DEFAULT_GITHUB_OWNER,
        repo: parsed.repo || DEFAULT_GITHUB_REPO,
        tag: parsed.tag || DEFAULT_RELEASE_TAG,
        token: parsed.token || '',
        binancePayId: parsed.binancePayId || '',
        usdtAddress: parsed.usdtAddress || OFFICIAL_USDT_TRC20_ADDRESS,
        isConfigured: true,
      };
    }
  } catch {
    // ignore
  }
  return {
    owner: DEFAULT_GITHUB_OWNER,
    repo: DEFAULT_GITHUB_REPO,
    tag: DEFAULT_RELEASE_TAG,
    token: '',
    binancePayId: '',
    usdtAddress: OFFICIAL_USDT_TRC20_ADDRESS,
    isConfigured: true,
  };
}

export function saveGitHubConfig(config: {
  owner: string;
  repo: string;
  tag: string;
  token?: string;
  binancePayId?: string;
  usdtAddress?: string;
}) {
  try {
    localStorage.setItem(
      GITHUB_CONFIG_STORAGE_KEY,
      JSON.stringify({
        ...config,
        isConfigured: Boolean(config.owner && config.repo),
      })
    );
  } catch {
    // ignore
  }
}

function normalizeAssetKey(name: string): string {
  return name.trim().toLowerCase().replace(/[\s()]+/g, '.').replace(/\.+/g, '.');
}

/**
 * Fetches latest release (or specific tag) from GitHub Releases API.
 */
export async function fetchGitHubRelease(
  owner: string = DEFAULT_GITHUB_OWNER,
  repo: string = DEFAULT_GITHUB_REPO,
  tag: string = DEFAULT_RELEASE_TAG,
  token?: string
): Promise<GitHubReleaseStatus> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // Try /releases/latest first, then fallback to /releases/tags/{tag}
    let res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`, { headers });
    if (res.status === 404) {
      res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`, { headers });
    }

    if (res.status === 404) {
      return {
        exists: false,
        tagName: tag,
        name: `Release ${tag}`,
        htmlUrl: `https://github.com/${owner}/${repo}/releases`,
        assetsCount: 0,
        assets: [],
      };
    }

    if (!res.ok) {
      throw new Error(`GitHub API responded with status ${res.status}`);
    }

    const data = await res.json();
    return {
      exists: true,
      tagName: data.tag_name || tag,
      name: data.name || `Release ${tag}`,
      htmlUrl: data.html_url,
      publishedAt: data.published_at,
      assetsCount: data.assets?.length || 0,
      assets: (data.assets || []).map((a: any) => ({
        name: a.name,
        size: a.size,
        downloadUrl: a.browser_download_url,
        contentType: a.content_type,
      })),
    };
  } catch (err: any) {
    console.warn('Could not reach GitHub Releases API:', err);
    return {
      exists: false,
      tagName: tag,
      name: `Release ${tag}`,
      htmlUrl: `https://github.com/${owner}/${repo}/releases`,
      assetsCount: 0,
      assets: [],
    };
  }
}

/**
 * Dynamically fetches BOTH /contents and /releases/latest from GitHub API
 * and returns a synchronized list of products with Release CDN URLs + raw fallback.
 */
export async function fetchLiveRepositoryCatalog(
  owner: string = DEFAULT_GITHUB_OWNER,
  repo: string = DEFAULT_GITHUB_REPO,
  tag: string = DEFAULT_RELEASE_TAG,
  token?: string
): Promise<{ products: Product[]; releaseStatus: GitHubReleaseStatus; isLiveSynced: boolean }> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const [contentsRes, releaseStatus] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}/contents?ref=main`, { headers }),
    fetchGitHubRelease(owner, repo, tag, token),
  ]);

  if (!contentsRes.ok) {
    throw new Error(`GitHub Contents API status: ${contentsRes.status}`);
  }

  const contentsData = await contentsRes.json();
  if (!Array.isArray(contentsData)) {
    throw new Error('Unexpected GitHub Contents API response');
  }

  // Build quick lookup map for release assets (exact + normalized key)
  const releaseAssetMap = new Map<string, string>();
  for (const asset of releaseStatus.assets) {
    releaseAssetMap.set(asset.name.toLowerCase(), asset.downloadUrl);
    releaseAssetMap.set(normalizeAssetKey(asset.name), asset.downloadUrl);
  }

  const validExtensions = ['.apk', '.aab', '.exe', '.zip', '.pdf'];
  const repoFiles = contentsData.filter((item: any) => {
    if (item.type !== 'file') return false;
    const lower = String(item.name || '').toLowerCase().trim();
    return validExtensions.some((ext) => lower.endsWith(ext));
  });

  const products: Product[] = repoFiles.map((file: any, idx: number) => {
    const filename = String(file.name);
    const matchedReleaseUrl =
      releaseAssetMap.get(filename.toLowerCase()) ||
      releaseAssetMap.get(normalizeAssetKey(filename));

    const prod = buildProductFromRepoFile(
      filename,
      Number(file.size) || 0,
      String(file.sha || ''),
      idx,
      owner,
      repo,
      releaseStatus.tagName || tag,
      matchedReleaseUrl
    );

    if (file.download_url) {
      prod.rawDownloadUrl = file.download_url;
    }

    return prod;
  });

  return {
    products,
    releaseStatus,
    isLiveSynced: true,
  };
}

/**
 * Resolves the best direct download URL for a product:
 * Prefers verified GitHub Release CDN asset URL, falls back seamlessly to raw.githubusercontent.com.
 */
export function resolveProductDownloadUrl(product: Product): string {
  if (product.hasReleaseAsset && product.releaseDownloadUrl) {
    return product.releaseDownloadUrl;
  }
  if (product.rawDownloadUrl) {
    return product.rawDownloadUrl;
  }
  const config = getStoredGitHubConfig();
  return `https://raw.githubusercontent.com/${config.owner}/${config.repo}/main/${encodeURIComponent(product.filename)}`;
}

/**
 * Creates a GitHub Release programmatically using a Personal Access Token.
 */
export async function createGitHubRelease(
  owner: string,
  repo: string,
  tag: string = DEFAULT_RELEASE_TAG,
  token: string,
  releaseTitle = 'متجر الدكتور مالك الرميمة - الإصدار الرسمي الأول v1.0.0'
) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tag_name: tag,
      name: releaseTitle,
      body: `### متجر الدكتور مالك الرميمة للبرمجيات والأكواد والمؤلفات\n\nالإصدار الرسمي ${tag} المربوط مع الموقع المباشر: https://dr-malik-alrumamh-store.netlify.app\nتسعير موحد: 2.00$ (2 USDT عبر Binance).`,
      draft: false,
      prerelease: false,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to create release (Status ${res.status})`);
  }

  return await res.json();
}

/**
 * Generates the automated GitHub Actions workflow (.github/workflows/release.yml).
 */
export function generateGitHubActionsWorkflow(): string {
  return `name: Release Shopeapp Assets v1.0.0

on:
  workflow_dispatch:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  publish_release:
    name: Publish All Repository Files to Release v1.0.0
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Create or Update Release v1.0.0 & Upload Assets
        env:
          GH_TOKEN: \${{ secrets.PAT_TOKEN || secrets.GITHUB_TOKEN }}
        run: |
          TAG="v1.0.0"
          TITLE="متجر الدكتور مالك الرميمة - الإصدار الرسمي الأول v1.0.0"
          NOTES="الإصدار الرسمي الشامل لكافة التطبيقات (.apk) والحزم (.zip) والمؤلفات (.pdf) في مستودع aboanasanam42-cpu/Shopeapp بسعر موحد 2.00 USD عبر Binance."

          if ! gh release view "$TAG" >/dev/null 2>&1; then
            gh release create "$TAG" --title "$TITLE" --notes "$NOTES"
          fi

          shopt -s nullglob
          for file in *.apk *.aab *.exe *.zip *.pdf; do
            if [ -f "$file" ]; then
              echo "Uploading $file to Release $TAG..."
              gh release upload "$TAG" "$file" --clobber || true
            fi
          done
`;
}
