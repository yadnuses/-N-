<task id="S06-T02" type="auto">
  <name>序章到内网核心流程通测</name>

  <files>
    - tools/test-core-flow.py (new)
    - index.html (fixes only)
    - intranet.html (fixes only)
    - js/game.js (fixes only)
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given index.html is loaded in a browser
      When the player clicks through the intro sequence (camera → photo-1 → close → next → photo-2 → close → search "云处村" → 查看邮件)
      Then the page must navigate to intranet.html without JavaScript errors blocking progression
    </ac>
    <ac id="AC-2">
      Given intranet.html is loaded
      When chat messages advance and the player interacts with choices
      Then localStorage key "yunchu_save" must update to reflect the latest chatProgress
    </ac>
    <ac id="AC-3">
      Given intranet.html has progressed to at least chatProgress 8
      When the player drags the right-side slider to an earlier chapter and releases
      Then the chat panel must switch to the selected unlocked chapter and restore its state correctly
    </ac>
  </acceptance_criteria>

  <action>
    1. Start a local HTTP server (e.g., python3 -m http.server 8080) in the project root.
    2. Use Playwright or the browse skill to open http://localhost:8080/index.html.
    3. Manually or via script step through: click "继续" → click photo-1 → click "收起照片" → click "继续" → click photo-2 → click "收起照片" → type "云处村" in search → click "搜索" → click "查看" on email toast → click "我知道了" → click the yunchu-gov search result → navigate to intranet.html.
    4. In intranet.html, advance a few chat messages and verify localStorage "yunchu_save" exists and contains chatProgress.
    5. Refresh the page and confirm the chat resumes at the saved progress.
    6. Use the right-side slider to jump back to chapter 1 and confirm the panel switches and content is restored.
    7. Document any blocking JS errors or broken interactions, and fix them in the relevant file.
    8. Save test evidence to tools/test-core-flow-result.txt.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - css/style.css (visual-only, not flow logic)
    - Any puzzle HTML files
  </boundaries>

  <verify>python3 tools/test-core-flow.py or manual test log review (AC-1, AC-2, AC-3)</verify>
  <done>The core intro-to-intranet flow is fully playable and save/load/backtrack works correctly.</done>
</task>
