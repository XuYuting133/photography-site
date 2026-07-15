/**
 * OSS 批量上传脚本（带重复检测）
 *
 * 用法：
 *   OSS_AK_ID=xxx OSS_AK_SECRET=xxx npm run upload
 *
 * 功能：
 *   1. 先列出 OSS 已有文件，避免重复上传
 *   2. 只上传新增的照片
 *   3. 输出完整的 works 数据（含新老照片）
 *
 * ⚠️  AK 从环境变量读取，不会写入源码。
 */

import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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

const CUSTOM_DOMAIN = 'https://xleidoscope.me';
const OSS_BASE_URL = CUSTOM_DOMAIN || 'https://xphotography.oss-ap-southeast-1.aliyuncs.com';
const OSS_PREFIX = 'photos';

// ============ 读取 metadata ============
const metadataPath = path.join(rootDir, 'src', 'data', 'content', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

// ============ 获取 OSS 已有文件列表 ============
async function getExistingFiles() {
  const existing = new Set();
  let marker = null;
  do {
    const result = await client.list({
      prefix: `${OSS_PREFIX}/`,
      'max-keys': 100,
      marker,
    });
    if (result.objects) {
      result.objects.forEach((o) => existing.add(o.name));
    }
    marker = result.nextMarker;
  } while (marker);
  return existing;
}

// ============ 主流程 ============
console.log('🔍 正在检查 OSS 已有文件...');
const existingFiles = await getExistingFiles();
console.log(`   OSS 上已有 ${existingFiles.size} 个文件\n`);

console.log(`📋 metadata 中 ${metadata.length} 张照片\n`);

let newCount = 0;
let skipCount = 0;
let failCount = 0;
const allWorks = [];

for (let i = 0; i < metadata.length; i++) {
  const item = metadata[i];
  const fileName = path.basename(item.file);
  const localPath = path.join(rootDir, 'src', 'data', 'content', fileName);
  const ossPath = `${OSS_PREFIX}/${fileName}`;

  // 检查本地文件
  if (!fs.existsSync(localPath)) {
    console.error(`❌ 文件不存在: ${localPath}`);
    continue;
  }

  // 生成 URL（无论是否上传都用这个）
  const publicUrl = `${OSS_BASE_URL}/${ossPath}`;
  const workEntry = {
    ...item,
    file: undefined,
    imageUrl: publicUrl,
    thumbnailUrl: `${publicUrl}?x-oss-process=image/resize,w_600`,
  };

  // 检查 OSS 是否已有
  if (existingFiles.has(ossPath)) {
    console.log(`⏭️  [${i + 1}/${metadata.length}] ${fileName} (已存在，跳过)`);
    skipCount++;
    allWorks.push(workEntry);
    continue;
  }

  // 上传
  console.log(`⬆️  [${i + 1}/${metadata.length}] ${fileName}`);
  try {
    await client.put(ossPath, localPath);
    console.log(`   ✅ 上传成功`);
    newCount++;
    allWorks.push(workEntry);
  } catch (err) {
    console.error(`   ❌ 上传失败: ${err.message}`);
    failCount++;
  }
}

// ============ 输出结果 ============
console.log(`\n============`);
console.log(`✅ 新增: ${newCount}   ⏭️ 跳过: ${skipCount}   ❌ 失败: ${failCount}`);

if (failCount > 0) {
  console.log(`\n⚠️  有 ${failCount} 张照片上传失败，请检查后重试。`);
  process.exit(1);
}

// ============ 更新 public/config.json ============
const configPath = path.join(rootDir, 'public', 'config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.works = allWorks;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`📝 public/config.json 已更新 (${allWorks.length} 条作品)`);
} else {
  const fallbackPath = path.join(rootDir, 'scripts', 'generated-works.json');
  fs.writeFileSync(fallbackPath, JSON.stringify(allWorks, null, 2), 'utf-8');
  console.log(`📝 works 数据 → scripts/generated-works.json`);
}
