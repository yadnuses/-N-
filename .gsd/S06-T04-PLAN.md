<task id="S06-T04" type="auto">
  <name>搜索解锁与隐藏内容验证</name>

  <files>
    - intranet.html (fixes only)
    - archive.html (fixes only)
    - investigation.html (fixes only)
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given archive.html or the intranet global search bar is loaded
      When a known unlock keyword (e.g., "村长") is entered and searched
      Then the hidden record must be marked as unlocked and the search results must reflect the unlocked content
    </ac>
    <ac id="AC-2">
      Given a hidden record has been unlocked via search
      When the page is refreshed and localStorage is read
      Then the unlocked status must persist and the record remains accessible
    </ac>
    <ac id="AC-3">
      Given investigation.html is loaded after unlocking records
      When the investigation list or detail view is rendered
      Then all unlocked records must display their full content and locked records must remain hidden or masked
    </ac>
  </acceptance_criteria>

  <action>
    1. Review intranet.html and archive.html to identify the exact unlock keywords and the corresponding localStorage flags.
    2. In a browser, open archive.html and search for each known keyword one by one.
    3. Verify that after each search, localStorage "yunchu_save" is updated with the new unlocked flag.
    4. Repeat the same test in intranet.html's global search bar.
    5. Refresh the page and confirm unlocked flags persist.
    6. Open investigation.html and confirm unlocked records show full content while locked ones remain inaccessible.
    7. Fix any broken keyword matching, localStorage write failures, or display logic errors.
    8. Save test results to tools/test-unlock-result.txt.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - puzzle-*.html
    - index.html
    - Do not add new keywords or records — only verify existing ones
  </boundaries>

  <verify>Manual browser test of search unlock flow (AC-1, AC-2, AC-3)</verify>
  <done>Search-triggered unlock mechanism works, persists, and displays correctly in investigation.html.</done>
</task>
