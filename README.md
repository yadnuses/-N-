# 第N个观测者

一个基于浙江云和畲族文化的静态网页解谜游戏。

## 游戏入口

`yunchu-gov.html` → `archive.html`（访问码：`20260003000`）→ `intranet.html` → `village.html`

## 运行方式

本地启动 HTTP 服务器后访问：

```bash
python3 -m http.server 8080
```

然后打开浏览器访问 `http://localhost:8080/yunchu-gov.html`

## 文件结构

```
├── yunchu-gov.html     # 云处村政府官网（游戏入口）
├── archive.html        # 档案馆（访问码验证）
├── intranet.html       # 内网入口
├── village.html        # 主游戏页面
├── epilogue.html       # 尾声（结局C解锁）
├── yunque.html         # 耘雀·勇者凭证页
├── about.html          # 走进云处
├── contact.html        # 联系方式
├── news-*.html         # 政务新闻页
├── notice-*.html       # 通知公告页
├── css/                # 样式文件
├── js/                 # 脚本文件
└── images/             # 图片资源
```
