#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Playwright test for S06-T02:
- index.html intro sequence
- intranet.html save/load & slider backtrack
"""

import json
import sys
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8888"
RESULT_FILE = "tools/test-core-flow-result.txt"


def log(msg):
    print(msg)
    with open(RESULT_FILE, "a", encoding="utf-8") as f:
        f.write(msg + "\n")


def main():
    with open(RESULT_FILE, "w", encoding="utf-8") as f:
        f.write("S06-T02 Core Flow Test Started\n")

    errors = []
    ac1_pass = False
    ac2_pass = False
    ac3_pass = False

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1280, "height": 800})
        page = context.new_page()

        def on_error(err):
            msg = str(err)
            errors.append(msg)
            log(f"[JS ERROR] {msg}")

        page.on("pageerror", on_error)
        page.on("console", lambda msg: log(f"[CONSOLE {msg.type}] {msg.text}") if msg.type == "error" else None)

        # ============================================================
        # AC-1: index.html intro -> navigate to intranet.html
        # ============================================================
        log("\n=== AC-1: index.html intro sequence ===")
        try:
            page.goto(f"{BASE_URL}/index.html")
            page.wait_for_load_state("networkidle")

            # Step 0 -> next
            page.locator("#next-btn").wait_for(state="visible", timeout=10000)
            page.locator("#next-btn").click()

            # Step 1 -> click camera
            page.locator("#item-camera").wait_for(state="visible", timeout=10000)
            page.locator("#item-camera").click()

            # Wait for photo-1 active and click
            page.wait_for_selector("#photo-slot-1.active", timeout=10000)
            page.locator("#photo-slot-1").click()

            # Modal open -> close
            page.wait_for_selector("#photo-modal.show", timeout=10000)
            page.locator("#modal-close-btn").click()

            # Next through steps 3, 4, 5
            for _ in range(3):
                page.locator("#next-btn").wait_for(state="visible", timeout=10000)
                page.locator("#next-btn").click()

            # Search
            page.wait_for_selector("#search-box-1.visible", timeout=10000)
            page.locator("#search-input").fill("云处村")
            page.locator("#search-btn").click()
            page.wait_for_selector("#search-result .search-result-item", timeout=10000)

            # Wait for hidden text then next
            page.wait_for_selector("#search-result .hidden-text", timeout=15000)
            page.locator("#next-btn").wait_for(state="visible", timeout=10000)
            page.locator("#next-btn").click()

            # Email toast
            page.wait_for_selector("#email-toast.show", timeout=10000)
            page.locator("#email-toast-open").click()

            # Inline email -> confirm
            page.wait_for_selector("#email-inline.show", timeout=10000)
            page.locator("#email-confirm-btn").click()

            # Photo 2
            page.wait_for_selector("#photo-slot-2.active", timeout=10000)
            page.locator("#photo-slot-2").click()
            page.wait_for_selector("#photo-modal.show", timeout=10000)
            page.locator("#modal-close-btn").click()

            # Final next -> end
            page.locator("#next-btn").wait_for(state="visible", timeout=10000)
            page.locator("#next-btn").click()

            # Wait for explore button
            page.wait_for_selector("#explore-btn", timeout=10000)

            # Navigate to intranet
            page.goto(f"{BASE_URL}/intranet.html")
            page.wait_for_load_state("networkidle")

            if errors:
                log(f"AC-1: JS errors observed: {errors}")
            else:
                log("AC-1: Intro sequence completed without JS errors.")
            ac1_pass = True
        except Exception as e:
            log(f"AC-1 FAIL: {e}")
            ac1_pass = False

        # ============================================================
        # AC-2: intranet save / load
        # ============================================================
        log("\n=== AC-2: intranet save/load ===")
        try:
            # Ensure clean state
            page.evaluate("localStorage.removeItem('yunchu_save')")
            page.reload()
            page.wait_for_load_state("networkidle")

            # Wait for toast and start chat
            page.wait_for_selector("#msg-toast.show", timeout=10000)
            page.locator("#msg-toast").click()
            page.wait_for_selector("#panel-chat.active", timeout=10000)

            def click_choice(text):
                btn = page.locator("#choice-row").get_by_text(text, exact=False)
                btn.wait_for(state="visible", timeout=20000)
                btn.click()

            # Advance through Act1 choices
            click_choice("你们到底在说什么")
            click_choice("你怎么知道")
            click_choice("拯救")
            click_choice("什么目标")
            click_choice("被困在时间里的人")

            # Back to home -> map -> continue map chat
            page.locator("#panel-chat .chat-back-btn").click()
            page.wait_for_selector("#panel-home.active", timeout=10000)
            page.locator("#card-map").click()
            page.wait_for_selector("#panel-map.active", timeout=10000)
            page.locator("#map-continue-btn").click()
            page.wait_for_selector("#panel-chat.active", timeout=10000)

            # Advance map chat to >= 8 (starts at 8, choice pushes to 9/10/11)
            click_choice("时间循环")
            click_choice("什么孩子")

            # Verify localStorage
            save_raw = page.evaluate("() => localStorage.getItem('yunchu_save')")
            save = json.loads(save_raw or "{}")
            log(f"localStorage yunchu_save: {json.dumps(save, ensure_ascii=False)}")
            cp = save.get("chatProgress", 0)
            if cp >= 8:
                log(f"AC-2: chatProgress = {cp} (>= 8) saved correctly.")
            else:
                raise AssertionError(f"chatProgress too low: {cp}")

            # Refresh and resume
            page.reload()
            page.wait_for_load_state("networkidle")
            page.locator("#card-chat").click()
            page.wait_for_selector("#panel-chat.active", timeout=10000)

            chat_text = page.locator("#chat-messages").inner_text()
            if "云处村是一个畲族村落" not in chat_text:
                raise AssertionError("Chat did not resume after refresh")
            log("AC-2: Chat resumed correctly after refresh.")
            ac2_pass = True
        except Exception as e:
            log(f"AC-2 FAIL: {e}")
            ac2_pass = False

        # ============================================================
        # AC-3: slider backtrack
        # ============================================================
        log("\n=== AC-3: slider backtrack ===")
        try:
            # Go back to home so slider is visible
            page.locator("#panel-chat .chat-back-btn").click()
            page.wait_for_selector("#panel-home.active", timeout=10000)
            page.wait_for_selector("#progress-bar-wrap.visible", timeout=10000)

            track = page.locator("#progress-slider-track")
            thumb = page.locator("#progress-slider-thumb")
            track.wait_for(state="visible", timeout=10000)
            thumb.wait_for(state="visible", timeout=10000)

            tb = track.bounding_box()
            hb = thumb.bounding_box()
            if not tb or not hb:
                raise RuntimeError("Could not get slider bounding boxes")

            # Drag thumb to ~50% of track height (Act1 when maxActIdx=2)
            start_x = hb["x"] + hb["width"] / 2
            start_y = hb["y"] + hb["height"] / 2
            target_x = start_x
            target_y = tb["y"] + tb["height"] * 0.5

            page.mouse.move(start_x, start_y)
            page.mouse.down()
            page.mouse.move(target_x, target_y)
            page.mouse.up()

            # Wait for log panel to become active
            page.wait_for_selector("#panel-log.active", timeout=10000)

            log_text = page.locator("#log-messages").inner_text()
            if "你终于来了" not in log_text:
                raise AssertionError("Slider backtrack did not restore chapter 1 content")
            log("AC-3: Slider drag switched to panel-log and restored chapter 1.")
            ac3_pass = True
        except Exception as e:
            log(f"AC-3 FAIL: {e}")
            ac3_pass = False

        browser.close()

    # ============================================================
    # Summary
    # ============================================================
    log("\n=== Summary ===")
    log(f"AC-1: {'PASS' if ac1_pass else 'FAIL'}")
    log(f"AC-2: {'PASS' if ac2_pass else 'FAIL'}")
    log(f"AC-3: {'PASS' if ac3_pass else 'FAIL'}")

    if not (ac1_pass and ac2_pass and ac3_pass):
        sys.exit(1)


if __name__ == "__main__":
    main()
