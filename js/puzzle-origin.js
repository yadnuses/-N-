// 线索数据
var clueData = {
  '5-A': {
    name: '时间场形成记录',
    content: '时间循环是小坏蛋濒死时的强烈愿望创造的',
    unlocked: false,
    unlockKeyword: '时间场'
  },
  '5-B': {
    name: '第一次循环档案',
    content: '小坏蛋每次循环都会重新经历那一天的恐惧',
    unlocked: false,
    unlockKeyword: '第一次循环'
  },
  '5-C': {
    name: '小坏蛋的过去',
    content: '小坏蛋就是村长的孩子，影子承载着那一天的记忆',
    unlocked: false,
    unlockKeyword: '小坏蛋 过去'
  },
  '5-D': {
    name: '打破循环的方法',
    content: '打破循环需要让小坏蛋自愿放弃，面对被封锁的记忆',
    unlocked: false,
    unlockCondition: ['5-A', '5-B', '5-C']
  }
};

// 正确答案
var correctAnswers = {
  q1: 'B',
  q2: 'B',
  q3: 'C'
};

// 初始化页面
function initPage() {
  loadClueStatus();
  updateClueDisplay();
  checkAutoUnlock();
  checkValidationUnlock();
}

// 加载线索状态
function loadClueStatus() {
  var saveData = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
  var clues = saveData.clues || {};
  var originClues = clues.origin || {};

  for (var clueId in originClues) { if (!originClues.hasOwnProperty(clueId)) continue; var unlocked = originClues[clueId];
    if (clueData[clueId]) {
      clueData[clueId].unlocked = unlocked;
    }
  }
}

// 更新线索显示
function updateClueDisplay() {
  var unlockedCount = 0;

  for (var clueId in clueData) { if (!clueData.hasOwnProperty(clueId)) continue; var data = clueData[clueId];
    var element = document.getElementById('clue-' + clueId.toLowerCase().replace(/-/g, ''));
    var reviewElement = document.getElementById('review-' + clueId.toLowerCase().replace(/-/g, ''));

    if (data.unlocked && element) {
      unlockedCount++;
      element.classList.remove('locked');
      element.querySelector('.clue-status').textContent = '已获得';
      element.querySelector('.clue-status').classList.remove('locked');
      element.querySelector('.clue-status').classList.add('unlocked');
      element.querySelector('.clue-content').style.display = 'block';
      var hint = element.querySelector('.clue-unlock-hint');
      if (hint) hint.style.display = 'none';

      if (reviewElement) {
        reviewElement.classList.remove('missing');
        reviewElement.textContent = '线索' + clueId + '：' + data.content;
      }
    }
  }

  return unlockedCount;
}

// 检查自动解锁条件
function checkAutoUnlock() {
  var saveData = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
  var clues = saveData.clues || {};
  var originClues = clues.origin || {};

  // 检查线索5-D的解锁条件
  var has5A = originClues['5-A'] || false;
  var has5B = originClues['5-B'] || false;
  var has5C = originClues['5-C'] || false;

  if (has5A && has5B && has5C && !clueData['5-D'].unlocked) {
    // 自动解锁线索5-D
    clueData['5-D'].unlocked = true;
    saveData.clues = saveData.clues || {};
    saveData.clues.origin = saveData.clues.origin || {};
    saveData.clues.origin['5-D'] = true;
    localStorage.setItem('yunchu_save', JSON.stringify(saveData));

    // 更新显示
    var element = document.getElementById('clue-5d');
    var reviewElement = document.getElementById('review-5d');
    if (element) {
      element.classList.remove('locked');
      element.querySelector('.clue-status').textContent = '已获得';
      element.querySelector('.clue-status').classList.remove('locked');
      element.querySelector('.clue-status').classList.add('unlocked');
      element.querySelector('.clue-content').style.display = 'block';
      var hint = element.querySelector('.clue-unlock-hint');
      if (hint) hint.style.display = 'none';
    }
    if (reviewElement) {
      reviewElement.classList.remove('missing');
      reviewElement.textContent = '线索5-D：' + clueData['5-D'].content;
    }
  }
}

// 检查是否解锁验证关卡
function checkValidationUnlock() {
  var unlockedCount = updateClueDisplay();
  var validationSection = document.getElementById('validation-section');

  if (unlockedCount >= 4) {
    validationSection.classList.remove('locked');
  }
}

// 选择选项
function selectOption(question, value) {
  document.getElementById(question + '-' + value).checked = true;
}

// 提交答案
function submitAnswer() {
  var q1 = document.querySelector('input[name="q1"]:checked');
  var q2 = document.querySelector('input[name="q2"]:checked');
  var q3 = document.querySelector('input[name="q3"]:checked');
  var feedbackDiv = document.getElementById('validation-feedback');

  if (!q1 || !q2 || !q3) {
    feedbackDiv.innerHTML = '<div class="validation-feedback error">请回答所有问题</div>';
    return;
  }

  var answers = {
    q1: q1.value,
    q2: q2.value,
    q3: q3.value
  };

  var correctCount = 0;
  if (answers.q1 === correctAnswers.q1) correctCount++;
  if (answers.q2 === correctAnswers.q2) correctCount++;
  if (answers.q3 === correctAnswers.q3) correctCount++;

  if (correctCount === 3) {
    feedbackDiv.innerHTML = '<div class="validation-feedback success">' +
        '<strong>✓ 最终验证通过</strong><br><br>' +
        '你找到了打破循环的方法。<br><br>' +
        '时间循环的根源是小坏蛋在濒死时的强烈愿望。<br>' +
        '他是村长的孩子，1984年那场意外的受害者。<br><br>' +
        '他的影子承载着那一天的记忆，在保护他永远不用面对真相。<br><br>' +
        '但要拯救云处村，我们必须帮助他面对真相，让他自愿放弃循环。<br><br>' +
        '现在，是时候进入云处村，找到小坏蛋，让他愿意醒来了。' +
      '</div>';

    // 保存完成状态
    var saveData = JSON.parse(localStorage.getItem('yunchu_save') || '{}');
    saveData.puzzlesSolved = saveData.puzzlesSolved || {};
    saveData.puzzlesSolved.origin = true;
    saveData.allPuzzlesSolved = true;
    localStorage.setItem('yunchu_save', JSON.stringify(saveData));

    // 显示解决横幅
    document.getElementById('solved-banner').style.display = 'block';

    // 隐藏选项和按钮
    document.getElementById('q1-options').style.display = 'none';
    document.getElementById('q2-options').style.display = 'none';
    document.getElementById('q3-options').style.display = 'none';
    document.querySelector('.validation-submit-btn').style.display = 'none';
  } else {
    feedbackDiv.innerHTML = '<div class="validation-feedback error">' +
        '❌ 答案有误（' + correctCount + '/3）<br>' +
        '请重新审视线索，特别是关于循环起源的部分。' +
      '</div>';
  }
}

// 监听来自搜索的解锁消息
window.addEventListener('storage', function(e) {
  if (e.key === 'yunchu_save') {
    initPage();
  }
});

// 页面加载时初始化
initPage();
