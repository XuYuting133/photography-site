/**
 * OSS 批量上传脚本（缩略图 + 项目支持）
 *
 * 用法：
 *   OSS_AK_ID=xxx OSS_AK_SECRET=xxx npm run upload
 *
 * 功能：
 *   1. 读取 src/data/content/metadata.json（works + projects）
 *   2. 本地生成缩略图（600px 宽）
 *   3. 原图 → photos/originals/  缩略图 → photos/thumbnails/
 *   4. 跳过已存在的文件
 *   5. 自动更新 public/config.json
 */

import OSS from 'ali-oss';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

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
const THUMBNAIL_WIDTH = 600;

// ============ 读取 metadata ============
const metadataPath = path.join(rootDir, 'src', 'data', 'content', 'metadata.json');
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

// ============ 获取 OSS 已有文件 ============
async function getExistingFiles() {
  const existing = new Set();
  let marker = null;
  do {
    const result = await client.list({ prefix: 'photos/', 'max-keys': 500, marker });
    if (result.objects) result.objects.forEach((o) => existing.add(o.name));
    marker = result.nextMarker;
  } while (marker);
  return existing;
}

// ============ 上传单张照片（原图 + 缩略图）============
async function uploadPhoto(fileName, meta) {
  const localPath = path.join(rootDir, 'src', 'data', 'content', fileName);

  if (!fs.existsSync(localPath)) {
    console.error(`   ❌ 文件不存在: ${localPath}`);
    return null;
  }

  const originalOssPath = `photos/originals/${fileName}`;
  const thumbOssPath = `photos/thumbnails/${fileName}`;

  // 上传原图
  const existingFiles = await getExistingFiles();
  if (!existingFiles.has(originalOssPath)) {
    await client.put(originalOssPath, localPath);
    console.log(`      📷 原图已上传`);
  }

  // 生成并上传缩略图
  if (!existingFiles.has(thumbOssPath)) {
    const thumbBuffer = await sharp(localPath)
      .resize(THUMBNAIL_WIDTH)
      .jpeg({ quality: 80 })
      .toBuffer();
    await client.put(thumbOssPath, thumbBuffer);
    console.log(`      🔍 缩略图已生成 (${THUMBNAIL_WIDTH}px)`);
  }

  return {
    title: meta.title,
    date: meta.date,
    location: meta.location,
    description: meta.description || '',
    featured: meta.featured || false,
    imageUrl: `${OSS_BASE_URL}/${originalOssPath}`,
    thumbnailUrl: `${OSS_BASE_URL}/${thumbOssPath}`,
  };
}

// ============ 主流程 ============
console.log('🔍 检查 OSS 已有文件...\n');

const allIndividualWorks = [];
const allProjects = [];
let newCount = 0;
let skipCount = 0;
let failCount = 0;

// --- 上传独立作品 ---
const works = metadata.works || [];
console.log(`📋 独立作品: ${works.length} 张\n`);

for (let i = 0; i < works.length; i++) {
  const item = works[i];
  const fileName = path.basename(item.file);

  console.log(`⬆️  [${i + 1}/${works.length}] ${fileName}`);
  const result = await uploadPhoto(fileName, item);
  if (result) {
    allIndividualWorks.push(result);
    newCount++;
  } else {
    failCount++;
  }
}

// --- 上传项目作品 ---
const projects = metadata.projects || [];
console.log(`\n📁 项目: ${projects.length} 个\n`);

for (const proj of projects) {
  console.log(`📁 ${proj.name} (${proj.works.length} 张)`);
  const projectWorks = [];

  for (let i = 0; i < proj.works.length; i++) {
    const item = proj.works[i];
    const fileName = path.basename(item.file);

    console.log(`   ⬆️  [${i + 1}/${proj.works.length}] ${fileName}`);
    const result = await uploadPhoto(fileName, item);
    if (result) {
      projectWorks.push(result);
      newCount++;
    } else {
      failCount++;
    }
  }

  allProjects.push({
    name: proj.name,
    description: proj.description || '',
    works: projectWorks,
  });
}

// ============ 输出结果 ============
console.log(`\n============`);
console.log(`✅ 处理完成: ${newCount} 张  ❌ 失败: ${failCount}`);

if (failCount > 0) {
  console.log(`\n⚠️  有 ${failCount} 张照片处理失败，请检查后重试。`);
  process.exit(1);
}

// ============ 更新 public/config.json ============
const configPath = path.join(rootDir, 'public', 'config.json');
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.works = allIndividualWorks;
  config.projects = allProjects;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
  console.log(`📝 public/config.json 已更新`);
  console.log(`   独立作品: ${allIndividualWorks.length}  项目: ${allProjects.length}`);
} else {
  console.log(`⚠️  public/config.json 不存在，请先创建`);
}
