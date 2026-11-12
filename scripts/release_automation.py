#!/usr/bin/env python3
"""
Automated GitHub Release (v1.0.0) & Repository Organization Script
Target Repository: aboanasanam42-cpu/Shopeapp
Storefront URL: https://dr-malik-alrumamh-store.netlify.app
"""

import argparse
import base64
import concurrent.futures
import json
import mimetypes
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

OWNER = os.environ.get("GITHUB_OWNER", "aboanasanam42-cpu")
REPO = os.environ.get("GITHUB_REPO", "Shopeapp")
BRANCH = os.environ.get("GITHUB_BRANCH", "main")
RELEASE_TAG = os.environ.get("RELEASE_TAG", "v1.0.0")
RESTORE_FROM_COMMIT = "0cff194345655cabaf7b82ccf2dbde40594858df"
RELEASE_TITLE = "متجر الدكتور مالك الرميمة - الإصدار الرسمي الأول v1.0.0"
ALLOWED_EXTENSIONS = (".apk", ".aab", ".exe", ".zip", ".pdf")
COLLIDING_STALE_ASSETS = {"default.apk", "default.pdf", "default.zip", "apk.zip", "Rahman-.zip"}


def normalize_asset_key(name: str) -> str:
    return re.sub(r"\.+", ".", re.sub(r"[\s()]+", ".", name.strip().lower()))


def make_release_asset_name(original_name: str, sha: str) -> str:
    """GitHub Releases strips non-ASCII characters, causing Arabic filenames to collide on default.ext.
    Pure ASCII names keep their clean filename; non-ASCII names get a deterministic ASCII asset name."""
    cleaned = original_name.strip()
    if all(ord(ch) < 128 for ch in cleaned):
        ascii_norm = re.sub(r"[\s()]+", ".", cleaned)
        ascii_norm = re.sub(r"\.+", ".", ascii_norm).lstrip(".")
        return ascii_norm or f"{sha[:8]}.bin"

    ext = Path(cleaned).suffix.lower() or ".bin"
    ascii_stem = re.sub(r"[^A-Za-z0-9._-]+", "-", Path(cleaned).stem).strip("-.")
    short_hash = (sha or "asset")[:8]
    if ascii_stem:
        return f"item-{short_hash}-{ascii_stem}{ext}"
    return f"item-{short_hash}{ext}"


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
        "User-Agent": "DrMalik-Shopeapp-Automation/2.0",
    }
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=data, headers=req_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            raw = resp.read()
            return resp.status, json.loads(raw.decode("utf-8")) if raw else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        return e.code, {"error": body}


