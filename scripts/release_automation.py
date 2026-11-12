#!/usr/bin/env python3
"""
Automated GitHub Release (v1.0.0) & Repository Organization Script
Target Repository: aboanasanam42-cpu/Shopeapp
Storefront URL: https://dr-malik-alrumamh-store.netlify.app

Usage:
  export GITHUB_TOKEN="ghp_your_personal_access_token"
  python3 scripts/release_automation.py --commit-web
"""

import argparse
import base64
import json
import mimetypes
import os
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OWNER = os.environ.get("GITHUB_OWNER", "aboanasanam42-cpu")
REPO = os.environ.get("GITHUB_REPO", "Shopeapp")
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
RELEASE_TAG = os.environ.get("RELEASE_TAG", "v1.0.0")
RELEASE_TITLE = "متجر الدكتور مالك الرميمة - الإصدار الرسمي الأول v1.0.0"
ALLOWED_EXTENSIONS = (".apk", ".aab", ".exe", ".zip", ".pdf")


def api_request(
    url: str,
    token: str,
    method: str = "GET",
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
):
    req_headers = {
        "Accept": "application/vnd.github+json",
        "Authorization": f"Bearer {token}",
        "User-Agent": "DrMalik-Shopeapp-Automation/1.0",
    }
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw.decode("utf-8")) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        return e.code, {"error": body}


def get_or_create_release(token: str) -> dict:
    tag_url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases/tags/{RELEASE_TAG}"
    status, resp = api_request(tag_url, token)
    if status == 200 and resp.get("id"):
        print(f"[OK] Found existing release {RELEASE_TAG} (ID: {resp['id']})")
        return resp

    create_url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases"
    payload = json.dumps(
        {
            "tag_name": RELEASE_TAG,
            "target_commitish": BRANCH,
            "name": RELEASE_TITLE,
            "body": (
                "### متجر الدكتور مالك الرميمة للبرمجيات والأكواد والمؤلفات\n\n"
                "- **الموقع الرسمي:** https://dr-malik-alrumamh-store.netlify.app\n"
                "- **السعر الموحد:** $2.00 USD (2 USDT عبر Binance)\n"
                "- **محتويات الإصدار:** كافة تطبيقات الأندرويد (.apk)، الحزم (.zip)، والكتب العلمية (.pdf)."
            ),
            "draft": False,
            "prerelease": False,
        }
    ).encode("utf-8")
    status, created = api_request(
        create_url,
        token,
        method="POST",
        data=payload,
        headers={"Content-Type": "application/json"},
    )
    if status not in (200, 201):
        raise RuntimeError(f"Failed to create release {RELEASE_TAG}: {status} {created}")
    print(f"[CREATED] Release {RELEASE_TAG}: {created.get('html_url')}")
    return created


def scan_remote_repo_files(token: str) -> list[dict]:
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents?ref={BRANCH}"
    status, items = api_request(url, token)
    if status != 200 or not isinstance(items, list):
        raise RuntimeError(f"Failed to list repository contents: {status} {items}")
    files = [
        item
        for item in items
        if item.get("type") == "file"
        and str(item.get("name", "")).strip().lower().endswith(ALLOWED_EXTENSIONS)
    ]
    print(f"[SCAN] Found {len(files)} product files in {OWNER}/{REPO} ({BRANCH})")
    return files


def download_raw_bytes(download_url: str, token: str) -> bytes:
    req = urllib.request.Request(
        download_url,
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": "DrMalik-Shopeapp-Automation/1.0",
        },
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def upload_release_asset(
    upload_url_template: str,
    token: str,
    asset_name: str,
    file_bytes: bytes,
    existing_assets: dict[str, int],
) -> str | None:
    clean_asset_name = asset_name.strip()
    if clean_asset_name in existing_assets:
        del_url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases/assets/{existing_assets[clean_asset_name]}"
        api_request(del_url, token, method="DELETE")

    base_upload = upload_url_template.split("{")[0]
    encoded_name = urllib.parse.quote(clean_asset_name)
    target_url = f"{base_upload}?name={encoded_name}"
    mime_type, _ = mimetypes.guess_type(clean_asset_name)
    content_type = mime_type or "application/octet-stream"

    status, resp = api_request(
        target_url,
        token,
        method="POST",
        data=file_bytes,
        headers={"Content-Type": content_type},
    )
    if status in (200, 201):
        return resp.get("browser_download_url")
    print(f"  [WARN] Could not attach {clean_asset_name} ({status}), raw URL fallback remains active.")
    return None


