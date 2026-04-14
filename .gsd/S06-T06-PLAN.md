<task id="S06-T06" type="auto">
  <name>体验优化与收尾</name>

  <files>
    - Any HTML/CSS/JS files with blocking bugs found in T01–T05
    - js/game.js (cleanup)
    - intranet.html (cleanup)
    - index.html (cleanup)
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given the issues collected from T01 through T05
      When fixes are applied
      Then all blocking-level bugs (crashes, broken links, unreadable layouts, impossible progression) must be resolved
    </ac>
    <ac id="AC-2">
      Given primary interactive buttons and links across the site
      When hovered or focused
      Then they must show a clear visual state change (e.g., color shift, shadow, cursor pointer)
    </ac>
    <ac id="AC-3">
      Given the JavaScript files and inline scripts
      When scanned for debugging artifacts
      Then no leftover console.log, alert, or dead test code must remain in the production-facing files
    </ac>
    <ac id="AC-4">
      Given index.html photo modal is opened
      When the photo is displayed
      Then the placeholder text must not appear and the actual image must render cleanly
    </ac>
  </acceptance_criteria>

  <action>
    1. Compile all blocking issues found in T01–T05 and prioritize fixes.
    2. Apply the minimal necessary fixes to each affected file.
    3. Add or improve hover/focus visual feedback on critical buttons and links in CSS.
    4. Run grep for "console.log", "alert(", "debugger", and "TODO" in *.html, js/*.js, and css/*.css; remove or comment out any debug artifacts.
    5. Verify index.html photo modal no longer shows placeholder text and photo-1.png / photo-2.png display correctly.
    6. Re-run tools/validate-links.py to confirm no regressions.
    7. Do a final sanity check on index.html → intranet.html flow.
    8. Save a summary of all changes to tools/s06-polish-summary.txt.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - No new features or content additions
    - No redesign of puzzle mechanics
  </boundaries>

  <verify>Re-run link validator + manual final check (AC-1, AC-2, AC-3, AC-4)</verify>
  <done>All blocking bugs are fixed, visual feedback is improved, debug code is cleaned, and the site is polished for release.</done>
</task>
