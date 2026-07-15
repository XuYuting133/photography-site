/**
 * OSS 网站部署脚本
 *
 * 用法：
 *   OSS_AK_ID=xxx OSS_AK_SECRET=xxx npm run deploy
 *
 * 将 dist/ 目录内容上传到 OSS Bucket 根目录。
 */

import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

// ============ OSS 配置（从环境变量读取）============
const {
  OSS_AK_ID: accessKeyId,
  OSS_AK_SECRET: accessKeySecret,
} = process.env;

if (!accessKeyId || !accessKeySecret) {
  console.error('❌ 请设置环境变量：OSS_AK_ID 和 OSS_AK_SECRET');
  process.exit(1);
}

const client = new OSS({
  region: 'oss-ap-southeast-1',
  bucket: 'xphotography',
  accessKeyId,
  accessKeySecret,
});

// ============ 递归上传 ============
async function uploadDir(localDir, ossPrefix) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });
  let count = 0;

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const ossPath = ossPrefix ? `${ossPrefix}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      count += await uploadDir(localPath, ossPath);
    } else {
      const content = fs.readFileSync(localPath);
      const result = await client.put(ossPath, content);
      console.log(`   ✅ ${ossPath} (${result.res.status})`);
      count++;
    }
  }
  return count;
}

// ============ 设置 Bucket 为静态网站托管 ============
async function enableStaticWebsite() {
  try {
    await client.putBucketWebsite('xleidoscope-photography', {
      index: 'index.html',
      error: 'index.html', // SPA fallback: 404 也返回 index.html
    });
    console.log('   ✅ 已启用静态网站托管（SPA 模式）');
  } catch (err) {
    console.log(`   ⚠️  静态网站托管设置失败: ${err.message}`);
    console.log('   请手动在 OSS 控制台 → 基础设置 → 静态页面 中开启');
  }
}

// ============ 主流程 ============
(async () => {
  console.log('🚀 开始部署到 OSS...\n');

  const count = await uploadDir(distDir, '');
  console.log(`\n✅ 部署完成: ${count} 个文件`);

  await enableStaticWebsite();

  console.log(`\n🌐 访问地址:`);
  console.log(`   https://xleidoscope.me`);
})();
