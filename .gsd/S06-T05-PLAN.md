<task id="S06-T05" type="auto">
  <name>跨浏览器与基础适配检查</name>

  <files>
    - css/style.css (fixes only)
    - css/gov.css (fixes only)
    - css/intranet-pages.css (fixes only)
    - Any HTML files needing layout fixes
  </files>

  <acceptance_criteria>
    <ac id="AC-1">
      Given index.html and intranet.html are opened in Chrome, Safari, and Firefox
      When the pages render at desktop width (1280px)
      Then no major layout breaks, overlapping elements, or clipped text must be visible
    </ac>
    <ac id="AC-2">
      Given the core interactive elements (photo modal, email inline, chat choices, search bar)
      When clicked or hovered in each browser
      Then they must respond visually and functionally without errors
    </ac>
    <ac id="AC-3">
      Given the pages are viewed in a mobile viewport (375px width)
      When inspected in responsive/dev tools mode
      Then critical buttons must remain tappable and no severe overlapping must block interaction
    </ac>
  </acceptance_criteria>

  <action>
    1. Open index.html in Chrome, Safari, and Firefox at 1280px desktop width.
    2. Verify the scene container, photo modal, and email inline render correctly in each.
    3. Open intranet.html and verify the header, chat panel, and progress slider layout.
    4. Test the photo modal open/close, email expand, and a chat choice click in each browser.
    5. Use dev tools responsive mode (375px width) on index.html and intranet.html to check for severe mobile issues.
    6. Fix any CSS that causes critical layout breakage (e.g., missing vendor prefixes, flexbox quirks, fixed widths).
    7. Document findings and fixes in tools/test-browser-result.txt.
  </action>

  <boundaries>
    DO NOT CHANGE:
    - js/game.js (no browser-specific JS hacks unless absolutely necessary)
    - Puzzle logic files
  </boundaries>

  <verify>Visual inspection in Chrome, Safari, Firefox + mobile responsive mode (AC-1, AC-2, AC-3)</verify>
  <done>Core pages render and interact correctly across major desktop browsers and have basic mobile usability.</done>
</task>
