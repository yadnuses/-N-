# S06 — 整体 QA 与体验优化

## Overview
在发布前对《第N个观测者》进行全站系统性测试与体验打磨，确保所有页面可正常访问、谜题可解、剧情可完整通关，消除明显的交互阻塞与体验断层。

## Tasks

| Task | Name | Files | ACs |
|------|------|-------|-----|
| T01  | 全站链接与资源可用性检查 | tools/validate-links.py + HTML fixes | 4 |
| T02  | 序章到内网核心流程通测 | tools/test-core-flow.py + index/intranet/JS fixes | 3 |
| T03  | 谜题系统端到端验证 | 5 puzzle HTML files (fixes only) | 3 |
| T04  | 搜索解锁与隐藏内容验证 | intranet/archive/investigation HTML (fixes only) | 3 |
| T05  | 跨浏览器与基础适配检查 | CSS files + HTML layout fixes | 3 |
| T06  | 体验优化与收尾 | Any affected files + cleanup | 4 |

## All Acceptance Criteria

| AC | Task | Criterion |
|----|------|-----------|
| AC-1 | T01 | Given 35 HTML files, When scanned for internal links, Then all point to existing files |
| AC-2 | T01 | Given yunchu-gov.html notices/news, When inspected, Then all urls match existing detail pages |
| AC-3 | T01 | Given images/ directory, When image refs collected, Then all referenced images exist |
| AC-4 | T01 | Given HTML files load CSS/JS, When validated, Then all refs point to existing files |
| AC-1 | T02 | Given index.html loaded, When intro sequence clicked through, Then navigates to intranet.html without JS errors |
| AC-2 | T02 | Given intranet.html loaded, When chat advances, Then localStorage "yunchu_save" updates with chatProgress |
| AC-3 | T02 | Given chatProgress >= 8, When slider dragged back, Then chat panel switches to selected unlocked chapter |
| AC-1 | T03 | Given puzzle-origin.html loaded, When "128" entered, Then success feedback and navigation occur |
| AC-2 | T03 | Given puzzle-foer.html loaded, When tiles moved and undo clicked, Then state reverts correctly |
| AC-3 | T03 | Given any puzzle page loaded, When interacted, Then no JS errors and return link works |
| AC-1 | T04 | Given archive.html or intranet search, When unlock keyword searched, Then hidden record unlocks |
| AC-2 | T04 | Given hidden record unlocked, When page refreshed, Then unlocked status persists in localStorage |
| AC-3 | T04 | Given investigation.html loaded, When rendered, Then unlocked records show full content |
| AC-1 | T05 | Given index.html/intranet.html in Chrome/Safari/Firefox at 1280px, Then no major layout breaks |
| AC-2 | T05 | Given core interactive elements, When clicked/hovered in each browser, Then they respond correctly |
| AC-3 | T05 | Given mobile viewport (375px), When inspected, Then buttons remain tappable and no severe overlap |
| AC-1 | T06 | Given T01–T05 issues, When fixes applied, Then all blocking bugs resolved |
| AC-2 | T06 | Given buttons/links, When hovered/focused, Then clear visual state change occurs |
| AC-3 | T06 | Given JS and inline scripts, When scanned, Then no leftover console.log or debug code remains |
| AC-4 | T06 | Given index.html photo modal opened, Then placeholder text absent and actual image renders cleanly |

## Boundaries
- DO NOT CHANGE: js/game.js logic in T01
- DO NOT CHANGE: css/style.css in T02
- DO NOT CHANGE: intranet.html, index.html in T03 (read-only)
- DO NOT CHANGE: puzzle-*.html, index.html in T04
- DO NOT CHANGE: js/game.js in T05 (no browser hacks unless necessary)
- DO NOT ADD new features or content in T06

## Dependencies
T01 → T02 → T03 → T04 → T05 → T06
