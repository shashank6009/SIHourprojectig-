#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧹 Clearing all caches and build artifacts...\n');

// Directories to clean
const dirsToClean = [
  '.next',
  'node_modules/.cache',
  '.turbo'
];

// Clean directories
dirsToClean.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing ${dir}...`);
    fs.rmSync(fullPath, { recursive: true, force: true });
  }
});

console.log('\n✅ Cache clearing complete!');
console.log('\n💡 Next steps:');
console.log('   1. Start the dev server: npm run dev');
console.log('   2. Open browser in incognito/private mode');
console.log('   3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)');
console.log('   4. In browser console, run: clearCaches()');
console.log('\n🔧 This should resolve any caching issues!');
