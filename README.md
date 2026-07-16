# xleidoscope photography

轻量级摄影师个人作品集网站。纯静态，无数据库，一行命令部署到 OSS。

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | React 18 |
| 构建 | Vite |
| 样式 | TailwindCSS 3 |
| 路由 | React Router v6 (HashRouter) |
| 图片存储 | 阿里云 OSS（香港/新加坡 region，免备案） |
| 联系表单 | 腾讯文档收集表 / Formspree（二选一） |
| 部署 | OSS 静态网站托管 + 自定义域名 |

## 项目结构

```
src/
├── main.jsx                    # 入口
├── App.jsx                     # 路由（/ /works /about /contact）
├── index.css                   # Tailwind + 全局样式
├── data/
│   └── SiteContext.jsx         # React Context，运行时从 config.json 加载数据
├── components/
│   ├── Layout.jsx              # 导航栏 + 页脚布局
│   ├── Footer.jsx              # 版权 + 社交链接
│   ├── Gallery.jsx             # 响应式作品网格（3→2→1 列）
│   ├── Lightbox.jsx            # 全屏大图浏览（键盘导航）
│   └── ContactForm.jsx         # Formspree 回退表单
├── pages/
│   ├── Home.jsx                # 全屏 Hero + 精选作品
│   ├── Works.jsx               # 完整作品网格 + Lightbox
│   ├── About.jsx               # 摄影师简介
│   └── Contact.jsx             # 联系表单（iframe / Formspree）
scripts/
├── upload-photos.mjs           # 批量上传照片到 OSS（带重复检测）
└── deploy.mjs                  # 一键部署 dist/ 到 OSS
public/
├── config.json                 # ⭐ 全站数据（运行时加载，改数据无需重建）
└── config.example.json         # 数据模板
ref/
├── prd.md                      # 产品需求文档
├── design.md                   # UI 设计文档
└── tech-stack.md               # 技术栈文档
```

## 核心设计

### 数据与代码分离

全站配置和作品数据集中在 `public/config.json`，应用启动时通过 `fetch` 加载。

**更新照片不需要重新构建 React 应用**——只需上传新的 `config.json` 到 OSS，刷新页面即生效。

### 作品上传

```bash
# 1. 把照片放到 src/data/content/
# 2. 更新 metadata.json

OSS_AK_ID=xxx OSS_AK_SECRET=xxx npm run upload
# → 自动跳过已存在的照片
# → 自动更新 public/config.json
# → 上传更新后的 config.json 到 OSS 即可
```

### 部署

```bash
npm run build
OSS_AK_ID=xxx OSS_AK_SECRET=xxx npm run deploy
# → dist/ 全部上传到 OSS
```

## 本地开发

```bash
# 安装依赖
npm install

# 复制数据模板并填入你的信息
cp public/config.example.json public/config.json

# 启动
npm run dev
```

## 部署要求

- OSS Bucket 设为公共读 + 静态网站托管（默认首页 `index.html`）
- 自定义域名绑定（境外 region 无需备案）
- SSL 证书：OSS 域名管理 → 免费证书

## 许可证

MIT
