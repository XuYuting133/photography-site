# 技术栈 (Tech Stack)

| 层级 | 选型 | 说明 |
| :--- | :--- | :--- |
| **前端框架** | React 或 Vue（二选一） | 轻量、生态好，适合构建作品集网格布局。 |
| **构建工具** | Vite | 极速冷启动，开发体验优秀，构建输出为纯静态文件。 |
| **样式方案** | TailwindCSS + 自定义 CSS | 快速实现响应式设计，同时保留个性化定制。 |
| **路由管理** | 无路由（单页应用），或使用 React Router / Vue Router | 简单场景可仅用页面内锚点切换；如有多个独立页面可启用轻量路由。 |
| **数据存储** | 硬编码 JavaScript 数组（`data/works.js`） | 每个作品包含 `id, title, date, image(URL), description, category(可选)`。 |
| **图片存储** | **推荐**：Vercel Blob<br>**备选**：阿里云 OSS 或其它云存储 | Vercel 原生存储服务，专为图片优化；备选方案适用于已有云存储账号的场景。 |
| **表单处理**（联系我） | 第三方 API 推送（如 Formspree） | 无需后端，直接调用第三方服务将表单内容发送至邮箱。 |
| **版本控制** | Git + 远程仓库（GitHub/GitLab/Bitbucket） | 与 Vercel 自动部署深度集成。 |
| **部署方式** | Vercel（连接 Git 仓库自动部署） | 提供全球 CDN、自动 SSL、持续部署，免服务器运维。 |