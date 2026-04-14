# Decisions

## Ideation

- **项目定位**：静态 HTML/CSS/JS 叙事解谜游戏，无需后端，本地 Python HTTP Server 即可运行。
- **技术栈**：纯前端（ES5 兼容），localStorage 持久化，无框架依赖。
- **核心交互模式**：通过 `chatProgress`（0-23）+ 多个 boolean flag 驱动 9 幕剧情，面板切换由 `switchPanel()` 统一管理。
- **存档机制**：localStorage `yunchu_save` 保存所有进度，支持进度条回溯和场景回放。
- **解锁设计**：村长、阿婆、铁匠等隐藏调查记录需要通过内网全局搜索后才能解锁，增强探索感。

## S06 — 整体 QA 与体验优化

- **puzzle-origin.html 脚本解析问题**：针对 Chromium 内联脚本 "Invalid or unexpected token" 错误，采用外部脚本方案（提取为 `js/puzzle-origin.js`），而非继续调试 HTML 解析器根因。
- **过时 AC 的兼容处理**：T03/T04 中部分计划描述的谜题形态（密码锁 128、拼图撤销）与实际页面实现不符，按实际机制验证并保持验收目标不变。
