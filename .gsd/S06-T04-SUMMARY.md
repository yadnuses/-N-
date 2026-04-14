# S06/T04 — 搜索解锁与隐藏内容验证

## Status
complete

## What Was Done
- 使用 Playwright 对 intranet.html 的全局搜索、news.html、logs.html 和 archive.html 的解锁机制进行了端到端测试
- 验证了搜索关键词（"村长"、"阿婆"、"雷铁山"）点击后会在 localStorage `searchUnlocked` 中正确写入对应标志（chief / apo / smith）
- 验证了刷新页面后解锁状态持久保存
- 验证了 news.html 和 logs.html 会根据 `searchUnlocked` 正确显示/隐藏对应的隐藏内容区块
- 验证了 archive.html 的访问码（20260003000）能正确触发认证覆盖层动画
- 测试过程中未发现问题，无需修改源代码

## Files Changed
- `tools/test-unlock-result.txt` — 新增测试证据
- `tools/test-unlock-result.json` — 新增测试证据（机器可读）
- 无源代码修改

## Acceptance Criteria Results

| AC | Status | Evidence |
|----|--------|----------|
| AC-1 | Pass ✓ | intranet.html 搜索"村长"后点击结果，localStorage `searchUnlocked.chief` 变为 true |
| AC-2 | Pass ✓ | 刷新页面后 `searchUnlocked.chief` 仍然为 true，持久化正常 |
| AC-3 | Pass ✓ | news.html 和 logs.html 在解锁后正确显示对应隐藏内容，未解锁内容保持隐藏 |

## Decisions Made
- 计划要求测试 archive.html 的搜索解锁，实际测试发现 archive.html 采用访问码机制（20260003000）而非关键词搜索解锁；已按实际机制验证并通过。
- 未修改任何源代码，因为所有解锁链路在正确配置的服务器环境下均正常工作。

## Issues
- 最初测试时因 dev server 指向旧目录导致部分页面表现异常；T03 中已修复并验证。
