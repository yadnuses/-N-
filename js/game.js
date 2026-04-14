/* 《第N个观测者》游戏脚本 - 第一幕 */

// ===== 工具函数 =====

function show(el) {
  if (!el) return;
  el.classList.add('visible');
}

function delay(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

function screenFlash() {
  // 白屏闪光效果已移除
}

function shakeScene() {
  var container = document.getElementById('scene-container');
  container.classList.add('shake');
  setTimeout(function() { container.classList.remove('shake'); }, 400);
}

function addPanel(text, type) {
  var div = document.createElement('div');
  div.className = 'narration-panel ' + (type || 'normal');
  var p = document.createElement('p');
  p.style.whiteSpace = 'pre-line';
  p.textContent = text;
  div.appendChild(p);
  document.getElementById('panels').appendChild(div);
  setTimeout(function() { div.classList.add('visible'); }, 30);
  return div;
}

function showNextBtn() {
  var btn = document.getElementById('next-btn');
  btn.classList.add('show');
  setTimeout(function() {
    document.getElementById('camera-row').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 100);
}

// ===== 游戏状态 =====
var gameState = {
  phase: 'intro',   // 当前阶段，用字符串而非数字，更直观
  step: 0
};

// ===== 初始化 =====
window.onload = function() {
  document.getElementById('next-btn').addEventListener('click', onNextBtn);

  // 绑定相机点击（初始不响应，等激活后响应）
  document.getElementById('item-camera').addEventListener('click', onCameraClick);

  // 绑定照片槽点击
  document.getElementById('photo-slot-1').addEventListener('click', onPhoto1Click);
  document.getElementById('photo-slot-2').addEventListener('click', onPhoto2Click);

  // 启动
  runStep0();
};

// ===== 阶段推进 =====

function onNextBtn() {
  document.getElementById('next-btn').classList.remove('show');
  gameState.step++;
  runCurrentStep();
}

function runCurrentStep() {
  var s = gameState.step;
  if (s === 1) runStep1_showCamera();
  else if (s === 2) runStep2_afterFilm();
  else if (s === 3) runStep3_monologue1();
  else if (s === 4) runStep4_phoneAlbum();
  else if (s === 5) runStep5_searchYunchu();
  else if (s === 6) runStep6_email();
  else if (s === 7) runStep7_afterEmail();
  else if (s === 8) runStep8_photo2();
  else if (s === 9) runStep9_end();
}

// ===== 步骤0：开场 =====
function runStep0() {
  gameState.step = 0;
  delay(500).then(function() {
    addPanel('你刚刚从二手平台收到一个快递。\n\n桌上，是一台80年代的胶片相机，机身有明显的使用痕迹。旁边放着一叠刚从冲洗店取回来的照片。\n\n窗外，城市的夜景安静地延伸，偶尔传来汽车鸣笛声。', 'normal');
    return delay(400);
  }).then(function() {
    showNextBtn();
  });
}

// ===== 步骤1：显示相机，等待点击 =====
function runStep1_showCamera() {
  gameState.phase = 'wait_camera';
  var cam = document.getElementById('item-camera');
  cam.classList.add('visible');
  cam.style.cursor = 'pointer';
  addPanel('点击相机，查看详情。', 'system-tip');
  // 不调用showNextBtn，等玩家点相机
}

// ===== 相机点击处理 =====
function onCameraClick() {
  if (gameState.phase !== 'wait_camera') return;
  gameState.phase = 'camera_clicked';

  var cam = document.getElementById('item-camera');
  cam.style.cursor = 'default';
  cam.classList.add('clicked');
  screenFlash();

  delay(700).then(function() {
    var filmStrip = document.getElementById('film-strip');
    filmStrip.classList.add('show');
    addPanel('相机底部刻着一行小字："给第128个观测者"\n\n取景器里有一张折叠的纸条。胶卷仓内壁上刻着奇怪的符号。\n\n但最重要的——这卷已冲洗的胶片，到底拍了什么？', 'system-tip');
    return delay(400);
  }).then(function() {
    // 激活照片01，提示点击
    var slot1 = document.getElementById('photo-slot-1');
    slot1.classList.add('active');
    slot1.style.cursor = 'pointer';
    gameState.phase = 'wait_photo1';
    addPanel('点击照片01查看。', 'system-tip');
    // 不调用showNextBtn，等玩家点照片
  });
}

// ===== 照片01点击处理 =====
function onPhoto1Click() {
  if (gameState.phase !== 'wait_photo1') return;
  gameState.phase = 'viewing_photo1';

  var slot1 = document.getElementById('photo-slot-1');
  slot1.style.cursor = 'default';

  openPhotoModal(1);
}

// ===== 步骤2：照片01弹窗关闭后 =====
function runStep2_afterFilm() {
  // 这一步由"继续"按钮或弹窗关闭触发
  addPanel('村口那个拉着小孩手的人，穿着和你昨天出门时一模一样的黄色外套。\n\n那个孩子的眉眼……和你竟出奇地相似。', 'warning');
  shakeScene();
  delay(400).then(function() { showNextBtn(); });
}

// ===== 步骤3：内心独白1 =====
function runStep3_monologue1() {
  addPanel('这不可能。\n\n我昨天确实穿着这件外套出门过，但我从来没有去过一个叫"云处村"的地方。\n\n而且这个孩子……为什么长得这么像我？', 'monologue');
  delay(400).then(function() { showNextBtn(); });
}

// ===== 步骤4：手机相册 =====
function runStep4_phoneAlbum() {
  addPanel('你打开手机相册，翻看儿时的照片……', 'normal');
  delay(400).then(function() {
    addPanel('你儿时的照片都变得模糊不清，像是被什么东西刻意抹去了。\n\n只有一张例外——你8岁生日那天的照片，但那张照片里的"你"……穿着畲族服饰。', 'system-tip');
    return delay(400);
  }).then(function() {
    addPanel('我的童年照片……全都看不清脸了。\n这到底是怎么回事？', 'monologue');
    return delay(400);
  }).then(function() {
    showNextBtn();
  });
}

// ===== 步骤5：搜索云处村 =====
function runStep5_searchYunchu() {
  addPanel('你打开搜索引擎，尝试搜索这个记忆中不存在的村落...', 'normal');
  gameState.phase = 'searching';

  delay(500).then(function() {
    var box = document.getElementById('search-box-1');
    box.classList.add('visible');
    document.getElementById('search-input').focus();
  });

  // 绑定搜索事件
  document.getElementById('search-btn').addEventListener('click', doSearch);
  document.getElementById('search-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doSearch();
  });
}

function doSearch() {
  if (gameState.phase !== 'searching') return;

  var input = document.getElementById('search-input').value.trim();
  var result = document.getElementById('search-result');

  if (input === '云处村') {
    gameState.phase = 'search_done';

    result.innerHTML =
      '<div class="search-result-item">' +
        '<div class="result-title blocked">【访问受限】</div>' +
        '<div>您所请求的内容因涉及未公开事项，已按相关规定进行移除处理。<br>本次访问记录已留存。</div>' +
      '</div>';

    // 延迟显示隐藏文字
    setTimeout(function() {
      var hidden = document.createElement('div');
      hidden.className = 'hidden-text';
      hidden.textContent = '他们还不想让你知道云处村的事，或许他们只屏蔽了【云处村】这个词条。';
      result.appendChild(hidden);
      // 搜索完成，出现继续按钮
      showNextBtn();
    }, 1200);

  } else if (input === '') {
    // 空输入不处理
  } else {
    result.innerHTML =
      '<div class="search-result-item" style="color:#999; font-style:italic;">不存在此选项</div>';
  }
}

// ===== 步骤6：邮件 =====
function runStep6_email() {
  gameState.phase = 'email';
  screenFlash();
  setTimeout(openEmailModal, 400);
  // 不调用showNextBtn，等邮件关闭
}

// ===== 步骤7：邮件关闭后 =====
function runStep7_afterEmail() {
  addPanel('恶作剧吗？\n\n但……为什么知道我刚洗了照片？\n为什么知道是"长满杂草的小径"？', 'monologue');
  delay(400).then(function() {
    // 激活照片02
    var slot2 = document.getElementById('photo-slot-2');
    slot2.classList.add('active');
    slot2.style.cursor = 'pointer';
    gameState.phase = 'wait_photo2';
    addPanel('你再次看向那叠照片，翻出第二张……\n\n点击照片02查看。', 'system-tip');
    // 不调用showNextBtn，等玩家点照片2
  });
}

// ===== 照片02点击处理 =====
function onPhoto2Click() {
  if (gameState.phase !== 'wait_photo2') return;
  gameState.phase = 'viewing_photo2';

  var slot2 = document.getElementById('photo-slot-2');
  slot2.style.cursor = 'default';

  openPhotoModal(2);
}

// ===== 步骤8：照片02弹窗关闭后 =====
function runStep8_photo2() {
  addPanel('你发现了一个诡异的现象：\n\n照片里每个人的影子方向都不统一——有的向左，有的向右，有的甚至完全没有影子。\n\n这违反了最基本的光学原理。', 'warning');
  shakeScene();
  delay(400).then(function() { showNextBtn(); });
}

// ===== 步骤9：结尾 =====
function runStep9_end() {
  addPanel('影子方向不一致……\n\n这意味着什么？\n这些照片，到底是在什么样的光线下拍摄的？', 'monologue');
  delay(400).then(function() {
    var endPanel = document.createElement('div');
    endPanel.className = 'chapter-title';
    endPanel.innerHTML = '<h2>序章 · 完</h2><p>第一幕即将开始……</p>';
    document.getElementById('panels').appendChild(endPanel);
    setTimeout(function() {
      endPanel.classList.add('visible');
      // 显示"开始探索"按钮
      delay(800).then(function() {
        var btn = document.createElement('a');
        btn.href = 'yunchu-gov.html';
        btn.id = 'explore-btn';
        btn.textContent = '开始探索';
        document.getElementById('panels').appendChild(btn);
        setTimeout(function() { btn.classList.add('show'); }, 50);
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }, 200);
  });
}

// ===== 照片弹窗 =====
function openPhotoModal(photoNum) {
  var modal = document.getElementById('photo-modal');
  var desc = document.getElementById('modal-photo-desc');
  var imgEl = document.getElementById('modal-photo-img');
  var zoomBtn = document.getElementById('modal-zoom-btn');
  var frame = document.getElementById('modal-photo-frame');

  frame.classList.remove('zoomed');
  zoomBtn.style.display = 'none';
  modal.classList.add('show');

  if (photoNum === 1) {
    imgEl.src = 'images/photo-1.png';

    desc.innerHTML = '<strong>第一张照片</strong><br><br>' +
      '一张长满杂草的小径，画面中央立着一块破旧的石碑，上面模糊地刻着"云处村"三个字。<br><br>' +
      '石碑前，一个人的背影牵着一个穿着畲族服饰的孩子，孩子转过头对着镜头笑，露出两颗小虎牙。<br><br>' +
      '<span style="color:#7a4f3a;font-size:14px;">📅 照片拍摄时间：<strong>1998年6月15日</strong></span><br>' +
      '<span style="color:#c0392b;font-size:14px;">⚠ 但相机的生产日期是<strong>2005年</strong>……</span>';

    zoomBtn.style.display = 'inline-block';
    zoomBtn.onclick = function() {
      zoomBtn.style.display = 'none';
      frame.classList.add('zoomed');
      desc.innerHTML = '<strong style="color:#c0392b;">⚠ 检测到异常数据</strong><br><br>' +
        '村口那个拉着小孩手的人，穿着和你昨天出门时一模一样的<strong>黄色外套</strong>。<br><br>' +
        '那个孩子的眉眼……和你竟出奇地<strong style="color:#c0392b;">相似</strong>。<br><br>' +
        '<span style="font-size:13px;color:#7a4f3a;">这不可能。这台相机是2005年才生产的，怎么可能拍到1998年的照片？</span>';
      setTimeout(function() { frame.classList.remove('zoomed'); }, 600);
    };

    document.getElementById('modal-close-btn').onclick = function() {
      modal.classList.remove('show');
      gameState.step = 2;
      runStep2_afterFilm();
    };

  } else if (photoNum === 2) {
    imgEl.src = 'images/photo-2.png';

    desc.innerHTML = '<strong>第二张照片</strong><br><br>' +
      '一张合影，形形色色的人穿着畲族的服装，站在一个广场上。<br><br>' +
      '奇怪的是，所有人的脸部因为曝光过度而显得模糊，看不清面容。<br><br>' +
      '<span style="color:#7a4f3a;font-size:14px;">照片背面手写小字：</span><br>' +
      '<em>"观测者第127次记录，1998年夏至"</em>';

    document.getElementById('modal-close-btn').onclick = function() {
      modal.classList.remove('show');
      gameState.step = 8;
      runStep8_photo2();
    };
  }
}

// ===== 邮件：右上角toast + 页面内嵌展开 =====
function openEmailModal() {
  // 第一步：显示右上角toast提醒
  var toast = document.getElementById('email-toast');
  toast.classList.add('show');

  // 点击"查看"后：toast消失，页面底部展开邮件
  document.getElementById('email-toast-open').onclick = function() {
    toast.classList.add('hide');
    setTimeout(function() { toast.classList.remove('show'); toast.classList.remove('hide'); }, 300);

    // 把内嵌邮件插入panels区域底部
    var inline = document.getElementById('email-inline');
    document.getElementById('panels').appendChild(inline);
    inline.classList.add('show');

    // 滚动到邮件位置
    setTimeout(function() {
      inline.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  // 点击"我知道了"关闭邮件，继续剧情
  document.getElementById('email-confirm-btn').onclick = function() {
    var inline = document.getElementById('email-inline');
    inline.style.opacity = '0';
    inline.style.transition = 'opacity 0.3s';
    setTimeout(function() {
      inline.style.display = 'none';
      gameState.step = 7;
      runStep7_afterEmail();
    }, 300);
  };
}
