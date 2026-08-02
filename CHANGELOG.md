# Changelog

## 2026-08-01 — 项目页面布局优化

### 项目详情页重新设计 (`ProjectDetail.jsx`)
- **移除**漂浮固定顶栏，项目名称和描述不再悬浮在每张照片上方
- **第一屏**：展示项目名称（大标题）、描述、所有作品的缩略图网格，以及滚动提示动画
- **后续屏幕**：每件作品全屏展示，支持滚动吸附（scroll-snap）
- 点击缩略图可平滑滚动至对应作品
- 返回按钮固定于导航栏下方，常驻可见；手机端简化为"← 返回"
- 修复 `key={work.imageUrl}` → 使用 `idx` 作为 React key
- 移除 `h-screen overflow-hidden`，Footer 现在可正常显示
- 横屏手机适配：图片 `max-h-[55vh]`

### 项目列表页 (`Projects.jsx`) 与首页 (`Home.jsx`) 网格修复
- 将固定的 `grid-cols-3` 改为 `flex flex-wrap justify-center`
- 当前仅 2 个项目时，卡片自然居中，不再偏向左侧

### 滚动吸附优化
- 将 `scroll-snap-type: y mandatory` 改为 `y proximity`，防止第一屏自动跳转至第二屏
- 吸附效果仅通过 `useEffect` 在项目详情页启用，离开页面自动移除
- 新增 `.snap-section` 类：iOS Safari 动态视口高度适配（`100dvh`）

### 导航滚动修复
- `Layout.jsx` 中添加 `window.scrollTo(0, 0)`：每次路由切换时自动回到页面顶部

### 部署脚本修复 (`scripts/deploy.mjs`)
- 修正 `putBucketWebsite` 中的存储桶名称：`xleidoscope-photography` → `xphotography`

### 修改文件
| 文件 | 变更内容 |
|------|---------|
| `src/pages/ProjectDetail.jsx` | 完整重新设计 |
| `src/pages/Projects.jsx` | 网格改用 flexbox 居中 |
| `src/pages/Home.jsx` | 项目区块网格改用 flexbox 居中 |
| `src/components/Layout.jsx` | 路由切换时滚动至顶部 |
| `src/index.css` | 新增滚动吸附与动态视口 CSS |
| `scripts/deploy.mjs` | 修复存储桶名称 |

---

## 2026-08-01 — 新增内容

### 新作品
- **Prayer** — 布达拉宫，拉萨，西藏 (2025-05)

### 新项目：Tibetan Road
- 2025 年西藏之行系列，18 张照片
- 包含：布达拉宫、雪山公路、羊卓雍措、藏地峡谷、库拉岗日徒步、经幡、牦牛等

### 数据更新
- `metadata.json`：新增 1 张独立作品 + 1 个项目（18 张作品）
- 全部 19 张新照片已上传至 OSS（原图 + 缩略图）
- `config.json` 已同步更新并部署
