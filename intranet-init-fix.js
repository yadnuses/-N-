// ===== intranet.html 页面加载初始化修复 =====
// 将此代码添加到 intranet.html 的 </script> 标签之前

// 页面加载时检查各种触发条件
function checkPageLoadTriggers() {
  var save = getSave();
  
  // 1. 检查 about.html 触发条件
  // 如果进度 >= 2 且未触发过 aboutTriggered，显示消息提示
  if (save.chatProgress >= 2 && !save.aboutTriggered) {
    setAboutTriggered(true);
    setTimeout(showMsgToast, 3000);
  }
  
  // 2. 检查地图触发条件
  // 如果地图已访问但对话未开始，且进度 >= 7
  if (save.mapVisited && save.chatProgress >= 7 && !save.mapChatStarted) {
    setMapChatStarted(true);
    setTimeout(function() {
      switchPanel('panel-chat', '');
      startMapChat();
    }, 2000);
  }
  
  // 3. 检查监控触发条件
  if (save.chatProgress >= 18 && !save.monitorChatStarted) {
    setTimeout(showMonitorToast, 3000);
  }
  
  // 4. 检查对讲机触发条件 (如果有)
  if (save.radioStarted && !save.radioChatStarted) {
    // 对讲机相关逻辑
  }
}

// 页面加载完成后执行检查
window.addEventListener('load', function() {
  // 延迟执行，等待其他初始化完成
  setTimeout(checkPageLoadTriggers, 1000);
});
