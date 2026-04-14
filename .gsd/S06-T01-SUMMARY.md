# S06/T01 — 全站链接与资源可用性检查

## Status
complete

## What Was Done
- 创建 `tools/validate-links.py`，递归扫描所有 HTML 的 `href`/`src`/`url()` 引用以及 CSS 的 `url()` 引用。
- 排除外部链接（http/https/mailto/tel/#anchor），将所有内部引用与磁盘实际文件进行比对。
- 运行脚本并验证：36 个 HTML 文件、4 个 CSS 文件、1 个 JS 文件共产生 178 条唯一内部引用。
- 结果：零条失效引用，所有内部链接、图片、CSS、JS 引用均指向存在的文件。
- 将运行结果保存至 `tools/validate-links-result.txt` 作为验收证据。

## Files Changed
- `tools/validate-links.py`: 新增全站链接与资源可用性检查脚本
- `tools/validate-links-result.txt`: 保存脚本运行结果（178 条引用全部通过）

## Acceptance Criteria Results

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 | Pass | 扫描了 36 个 HTML 文件（含 178 条唯一内部引用），零条失效 |
| AC-2 | Pass | yunchu-gov.html 中的 11 条 notice-*.html / news-*.html 内链均指向存在的文件 |
| AC-3 | Pass | 所有 images/ 及其子目录中的图片引用（7 张唯一图片）均存在于磁盘 |
| AC-4 | Pass | css/*.css（4 个文件）和 js/*.js（1 个文件）引用均验证通过 |

## Decisions Made
None — implemented as planned.

## Issues
None.
