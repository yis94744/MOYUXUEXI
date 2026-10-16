# MOYUXUEXI — 知识库

学习文档与教程的集合。全部内容为纯静态 HTML / Markdown，**克隆后用浏览器直接打开即可阅读**，不需要任何构建步骤。

---

## 目录结构

```
MOYUXUEXI/
├── csharp-unity/          C# + Unity 知识手册
├── svn-tutorial/          SVN 命令与工作流教程（26 页）
├── svn-gui-tutorial/      SVN GUI 客户端教程（102 页）
└── svn-source/            SVN 教程的构建源文件
    ├── split/             章节源（每节一个 HTML 片段）
    ├── parts/             分阶段合并稿
    └── gui-src/           GUI 教程的构建脚本与素材
```

---

## 各目录说明

### csharp-unity — C# + Unity 知识手册

| 文件 | 说明 |
| --- | --- |
| `CSharp-Unity-完全知识手册.md` | 从语言基础到引擎机制的完整手册（约 300 KB） |
| `CSharp-Unity-第1章-类型系统基石.html` | 第 1 章的网页版，带代码高亮与导航 |

内容覆盖：类型系统、面向对象、委托与事件、泛型与反射、内存与 GC、协程与异步、游戏数学、渲染管线，以及 Unity 的核心机制。

### svn-tutorial — SVN 教程

从零开始的 Subversion 教程，共 26 页，每页一个主题：

- 基础：架构、安装、工作模型、目录布局
- 日常：首次检出、状态查看、日常循环、提交
- 进阶：分支、合并、冲突解决、历史查询
- 高级：锁定、属性、钩子脚本

打开 `svn-tutorial/index.html` 开始阅读。

### svn-gui-tutorial — SVN GUI 客户端教程

面向图形界面客户端的操作指南，共 102 页，含配图与逐步操作说明：

- 工具安装与配置
- 首次检出、图标状态识别
- 日常操作：更新、提交、查看差异
- 分支与合并的可视化操作
- 历史浏览与版本回退

打开 `svn-gui-tutorial/index.html` 开始阅读。

### svn-source — 教程源文件

这些是上面两个教程的**生成源**，用于重新构建教程站点：

| 目录 | 内容 |
| --- | --- |
| `split/` | 25 个章节片段（`sec-s*.html`）+ 样式、脚本、元数据 |
| `parts/` | 8 个分阶段合并稿 |
| `gui-src/` | GUI 教程的构建脚本、规格文档与素材 |

构建脚本为 PowerShell（`.ps1`），在 Windows PowerShell 下运行。

---

## 使用方式

### 在线阅读

克隆仓库后用浏览器打开任意 `index.html`：

```bash
git clone <仓库地址>.git
cd MOYUXUEXI
# 然后用浏览器打开 svn-tutorial/index.html 等
```

### 本地起一个静态服务器（可选）

如果浏览器对本地文件的脚本有限制，可以起一个简单服务器：

```bash
# Python 3
python -m http.server 8000

# 然后访问 http://localhost:8000/svn-tutorial/
```

---

## 说明

- 所有页面均为**离线可读**：样式与脚本都已内联或随仓库提供，不依赖外部 CDN。
- 教程中的示例命令、路径、用户名均为**演示用途**，请按自己的环境替换。
- 构建源目录中的脚本包含示例路径，运行前请根据实际情况调整。
