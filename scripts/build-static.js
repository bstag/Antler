import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const adminDir = path.join(process.cwd(), 'src', 'pages', 'admin');
const adminBackupDir = path.join(process.cwd(), 'src', 'pages', 'admin.backup');

console.log('🚀 Building static production site (admin excluded)...');

try {
  // If admin directory exists, back it up
  if (fs.existsSync(adminDir)) {
    console.log('📦 Backing up admin directory...');
    if (fs.existsSync(adminBackupDir)) {
      fs.rmSync(adminBackupDir, { recursive: true, force: true });
    }
    fs.renameSync(adminDir, adminBackupDir);
  }

  // Build with static config
  console.log('🔨 Building static site...');
  execSync('astro build --config astro.static.config.mjs', {
    stdio: 'inherit',
    cwd: process.cwd()
  });

  console.log('✅ Static build complete!');
  console.log('📁 Output: ./dist/');
  console.log('🌐 Deploy to any static host (GitHub Pages, Netlify, Vercel, etc.)');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} finally {
  // Restore admin directory
  if (fs.existsSync(adminBackupDir)) {
    console.log('🔄 Restoring admin directory...');
    if (fs.existsSync(adminDir)) {
      fs.rmSync(adminDir, { recursive: true, force: true });
    }
    fs.renameSync(adminBackupDir, adminDir);
  }
}