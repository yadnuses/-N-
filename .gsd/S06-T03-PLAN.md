<task id="S06-T03" type="auto">
  <name>谜题系统端到端验证</name>

  <files>
    - puzzle-chief.html (fixes only)
    - puzzle-foer.html (fixes only)
    - puzzle-shadow.html (fixes only)
    - puzzle-pilot.html (fixes only)
    - puzzle-origin.html (fixes only)
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given puzzle-origin.html (时间胶囊密码锁) is loaded
      When the player enters "128" and confirms
      Then the page must show success feedback and navigate to the next relevant page
    </ac>
    <ac id="AC-2">
      Given puzzle-foer.html (山哈哈乐园拼图) is loaded
      When tiles are clicked/dragged and the "撤销上一步" button is used
      Then the puzzle state must update correctly and the undo function must restore the previous state
    </ac>
    <ac id="AC-3">
      Given any of the 5 puzzle pages is loaded
      When the page finishes loading and the player interacts with its core mechanic
      Then no JavaScript error must appear in the console and a return-to-hub link must be functional
    </ac>
  </acceptance_criteria>

  <action>
    1. Open each puzzle page in a browser via the local HTTP server.
    2. On puzzle-origin.html, input "128" and verify the success transition.
    3. On puzzle-foer.html, perform a few tile moves, click "撤销上一步", and verify state reversion.
    4. On puzzle-chief.html, puzzle-shadow.html, and puzzle-pilot.html, verify their primary interaction loads without console errors and the main action completes.
    5. Check that each page has a working "返回" or navigation link back to intranet.html or the relevant hub.
    6. Fix any broken JS references, missing DOM elements, or incorrect logic.
    7. Save evidence of each puzzle test to tools/test-puzzles-result.txt.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - intranet.html (only read for navigation context)
    - index.html
    - No puzzle logic redesign — only fix broken implementations
  </boundaries>

  <verify>Manual browser test of all 5 puzzle pages (AC-1, AC-2, AC-3)</verify>
  <done>All 5 puzzle pages are verified to load, interact, and complete without errors.</done>
</task>
