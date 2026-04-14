<task id="S06-T01" type="auto">
  <name>全站链接与资源可用性检查</name>

  <files>
    - tools/validate-links.py (new)
    - Any .html files with broken links (to be fixed)
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given the project root contains 35 HTML files
      When the validation script scans all href/src/url references
      Then every internal link must point to an existing file on disk
    </ac>
    <ac id="AC-2">
      Given yunchu-gov.html renders a list of notices and news
      When each notice and news card is inspected
      Then every url field must match an existing notice-*.html or news-*.html file
    </ac>
    <ac id="AC-3">
      Given the images/ directory exists
      When all image references in HTML and CSS are collected
      Then every referenced image file must exist in images/ or a subdirectory
    </ac>
    <ac id="AC-4">
      Given each HTML file loads external stylesheets and scripts
      When CSS and JS references are validated
      Then every css/*.css and js/*.js reference must point to an existing file
    </ac>
  </acceptance_criteria>

  <action>
    1. Create tools/validate-links.py that recursively scans all *.html for href/src attributes and all css/*.css for url() references.
    2. Exclude external URLs (http/https/mailto/tel/#anchors) and verify all internal paths exist relative to project root.
    3. Run the script and capture output.
    4. If any broken links are found, fix the referencing HTML/CSS file (e.g., typo in filename, wrong path).
    5. Re-run the script until it reports zero missing references.
    6. Save the script output to tools/validate-links-result.txt as evidence.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - js/game.js (logic-only, not related to link fixing)
    - No functional behavior changes beyond correcting broken references
  </boundaries>

  <verify>python3 tools/validate-links.py (AC-1, AC-2, AC-3, AC-4)</verify>
  <done>All internal links, images, CSS, and JS references are validated and zero broken links remain.</done>
</task>