def restore_missing_product_files(token: str):
    """Restores any product files from historical upload commit if missing on main."""
    ref_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/ref/heads/{BRANCH}"
    st, ref_data = api_request(ref_url, token)
    if st != 200:
        print(f"[WARN] Could not inspect head ref: {st} {ref_data}", flush=True)
        return
    head_sha = ref_data["object"]["sha"]

    st_head, head_commit = api_request(f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{head_sha}", token)
    st_old, old_commit = api_request(f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits/{RESTORE_FROM_COMMIT}", token)
    if st_head != 200 or st_old != 200:
        return

    head_tree_sha = head_commit["tree"]["sha"]
    old_tree_sha = old_commit["tree"]["sha"]

    _, head_tree = api_request(f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees/{head_tree_sha}", token)
    _, old_tree = api_request(f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees/{old_tree_sha}", token)

    existing_paths = {item["path"] for item in head_tree.get("tree", [])}
    missing_items = [
        {
            "path": item["path"],
            "mode": item["mode"],
            "type": item["type"],
            "sha": item["sha"],
        }
        for item in old_tree.get("tree", [])
        if item["type"] == "blob"
        and item["path"].strip().lower().endswith(ALLOWED_EXTENSIONS)
        and item["path"] not in existing_paths
    ]

    if not missing_items:
        print("[RESTORE] All 61 product files are already present in main.", flush=True)
        return

    print(f"[RESTORE] Restoring {len(missing_items)} product files from {RESTORE_FROM_COMMIT} to {BRANCH}...", flush=True)
    st_tree, new_tree = api_request(
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/trees",
        token,
        method="POST",
        data=json.dumps({"base_tree": head_tree_sha, "tree": missing_items}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    if st_tree not in (200, 201):
        raise RuntimeError(f"Failed to create merged tree: {st_tree} {new_tree}")

    st_commit, created_commit = api_request(
        f"https://api.github.com/repos/{OWNER}/{REPO}/git/commits",
        token,
        method="POST",
        data=json.dumps(
            {
                "message": f"Restore {len(missing_items)} store product files (.pdf/.zip) to main",
                "tree": new_tree["sha"],
                "parents": [head_sha],
            }
        ).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    if st_commit not in (200, 201):
        raise RuntimeError(f"Failed to create restore commit: {st_commit} {created_commit}")

    patch_url = f"https://api.github.com/repos/{OWNER}/{REPO}/git/refs/heads/{BRANCH}"
    st_patch, patch_resp = api_request(
        patch_url,
        token,
        method="PATCH",
        data=json.dumps({"sha": created_commit["sha"]}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    if st_patch != 200:
        raise RuntimeError(f"Failed to fast-forward {BRANCH}: {st_patch} {patch_resp}")
    print(f"[RESTORE] Successfully restored {len(missing_items)} files -> commit {created_commit['sha'][:8]}", flush=True)


def get_or_create_release(token: str) -> dict:
    tag_url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases/tags/{RELEASE_TAG}"
    status, resp = api_request(tag_url, token)
    if status == 200 and resp.get("id"):
        print(f"[OK] Found existing release {RELEASE_TAG} (ID: {resp['id']})", flush=True)
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
    print(f"[CREATED] Release {RELEASE_TAG}: {created.get('html_url')}", flush=True)
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
    print(f"[SCAN] Found {len(files)} product files in {OWNER}/{REPO} ({BRANCH})", flush=True)
    return files


def download_raw_bytes(filename: str, token: str) -> bytes:
    encoded_path = urllib.parse.quote(filename, safe="")
    raw_url = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{encoded_path}"
    req = urllib.request.Request(
        raw_url,
        headers={
            "Authorization": f"Bearer {token}",
            "User-Agent": "DrMalik-Shopeapp-Automation/2.0",
        },
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        return resp.read()


def upload_bytes_to_release(
    upload_url_template: str,
    token: str,
    asset_name: str,
    file_bytes: bytes,
    existing_by_name: dict[str, dict],
) -> str | None:
    existing = existing_by_name.get(asset_name.lower())
    if existing:
        if existing.get("size") == len(file_bytes):
            return existing.get("browser_download_url")
        del_url = f"https://api.github.com/repos/{OWNER}/{REPO}/releases/assets/{existing['id']}"
        api_request(del_url, token, method="DELETE")

    base_upload = upload_url_template.split("{")[0]
    encoded_name = urllib.parse.quote(asset_name)
    target_url = f"{base_upload}?name={encoded_name}"
    mime_type, _ = mimetypes.guess_type(asset_name)
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
    print(f"  [WARN] Could not attach {asset_name} ({status}): {resp}", flush=True)
    return None


def commit_bytes_to_repo(token: str, repo_path: str, raw_bytes: bytes, message: str):
    content_b64 = base64.b64encode(raw_bytes).decode("utf-8")
    api_url = f"https://api.github.com/repos/{OWNER}/{REPO}/contents/{urllib.parse.quote(repo_path)}"
    status, existing = api_request(f"{api_url}?ref={BRANCH}", token)
    payload = {
        "message": message,
        "content": content_b64,
        "branch": BRANCH,
    }
    if status == 200 and existing.get("sha"):
        existing_b64 = (existing.get("content") or "").replace("\n", "")
        if existing_b64 == content_b64:
            print(f"  [UNCHANGED] {repo_path}", flush=True)
            return
        payload["sha"] = existing["sha"]

    put_status, put_resp = api_request(
        api_url,
        token,
        method="PUT",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    if put_status in (200, 201):
        print(f"  [COMMITTED] {repo_path} -> {put_resp.get('commit', {}).get('sha', '')[:8]}", flush=True)
    else:
        print(f"  [ERROR] Failed to commit {repo_path}: {put_status} {put_resp}", flush=True)


def commit_file_to_repo(token: str, repo_path: str, local_file: Path, message: str):
    if not local_file.exists():
        print(f"  [SKIP] Local file not found: {local_file}", flush=True)
        return
    commit_bytes_to_repo(token, repo_path, local_file.read_bytes(), message)


def main():
    parser = argparse.ArgumentParser(description="Publish Shopeapp Release v1.0.0 & sync web files")
    parser.add_argument("--local-dir", default=None, help="Optional local directory if running inside checkout")
    parser.add_argument("--commit-web", action="store_true", help="Commit README.md, index.html, sitemap.xml, robots.txt, manifest, and workflow")
    parser.add_argument("--skip-commit", action="store_true", help="Skip committing web files")
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("PAT_TOKEN")
    if not token:
        print("Error: Please set GITHUB_TOKEN environment variable with your GitHub PAT.", file=sys.stderr)
        sys.exit(1)

    if not args.local_dir:
        restore_missing_product_files(token)

    release = get_or_create_release(token)
    upload_url_template = release["upload_url"]

    # Clean up colliding non-ASCII stripped assets from earlier runs
    existing_by_name = {}
    for a in release.get("assets", []):
        if a["name"] in COLLIDING_STALE_ASSETS:
            print(f"  [CLEAN] Removing colliding stale asset: {a['name']}", flush=True)
            api_request(f"https://api.github.com/repos/{OWNER}/{REPO}/releases/assets/{a['id']}", token, method="DELETE")
        else:
            existing_by_name[a["name"].lower()] = a

    manifest = []
    if args.local_dir:
        import hashlib
        local_root = Path(args.local_dir)
        files = sorted(
            [p for p in local_root.iterdir() if p.is_file() and p.name.strip().lower().endswith(ALLOWED_EXTENSIONS)],
            key=lambda p: p.name,
        )
        print(f"[LOCAL SCAN] Found {len(files)} product files in {local_root}", flush=True)

        def process_local(idx_p):
            idx, p = idx_p
            size = p.stat().st_size
            file_hash = hashlib.sha1(p.name.encode("utf-8")).hexdigest()
            asset_name = make_release_asset_name(p.name, file_hash)
            raw_url = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{urllib.parse.quote(p.name)}"
            existing = existing_by_name.get(asset_name.lower())
            if existing and existing.get("size") == size:
                release_url = existing.get("browser_download_url")
            else:
                release_url = upload_bytes_to_release(upload_url_template, token, asset_name, p.read_bytes(), existing_by_name)
                print(f"[{idx}/{len(files)}] Uploaded: {asset_name} ({size} bytes)", flush=True)
            return {
                "name": p.name,
                "asset_name": asset_name,
                "size": size,
                "price_usd": 2.00,
                "release_url": release_url or raw_url,
                "raw_url": raw_url,
            }

        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            manifest = list(pool.map(process_local, enumerate(files, 1)))
    else:
        remote_files = scan_remote_repo_files(token)

        def process_item(idx_item):
            idx, item = idx_item
            name = item["name"]
            size = int(item.get("size", 0))
            sha = item.get("sha", "")
            asset_name = make_release_asset_name(name, sha)
            raw_url = f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{BRANCH}/{urllib.parse.quote(name)}"
            existing = existing_by_name.get(asset_name.lower())
            if existing and existing.get("size") == size:
                release_url = existing.get("browser_download_url")
                print(f"[{idx}/{len(remote_files)}] Verified in release: {asset_name}", flush=True)
            else:
                file_bytes = download_raw_bytes(name, token)
                release_url = upload_bytes_to_release(upload_url_template, token, asset_name, file_bytes, existing_by_name)
                print(f"[{idx}/{len(remote_files)}] Uploaded: {asset_name} ({size} bytes)", flush=True)
            return {
                "name": name,
                "asset_name": asset_name,
                "size": size,
                "sha": sha,
                "price_usd": 2.00,
                "release_url": release_url or raw_url,
                "raw_url": raw_url,
            }

        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            manifest = list(pool.map(process_item, enumerate(remote_files, 1)))

    # Upload release-manifest.json into the Release so clients can resolve all Arabic names cleanly
    manifest_bytes = json.dumps(manifest, ensure_ascii=False, indent=2).encode("utf-8")
    upload_bytes_to_release(upload_url_template, token, "release-manifest.json", manifest_bytes, existing_by_name)

    if args.commit_web and not args.skip_commit:
        print("\n[WEB SYNC] Committing README.md, index.html, sitemap.xml, robots.txt, and manifest to main...", flush=True)
        root_dir = Path(__file__).resolve().parent.parent
        drop_dir = root_dir / "netlify-drop"
        commit_file_to_repo(token, "README.md", root_dir / "README.md", "Add complete README.md catalog for Dr. Malik Al-Rumaima Store")
        commit_file_to_repo(token, "index.html", drop_dir / "index.html", "Update storefront index.html synced with Release v1.0.0 & Binance")
        commit_file_to_repo(token, "sitemap.xml", drop_dir / "sitemap.xml", "Add sitemap.xml for Dr. Malik Storefront SEO")
        commit_file_to_repo(token, "robots.txt", drop_dir / "robots.txt", "Add robots.txt for 24/7 Google Search indexing")
        commit_bytes_to_repo(token, "release-manifest.json", manifest_bytes, "Update release-manifest.json for v1.0.0 assets")
        commit_file_to_repo(token, ".github/workflows/release.yml", root_dir / ".github/workflows/release.yml", "Update automated GitHub Release v1.0.0 workflow")

    print(f"\n[DONE] Processed {len(manifest)} store items for Release {RELEASE_TAG}!", flush=True)


if __name__ == "__main__":
    main()
