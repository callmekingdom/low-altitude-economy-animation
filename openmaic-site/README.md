# OpenMAIC - 多智能体互动课堂平台

基于科技蓝企业风格定制的 OpenMAIC 前端网站，包含增强的视频播放器功能。

## 功能特性

### 设计定制
- ✅ 科技蓝主色调企业风格界面
- ✅ 自定义 Logo 支持（替换 `assets/logo.png`）
- ✅ 响应式布局适配（桌面端、平板、手机）
- ✅ 玻璃态导航栏与毛玻璃效果
- ✅ 流畅的交互动画与悬浮卡片

### 视频播放器增强
- ✅ 可点击和拖拽的进度条
- ✅ 全屏观看模式切换
- ✅ 键盘快捷键支持（空格播放/暂停、F全屏、方向键控制）
- ✅ 双击视频切换全屏
- ✅ 时间显示与进度实时更新

### 保留功能
- ✅ 课程卡片网格布局
- ✅ 课程分类标签（编程、数学、科学、趣味等）
- ✅ 播放按钮与模态框视频播放
- ✅ 关于区域与特性展示
- ✅ GitHub 链接集成

## 文件结构

```
openmaic-site/
├── index.html          # 主页面
├── styles.css          # 样式文件（科技蓝主题）
├── script.js           # 交互逻辑与视频播放器
├── assets/
│   └── logo.svg        # Logo 文件（可用 PNG 替换）
└── README.md           # 本说明文件
```

## 自定义 Logo

1. 准备你的 Logo 图片（建议尺寸：200x200 像素）
2. 将图片保存为 `assets/logo.png`
3. 替换后刷新页面即可生效

**支持的格式：** PNG、JPG、SVG、WebP

## 部署到 Netlify

### 方法一：直接上传

1. 将整个 `openmaic-site` 文件夹压缩为 ZIP 文件
2. 登录 [Netlify](https://www.netlify.com/)
3. 点击 "Add new site" → "Deploy manually"
4. 拖拽 ZIP 文件上传
5. 等待部署完成即可获得网站链接

### 方法二：Git 部署（推荐）

1. 将代码推送到 GitHub/GitLab 仓库
2. 在 Netlify 中选择 "Import from Git"
3. 选择你的仓库
4. 构建设置保持默认（Publish directory 设为 `.`）
5. 点击 Deploy

### 方法三：Netlify CLI

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化并部署
netlify init
netlify deploy --prod --dir=.
```

## 视频播放器使用说明

| 操作 | 说明 |
|------|------|
| 点击播放按钮 | 播放/暂停视频 |
| 点击进度条 | 跳转到指定时间点 |
| 拖拽进度手柄 | 精确控制播放位置 |
| 点击全屏按钮 | 切换全屏/窗口模式 |
| 双击视频区域 | 快速切换全屏 |
| 空格键 | 播放/暂停 |
| F 键 | 切换全屏 |
| ← → 方向键 | 前进/后退 10 秒 |
| ↑ ↓ 方向键 | 调整音量 |
| M 键 | 静音切换 |
| ESC 键 | 退出全屏/关闭播放器 |

## 技术栈

- **HTML5** - 语义化结构
- **CSS3** - 现代样式与动画
- **原生 JavaScript** - 无依赖轻量级实现
- **Intersection Observer API** - 滚动动画
- **Fullscreen API** - 全屏功能

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- iOS Safari 13+
- Chrome Android 80+

## 自定义主题颜色

如需修改主题颜色，编辑 `styles.css` 中的 CSS 变量：

```css
:root {
    --primary: #0ea5e9;        /* 主色调 */
    --primary-dark: #0284c7;   /* 深色调 */
    --primary-light: #38bdf8;  /* 浅色调 */
    --accent: #06b6d4;         /* 强调色 */
    /* ... */
}
```

## 添加新课程

在 `index.html` 的课程网格区域添加新的课程卡片：

```html
<div class="course-card" data-course="course-id">
    <div class="course-image">
        <div class="course-badge">分类</div>
        <div class="course-overlay">
            <button class="play-btn">...</button>
        </div>
    </div>
    <div class="course-content">
        <h3 class="course-title">课程标题</h3>
        <p class="course-desc">课程描述</p>
        <div class="course-meta">
            <span class="course-tag">标签</span>
            <span class="course-duration">时长</span>
        </div>
    </div>
</div>
```

然后在 `script.js` 中添加视频链接：

```javascript
const courseVideos = {
    // ... 现有课程
    'course-id': 'https://your-video-url.mp4'
};
```

## 许可证

MIT License - OpenMAIC Open Source Project

## 联系方式

- GitHub: https://github.com/THU-MAIC/OpenMAIC
- 项目主页: https://open.maic.chat/