def commit_file_to_repo(token: str, repo_path: str, local_file: Path, message: str):
    if not local_file.exists():
        print(f"  [SKIP] Local file not found: {local_file}")
        return
    content_b64 = base64.b64encode(local_file.read_bytes()).decode("utf-8")
    api_url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{urllib.parse.quote(repo_path)}"
    status, existing = api_request(f"{api_url}?ref={BRANCH}", token)
    payload = {
        "message": message,
        "content": content_b64,
        "branch": BRANCH,
    }
    if status == 200 and existing.get("sha"):
        payload["sha"] = existing["sha"]

    put_status, put_resp = api_request(
        api_url,
        token,
        method="PUT",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    if put_status in (200, 201):
        print(f"  [COMMITTED] {repo_path} -> {put_resp.get('commit', {}).get('sha', '')[:8]}")
    else:
        print(f"  [ERROR] Failed to commit {repo_path}: {put_status} {put_resp}")


def main():
    parser = argparse.ArgumentParser(description="Publish Shopeapp Release v1.0.0 & sync web files")
    parser.add_argument("--local-dir", default=None, help="Optional local directory if running inside checkout")
    parser.add_argument("--commit-web", action="store_true", help="Commit netlify-drop/index.html, sitemap.xml, robots.txt to main")
    parser.add_argument("--skip-commit", action="store_true", help="Skip committing web files")
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("PAT_TOKEN")
    if not token:
        print("Error: Please set GITHUB_TOKEN environment variable with your GitHub PAT.", file=sys.stderr)
        sys.exit(1)

    release = get_or_create_release(token)
    upload_url_template = release["upload_url"]
    existing_assets = {a["name"]: a["id"] for a in release.get("assets", [])}

    manifest = []
    if args.local_dir:
        local_root = Path(args.local_dir)
        files = sorted(
            [
                p
                for p in local_root.iterdir()
                if p.is_file() and p.name.strip().lower().endswith(ALLOWED_EXTENSIONS)
            ],
            key=lambda p: p.name,
        )
        print(f"[LOCAL SCAN] Found {len(files)} product files in {local_root}")
        for idx, file_path in enumerate(files, 1):
            print(f"[{idx}/{len(files)}] Uploading {file_path.name} ({file_path.stat().st_size} bytes)...")
            release_url = upload_release_asset(
                upload_url_template, token, file_path.name, file_path.read_bytes(), existing_assets
            )
            raw_url = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{urllib.parse.quote(file_path.name)}"
            manifest.append(
                {
                    "name": file_path.name,
                    "size": file_path.stat().st_size,
                    "price_usd": 2.00,
                    "release_url": release_url or raw_url,
                    "raw_url": raw_url,
                }
            )
    else:
        remote_files = scan_remote_repo_files(token)
        for idx, item in enumerate(remote_files, 1):
            name = item["name"]
            raw_url = item.get("download_url") or (
                f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{urllib.parse.quote(name)}"
            )
            print(f"[{idx}/{len(remote_files)}] Syncing {name} ({item.get('size', 0)} bytes)...")
            file_bytes = download_raw_bytes(raw_url, token)
            release_url = upload_release_asset(
                upload_url_template, token, name, file_bytes, existing_assets
            )
            manifest.append(
                {
                    "name": name,
                    "size": item.get("size", len(file_bytes)),
                    "price_usd": 2.00,
                    "release_url": release_url or raw_url,
                    "raw_url": raw_url,
                }
            )

    if args.commit_web and not args.skip_commit:
        print("\n[WEB SYNC] Committing index.html, sitemap.xml, and robots.txt to main...")
        drop_dir = Path(__file__).resolve().parent.parent / "netlify-drop"
        commit_file_to_repo(token, "index.html", drop_dir / "index.html", "Update storefront index.html synced with Release v1.0.0 & Binance")
        commit_file_to_repo(token, "sitemap.xml", drop_dir / "sitemap.xml", "Add sitemap.xml for Dr. Malik Storefront SEO")
        commit_file_to_repo(token, "robots.txt", drop_dir / "robots.txt", "Add robots.txt for 24/7 Google Search indexing")

    print(f"\n[DONE] Processed {len(manifest)} store items for Release {RELEASE_TAG}!")


if __name__ == "__main__":
    main()
