## Research for S06

### Codebase State
- 35 HTML files (~25,000 lines total), 4 CSS files, 2 JS files
- `intranet.html` is the largest file at 320KB / 7,901 lines — contains the full chat system, 9 chapters, search logic, and localStorage persistence
- `village.html` is 179KB / 4,513 lines — likely an older or alternative version
- All internal references (href/src and CSS url()) have been verified to point to existing files
- No missing images or dead internal links detected by automated scan

### Relevant Interfaces
- **Save system**: `localStorage.getItem('yunchu_save')` / `localStorage.setItem('yunchu_save', ...)` in `intranet.html`
- **Progress driver**: `chatProgress` (0-23), `maxProgress`, `setChatProgress()`
- **Panel switching**: `switchPanel()` in `intranet.html`
- **Search unlock**: `searchData` array and `unlockHiddenRecord()` in `intranet.html`
- **Puzzle navigation**: standalone HTML pages (`puzzle-*.html`) with inline JS

### Dependencies
- Pure static frontend, no build tools, no npm packages
- Can be served with any static file server (`python3 -m http.server`)
- No external runtime dependencies except Google Fonts CDN

### Recommendations
- Use Python scripts for automated link/image reference validation
- Use headless browser (Playwright) for interactive flow testing where possible
- For manual QA tasks, define clear step-by-step verification procedures
- Focus T06 on aggregating and fixing all issues found in T01-T05
