/**
 * Happy Birthday Template - Open Source Packaging Script (Sprint C Series)
 * 專為「淨身出戶」打造的開源淨化腳本。
 * 
 * 本腳本將會：
 * 1. 建立獨立資料夾。
 * 2. 物理隔離隱私目錄 (.git, Document, .gemini)。
 * 3. 抽換公開版配置檔。
 * 4. 抹除真實情書與感性照片。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 [Sprint C] 淨化腳本發動中...');

const sourceDir = path.resolve(__dirname, '..');
const targetDir = path.resolve(__dirname, '../../HappyBirthday-Template');

// [Sprint C3] 黑名單：絕對不能複製過去的隱私目錄與建置產物
const blacklist = ['.git', '.gemini', 'Document', 'node_modules', 'dist'];

// [Sprint C2] 階層式複製邏輯
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  const itemName = path.basename(src);

  // [Sprint C3] 如果是黑名單內的項目，直接阻擋物理隔離
  if (blacklist.includes(itemName)) {
    console.log(`🛑 [安全過濾] 阻擋隱私目錄: ${itemName}`);
    return;
  }

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log(`📦 [Sprint C2] 正在將專案克隆至開源安全區...\n(目標路徑: ${targetDir})`);
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
copyRecursiveSync(sourceDir, targetDir);
console.log('✅ 核心過濾與複製完成！');

// [Sprint C4/C5] 隱私設定檔抽換與資料抹除
const targetConfigPath = path.join(targetDir, 'src', 'app', 'content.config.ts');
const targetPublicConfigPath = path.join(targetDir, 'src', 'app', 'content.config.public.ts');

if (fs.existsSync(targetPublicConfigPath)) {
  console.log('🔄 [Sprint C4/C5] 執行配置檔安全抽換，正在抹除最後的隱私對話...');
  fs.renameSync(targetPublicConfigPath, targetConfigPath);
  console.log('✨ 真實私房話設定檔已遭抹滅，純淨開源版公版注入成功！');
}

// [Sprint C6/C7] 媒體資產淨空與範例注入
const targetImagesDir = path.join(targetDir, 'src', 'assets', 'images');
if (fs.existsSync(targetImagesDir)) {
  console.log('🧹 [Sprint C6] 正在銷毀所有的真實相片與隱私回憶...');
  const files = fs.readdirSync(targetImagesDir);
  files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      fs.unlinkSync(path.join(targetImagesDir, file));
    }
  });

  console.log('🖼️ [Sprint C7] 正在注入無版權的 sample.jpg 範例黑底圖...');
  // 注入一張 1x1 的透明/純色圖檔做為公版 placeholder 防止 Angular 發生找不到檔案的壞圖片圖示 
  const blankImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  fs.writeFileSync(path.join(targetImagesDir, 'sample.jpg'), Buffer.from(blankImageBase64, 'base64'));
}

// [Sprint C8] 歷史紀錄斬斷
try {
  console.log('✂️  [Sprint C8] 正在斬斷過去的 Git 歷史紀錄，建立全新開源時空...');
  execSync('git init', { cwd: targetDir, stdio: 'ignore' });
  console.log('✨ Git 初始化完成，這是一個沒有過去的純潔開源包了！');
} catch (error) {
  console.log('⚠️ [Sprint C8] Git 初始化失敗，請自行確保您有安裝 git。');
}

console.log('\n🎉 [大功告成] HappyBirthday-Template 開源公版已準備就緒，隨時可以 Push！');
