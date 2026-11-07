# Agent 协作约定

- 在修改前先阅读 README.md、DESIGN.md 和受影响的组件；保持视觉风格、响应式布局和现有键盘行为。
- 内容集中在 src/data/profile.ts，主题令牌集中在 src/styles/tokens.css；别将私人数据或凭据写入组件、前端构建或仓库。
- 真实和模拟数据明确区分；第三方 API 失败要有可见、诚实的降级。
- 维持严格 TypeScript、语义 HTML、焦点指示及 reduced-motion；不为了效果牺牲键盘与触屏。
- 每次修改至少运行 npm run build；如果交付 standalone，运行 npm run build:single 并同步 standalone/index.html。对受影响交互、桌面和 390px 移动端进行测试；在交付说明中说明尚未实现或未测试的部分。
