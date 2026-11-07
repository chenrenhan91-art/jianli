# Bento 实时工作台 · 复刻包

一个可直接运行、可修改的个人网站示例。React 19 + TypeScript + Vite；数据集中在 `src/data/profile.ts`，主题和界面样式在 `src/styles/`。内容是虚构演示，发布前请替换人物、数据和链接。

## 环境与运行

需要 Node.js 22.12 或更新版本（建议 Node 24 LTS）与 npm。解压后在 Cursor、VS Code 或任意 IDE 打开项目根目录，在终端执行：

```bash
npm ci
npm run dev
```

打开终端显示的本地地址（通常是 http://localhost:5173）。`npm ci` 使用随包的 lock 文件；没有 lock 时可用 `npm install`。开发服务器仅供本机使用。

```bash
npm run build         # TypeScript 检查 + 生产构建到 dist/
npm run preview       # 本地预览 dist/
npm run build:single  # 构建到 dist-single/index.html，适合单文件分享
```

`standalone/index.html` 是随包提供的单文件成品；直接双击可预览。若浏览器限制文件协议的剪贴板、网络或存储，请改用本地服务器或 HTTPS。修改源码后需要重新 `npm run build:single` 并复制构建文件来更新它。

## 个性化顺序

1. `src/data/profile.ts`：替换站名、姓名、角色、介绍、邮箱、状态、时区、技术栈、项目、文章与社交链接。`resumeUrl`、`projectsUrl`、`blogUrl` 和示例项目/文章的 `#` 都是占位符；发布前改成真实 URL。添加 PDF 到 `public/` 后可使用相对路径，例如 `./resume.pdf`，并实际验证部署后的链接。
2. `src/styles/tokens.css`：修改深浅主题色。`src/styles/app.css`：调整网格、字号、断点与动画。`index.html`：替换页面标题、描述、OG 信息和 favicon。
3. 作品预览的曲线是基于种子的装饰图，不代表真实指标。项目数值和进度、状态、更新日期及音乐皆为示例数据；换成真实数据或明确标注演示。音乐播放按钮只控制演示计时，不播放声音。
4. 按下 Ctrl/⌘+K 或 `/` 打开命令面板；T 切换主题。暗/亮偏好保存在本机 localStorage 的 `zy-theme`；清除站点数据可重置。

## 数据接口与真实数据

- GitHub：`profile.github.username` 设置账号、`live: true`。前端请求第三方公开服务 `https://github-contributions-api.jogruber.de/v4/{用户名}?y=last`；失败、空结果自动退回标注为“演示数据”的种子数据。部署前确认服务的可用性、条款、CORS、限流与隐私；账号会发送给第三方。贡献不等于仅 commit，请按实际来源调整文案。
- 音乐：示例没有接 Spotify/Last.fm，也不播放音频。要展示真实正在播放，推荐服务端函数持有密钥或 OAuth refresh token，向 Spotify Web API 的 currently-playing 或 Last.fm 的 user.getRecentTracks 请求，再对前端暴露最小只读 JSON（例如 `{ title, artist, playing, position, duration }`）。在 `MusicTile.tsx` 用该接口替换演示状态，处理暂停、空值、授权过期、限流和失败；不得把私密 token 放进浏览器或仓库。服务端方案和提供商授权需自行实现。
- WakaTime：可在服务端函数使用 WakaTime API 密钥查询允许公开的统计，映射为卡片数据后前端读取；处理权限、缓存、时区及失败状态。示例没有内置此接口，密钥只保存在托管平台服务端环境变量。
- GitHub、音乐及 WakaTime 是独立扩展：不要把静态模拟内容称为实时。发布前检查各服务的最新 API 文档和条款。

## 部署

执行 `npm ci && npm run build`，发布 `dist/` 静态目录。

- **Vercel**：导入仓库，框架选择 Vite，构建 `npm run build`，输出目录 `dist`。
- **Netlify**：导入仓库，构建命令 `npm run build`，发布目录 `dist`。
- **GitHub Pages**：推送到 GitHub，在 Settings → Pages 将来源设为 GitHub Actions。随包 `.github/workflows/deploy.yml` 在推送 `main` 时构建并部署。若默认分支不是 main，请修改工作流的分支名。`vite.config.ts` 使用相对 `base: './'`，兼容项目路径。

自行购买/绑定域名并按平台指引配置 HTTPS。确认 PDF、社交链接、手机布局、对比度和真实数据状态后再对外发布。

## 结构

```
index.html                   入口、元信息、主题预加载
src/data/profile.ts          唯一内容配置
src/App.tsx                  组合卡片、命令
src/components/              Bento 卡片和 UI 组件
src/hooks/                   主题、时间、聚光灯、快捷键等
src/lib/                     贡献图、时区、剪贴板等工具
src/styles/tokens.css        主题令牌
src/styles/app.css           布局、组件、动画、断点
standalone/index.html        预构建单 HTML
DESIGN.md                    设计规范
PROMPT.md                    AI IDE 复刻提示词
AGENTS.md                    协作与代码约束
.github/workflows/deploy.yml GitHub Pages 部署
```

## 测试清单

桌面及 390px、深浅主题、无横向溢出；键盘打开/筛选/选择/关闭面板，作品方向键，邮箱复制与 toast，GitHub 请求失败，减少动态效果；替换所有占位链接并实际点击；审查对比度、隐私、真实数据及窄屏内容。支持较新的浏览器，热力图尺寸依赖 ResizeObserver，聚光灯边框依赖 CSS mask-composite，旧浏览器可能降级。
