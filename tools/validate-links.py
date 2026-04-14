#!/usr/bin/env python3
"""Validate all internal links, images, CSS, and JS references in the project."""

import os
import re
from pathlib import Path
from urllib.parse import urlparse

PROJECT_ROOT = Path(__file__).resolve().parent.parent

EXCLUDED_SCHEMES = {"http", "https", "mailto", "tel", "javascript", "data"}
IGNORED_EXTS = {".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".otf", ".mp3", ".mp4", ".ogg", ".webm"}


def is_external(url):
    """Return True if URL is external or should be skipped."""
    if not url or url.startswith("#") or url.startswith("//"):
        return True
    parsed = urlparse(url)
    if parsed.scheme in EXCLUDED_SCHEMES:
        return True
    return False


def normalize_path(base_dir, href):
    """Resolve a relative href/src to an absolute project path."""
    if href.startswith("/"):
        return PROJECT_ROOT / href.lstrip("/")
    return (base_dir / href).resolve()


def scan_html():
    """Yield (file, url, kind) for all internal references in HTML files."""
    html_files = sorted(PROJECT_ROOT.rglob("*.html"))
    for html_path in html_files:
        text = html_path.read_text(encoding="utf-8", errors="ignore")
        base_dir = html_path.parent

        # href attributes
        for m in re.finditer(r'href=["\']([^"\']+)["\']', text, re.IGNORECASE):
            url = m.group(1).strip()
            if not is_external(url):
                yield html_path, url, "href"

        # src attributes
        for m in re.finditer(r'src=["\']([^"\']+)["\']', text, re.IGNORECASE):
            url = m.group(1).strip()
            if not is_external(url):
                yield html_path, url, "src"

        # url() in inline styles
        for m in re.finditer(r'url\(["\']?([^"\')\s]+)["\']?\)', text, re.IGNORECASE):
            url = m.group(1).strip()
            if not is_external(url):
                yield html_path, url, "url()"


def scan_css():
    """Yield (file, url) for all url() references in CSS files."""
    css_files = sorted((PROJECT_ROOT / "css").rglob("*.css")) if (PROJECT_ROOT / "css").exists() else []
    for css_path in css_files:
        text = css_path.read_text(encoding="utf-8", errors="ignore")
        base_dir = css_path.parent
        for m in re.finditer(r'url\(["\']?([^"\')\s]+)["\']?\)', text, re.IGNORECASE):
            url = m.group(1).strip()
            if not is_external(url):
                yield css_path, url, "url()"


def check_yunchu_gov():
    """Special check for yunchu-gov.html: notice/news urls must match existing files."""
    gov_path = PROJECT_ROOT / "yunchu-gov.html"
    if not gov_path.exists():
        return
    text = gov_path.read_text(encoding="utf-8", errors="ignore")
    # Look for url fields in JS arrays
    for m in re.finditer(r'url\s*:\s*["\']([^"\']+)["\']', text):
        url = m.group(1).strip()
        if not is_external(url):
            yield gov_path, url, "gov-url"


def main():
    missing = []
    checked = set()

    for source, url, kind in list(scan_html()) + list(scan_css()) + list(check_yunchu_gov()):
        target = normalize_path(source.parent, url)
        key = (source, url, kind)
        if key in checked:
            continue
        checked.add(key)
        if not target.exists():
            missing.append((str(source.relative_to(PROJECT_ROOT)), url, kind))

    total_checked = len(checked)

    print(f"Checked {total_checked} unique internal references.")
    if missing:
        print(f"MISSING: {len(missing)} broken references found:")
        for source, url, kind in sorted(missing):
            print(f"  [{kind}] {source} -> {url}")
        return 1
    else:
        print("All internal references are valid.")
        return 0


if __name__ == "__main__":
    exit(main())
