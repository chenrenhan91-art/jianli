# 设计规范

## 视觉方向

开发者工作台：深色中性背景、低对比表面边界、酸橙绿只强调状态、操作与数据；中文优先的系统无衬线。内容应真实、易读，装饰不替代信息。

| 令牌 | 暗色 | 浅色 | 用途 |
|---|---|---|---|
| --bg | #0d0e10 | #f3f3ef | 画布 |
| --tile | #17191c | #ffffff | 卡片 |
| --raised | #202327 | #f1f3ed | 次级表面 |
| --text | #f2f3ee | #20251f | 正文 |
| --muted | #a8ada8 | #5d685b | 次级文字 |
| --border | #353a39 | #d8dfd3 | 边界 |
| --accent | #c8f65d | #c8f65d | 操作底色 |
| --accent-text | #c8f65d | #4a7300 | 强调文字 |
| --heat0–4 | #303632 / #40562a / #648b32 / #95c743 / #c8f65d | #e7ebe3 / #e2f5b0 / #bce36e / #8bbb2e / #4e7a00 | 贡献热力图 |

## 网格和卡片

最大容器 1280px；桌面内边距 32px，间距 12px，卡片 12px 圆角。四列区域依次为：

```
intro intro clock build
intro intro work  work
heat  heat  work  work
music write write contact
```

1023px 及以下改两列：`intro intro / clock build / work work / heat heat / write write / music contact`。560px 及以下边距 16px、卡片间距 8px。作品区域自身宽度低于 460px 时，项目选项横排且预览移至下方。介绍与项目为视觉主角，实时信息、内容和联系方式次之。

## 交互和动效

- 卡片 500ms 上移入场，逐项延迟 55ms；桌面鼠标位置触发卡片内及边框柔光（requestAnimationFrame 限频）。
- 作品每 6 秒轮播；鼠标悬停、区域内焦点或减少动态效果暂停；方向键切换。
- 实时时钟按所在地时区更新；本地访客时差使用 UTC 偏移之差。工作状态由设置的小时数演示计算，不是实际在线检测。
- 命令面板 Ctrl/⌘+K 或 `/`；方向键、Enter、Esc；T 切换主题；偏好持久化并在页面绘制前应用。
- 热力图按周日对齐，显示可容纳的周数，悬停显示日期及次数。模拟数值与趋势曲线由固定种子生成。
- 系统开启减少动态效果时移除动效和入场延迟、停止轮播。焦点有可见轮廓；命令面板具备 dialog、combobox/listbox 语义；项目选项使用 tab 语义。生产使用前仍应针对实际内容进行键盘、读屏及 WCAG 对比度测试。
