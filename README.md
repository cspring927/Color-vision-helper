# Color Vision Helper 🎨 色觉辅助工具

A Chrome extension that helps people with color vision deficiency (color blindness) browse the web more comfortably.

一款帮助色盲和色弱用户更好地识别网页颜色的 Chrome 浏览器插件。

## Features 功能

- **7 种色觉类型支持**：红色盲、绿色盲、红色弱、绿色弱、蓝黄色盲、蓝黄色弱、全色盲
- **强度可调**：0-100% 滑块，适配不同程度的色觉异常
- **实时生效**：即开即用，无需刷新页面
- **记忆设置**：关闭浏览器后重新打开，设置自动恢复
- **轻量无侵入**：使用 SVG 滤镜，不修改网页 DOM

## Supported Types 支持类型

| 类型 | 英文 | 说明 |
|------|------|------|
| 红色盲 | Protanopia | 缺少红色感受器 |
| 绿色盲 | Deuteranopia | 缺少绿色感受器 |
| 红色弱 | Protanomaly | 红色感受器异常 |
| 绿色弱 | Deuteranomaly | 绿色感受器异常 |
| 蓝黄色盲 | Tritanopia | 缺少蓝色感受器 |
| 蓝黄色弱 | Tritanomaly | 蓝色感受器异常 |
| 全色盲 | Achromatopsia | 无法感知颜色 |

## Installation 安装方式

### 开发者模式加载（开发/测试用）

1. 下载ZIP 或 `git clone` 本仓库
2. 打开 Chrome，地址栏输入 `chrome://extensions`
3. 开启右上角「开发者模式」
4. 点击「加载已解压的扩展程序」
5. 选择本项目文件夹
6. 插件图标出现在浏览器右上角，点击即可使用

### Chrome Web Store（正式版）

> 即将上架，敬请期待。

## Tech Stack 技术栈

- **Manifest V3** — Chrome 最新扩展标准
- **SVG feColorMatrix** — 基于色彩矩阵变换的滤镜方案
- **Chrome Storage API** — 持久化用户设置
- 无外部依赖，纯原生 JavaScript

## Project Structure 项目结构

```
color-vision-helper/
├── manifest.json      # 插件配置文件
├── popup.html         # 弹出窗口 UI
├── popup.css          # 弹出窗口样式
├── popup.js           # 弹出窗口逻辑
├── content.js         # 内容脚本（核心滤镜引擎）
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## How It Works 工作原理

插件通过 SVG `feColorMatrix` 滤镜对页面颜色进行矩阵变换。不同类型的色觉异常使用不同的校正矩阵，将难以区分的颜色重新映射到用户可以感知的色域范围内。

强度滑块通过在单位矩阵（原始颜色）和校正矩阵之间做线性插值，实现平滑过渡。

## Contributing 参与贡献

欢迎提交 Issue 和 Pull Request！

## License

MIT
