#!/usr/bin/env python3
"""
S06-T03 谜题系统端到端验证脚本
使用 Playwright 测试 5 个谜题页面：
- puzzle-origin.html
- puzzle-foer.html
- puzzle-chief.html
- puzzle-shadow.html
- puzzle-pilot.html
"""
import json, sys
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:8080"
RESULTS = []


def log(msg):
    print(msg)
    RESULTS.append(msg)


def test_page_console_errors(page, url):
    """测试页面加载时是否有 console errors"""
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.goto(url, wait_until="networkidle")
    # 给一点脚本执行时间
    page.wait_for_timeout(1000)
    return errors


def test_puzzle_origin(browser):
    """测试 puzzle-origin.html"""
    log("\n=== Testing puzzle-origin.html ===")
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # 预先解锁所有线索以便测试验证功能
    page.goto(f"{BASE_URL}/puzzle-origin.html")
    page.evaluate("""
        var save = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
        save.clues = save.clues || {};
        save.clues.origin = {
            '5-A': true, '5-B': true, '5-C': true, '5-D': true
        };
        localStorage.setItem('yunchu_save', JSON.stringify(save));
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(800)

    # 检查 console errors
    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    # 选择正确答案并提交
    page.click("input#q1-B")
    page.click("input#q2-B")
    page.click("input#q3-C")
    page.click("button[onclick='submitAnswer()']")
    page.wait_for_timeout(500)

    # 检查成功反馈
    feedback = page.inner_text("#validation-feedback")
    success = "✓ 最终验证通过" in feedback

    # 检查导航链接
    has_nav = page.is_visible("a[href='investigation.html']")

    log(f"Console errors: {errors}")
    log(f"Success feedback: {success}")
    log(f"Nav link present: {has_nav}")

    context.close()
    return {"page": "puzzle-origin.html", "errors": errors, "success": success, "nav": has_nav}


def test_puzzle_foer(browser):
    """测试 puzzle-foer.html"""
    log("\n=== Testing puzzle-foer.html ===")
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # 预先解锁所有线索
    page.goto(f"{BASE_URL}/puzzle-foer.html")
    page.evaluate("""
        var save = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
        save.clues = save.clues || {};
        save.clues.foer = {
            '2-A': true, '2-B': true, '2-C': true, '2-D': true
        };
        localStorage.setItem('yunchu_save', JSON.stringify(save));
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(800)

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    # 测试图像选择（核心交互）
    page.click("#img-left")
    page.click("#img-right")
    page.wait_for_timeout(300)

    # 检查对比按钮是否可用
    btn_text = page.inner_text("#compare-btn")
    btn_enabled = page.is_enabled("#compare-btn")
    log(f"Compare button text after selection: {btn_text}")
    log(f"Compare button enabled: {btn_enabled}")

    # 执行对比
    if btn_enabled:
        page.click("#compare-btn")
        page.wait_for_timeout(500)
        result_visible = page.is_visible("#compare-result")
        log(f"Compare result visible: {result_visible}")
    else:
        result_visible = False

    # 选择正确答案 B
    page.click("input#option-B")
    page.click("button[onclick='submitAnswer()']")
    page.wait_for_timeout(500)

    feedback = page.inner_text("#validation-feedback")
    success = "✓ 验证通过" in feedback

    has_nav = page.is_visible("a[href='investigation.html']")

    log(f"Console errors: {errors}")
    log(f"Success feedback: {success}")
    log(f"Nav link present: {has_nav}")

    context.close()
    return {"page": "puzzle-foer.html", "errors": errors, "compare_works": btn_enabled and result_visible,
            "success": success, "nav": has_nav}


def test_puzzle_chief(browser):
    """测试 puzzle-chief.html"""
    log("\n=== Testing puzzle-chief.html ===")
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # 预先解锁所有线索
    page.goto(f"{BASE_URL}/puzzle-chief.html")
    page.evaluate("""
        var save = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
        save.clues = save.clues || {};
        save.clues.chief = {
            '1-A': true, '1-B': true, '1-C': true
        };
        localStorage.setItem('yunchu_save', JSON.stringify(save));
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(800)

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    # 输入答案
    page.fill("#validation-answer", "村长就是老人")
    page.click("button[onclick='submitAnswer()']")
    page.wait_for_timeout(500)

    feedback = page.inner_text("#validation-feedback")
    success = "✓ 验证通过" in feedback

    has_nav = page.is_visible("a[href='investigation.html']")

    log(f"Console errors: {errors}")
    log(f"Success feedback: {success}")
    log(f"Nav link present: {has_nav}")

    context.close()
    return {"page": "puzzle-chief.html", "errors": errors, "success": success, "nav": has_nav}


def test_puzzle_shadow(browser):
    """测试 puzzle-shadow.html"""
    log("\n=== Testing puzzle-shadow.html ===")
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # 预先解锁所有线索并标记文档已解密
    page.goto(f"{BASE_URL}/puzzle-shadow.html")
    page.evaluate("""
        var save = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
        save.clues = save.clues || {};
        save.clues.shadow = {
            '3-A': true, '3-B': true, '3-C': true, '3-D': true, '3-E': true
        };
        save.doc3EUnlocked = true;
        localStorage.setItem('yunchu_save', JSON.stringify(save));
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(800)

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    # 测试密码解密交互（即使已解锁也应无错）
    # 选择正确答案 B B B
    page.click("input#q1-B")
    page.click("input#q2-B")
    page.click("input#q3-B")
    page.click("button[onclick='submitAnswer()']")
    page.wait_for_timeout(500)

    feedback = page.inner_text("#validation-feedback")
    success = "✓ 完全正确" in feedback

    has_nav = page.is_visible("a[href='investigation.html']")

    log(f"Console errors: {errors}")
    log(f"Success feedback: {success}")
    log(f"Nav link present: {has_nav}")

    context.close()
    return {"page": "puzzle-shadow.html", "errors": errors, "success": success, "nav": has_nav}


def test_puzzle_pilot(browser):
    """测试 puzzle-pilot.html"""
    log("\n=== Testing puzzle-pilot.html ===")
    context = browser.new_context(viewport={"width": 1280, "height": 800})
    page = context.new_page()

    # 预先解锁所有线索
    page.goto(f"{BASE_URL}/puzzle-pilot.html")
    page.evaluate("""
        var save = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
        save.clues = save.clues || {};
        save.clues.pilot = {
            '4-A': true, '4-B': true, '4-C': true
        };
        localStorage.setItem('yunchu_save', JSON.stringify(save));
    """)
    page.reload(wait_until="networkidle")
    page.wait_for_timeout(800)

    errors = []
    page.on("pageerror", lambda err: errors.append(str(err)))

    # 输入答案
    page.fill("#validation-answer", "时间锚点")
    page.click("button[onclick='submitAnswer()']")
    page.wait_for_timeout(500)

    feedback = page.inner_text("#validation-feedback")
    success = "✓ 验证通过" in feedback

    has_nav = page.is_visible("a[href='investigation.html']")

    log(f"Console errors: {errors}")
    log(f"Success feedback: {success}")
    log(f"Nav link present: {has_nav}")

    context.close()
    return {"page": "puzzle-pilot.html", "errors": errors, "success": success, "nav": has_nav}


def main():
    log("S06-T03 Puzzle System End-to-End Test")
    log(f"Base URL: {BASE_URL}")

    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch()

        results.append(test_puzzle_origin(browser))
        results.append(test_puzzle_foer(browser))
        results.append(test_puzzle_chief(browser))
        results.append(test_puzzle_shadow(browser))
        results.append(test_puzzle_pilot(browser))

        browser.close()

    # 汇总
    all_pass = all(r.get("success") and r.get("nav") and not r.get("errors") for r in results)
    log("\n=== Summary ===")
    for r in results:
        status = "PASS" if r.get("success") and r.get("nav") and not r.get("errors") else "FAIL"
        log(f"{r['page']}: {status}")
    log(f"\nOverall: {'PASS' if all_pass else 'FAIL'}")

    # 保存结构化结果
    with open("tools/test-puzzles-result.json", "w", encoding="utf-8") as f:
        json.dump({"results": results, "overall_pass": all_pass}, f, ensure_ascii=False, indent=2)

    # 保存文本结果
    with open("tools/test-puzzles-result.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(RESULTS))

    sys.exit(0 if all_pass else 1)


if __name__ == "__main__":
    main()
