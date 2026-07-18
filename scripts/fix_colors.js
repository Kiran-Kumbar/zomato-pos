const fs = require('fs');
const path = require('path');

const PRIMARY = '#FF5A36';

function fix(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let orig = content;

  // AI Kitchen & Grocery
  content = content.replace(/bg-purple-500 hover:bg-purple-600/g, `bg-[${PRIMARY}] hover:bg-[#E23744]`);
  content = content.replace(/bg-purple-500/g, `bg-[${PRIMARY}]`);
  content = content.replace(/text-purple-500/g, `text-[${PRIMARY}]`);
  content = content.replace(/text-purple-600 dark:text-purple-400/g, `text-[${PRIMARY}]`);
  content = content.replace(/text-purple-600/g, `text-[${PRIMARY}]`);
  content = content.replace(/hover:text-purple-500/g, `hover:text-[${PRIMARY}]`);
  content = content.replace(/hover:text-purple-600/g, `hover:text-[${PRIMARY}]`);
  content = content.replace(/dark:hover:text-purple-400/g, `dark:hover:text-[${PRIMARY}]`);
  content = content.replace(/border-purple-200/g, `border-[${PRIMARY}]/30`);
  content = content.replace(/dark:border-purple-800/g, `dark:border-[${PRIMARY}]/30`);
  content = content.replace(/border-purple-500/g, `border-[${PRIMARY}]`);
  content = content.replace(/bg-purple-50/g, `bg-[${PRIMARY}]/10`);
  content = content.replace(/dark:bg-purple-900\/30/g, `dark:bg-[${PRIMARY}]/10`);
  content = content.replace(/shadow-purple-500\/20/g, `shadow-[${PRIMARY}]/20`);
  content = content.replace(/from-purple-500 to-indigo-600/g, `bg-[${PRIMARY}]`);
  content = content.replace(/from-purple-500 to-indigo-500/g, `bg-[${PRIMARY}]`);
  
  content = content.replace(/bg-emerald-500 hover:bg-emerald-600/g, `bg-[${PRIMARY}] hover:bg-[#E23744]`);
  content = content.replace(/bg-emerald-500/g, `bg-[${PRIMARY}]`);
  content = content.replace(/text-emerald-500/g, `text-[${PRIMARY}]`);
  content = content.replace(/hover:text-emerald-500/g, `hover:text-[${PRIMARY}]`);
  content = content.replace(/border-emerald-500/g, `border-[${PRIMARY}]`);
  content = content.replace(/text-emerald-600 dark:text-emerald-400/g, `text-[${PRIMARY}]`);

  // Ensure Semantic Badges remain as their proper colors:
  // Fresh/In-Stock
  content = content.replace(/text-\[\#FF5A36\] font-bold text-sm bg-gray-100/g, 'text-emerald-600 font-bold text-sm bg-gray-100');
  content = content.replace(/<span className="text-\[\#FF5A36\] font-bold">₹/g, '<span className="text-emerald-600 font-bold">₹');
  content = content.replace(/<span className="text-\[\#FF5A36\] font-bold text-sm">₹/g, '<span className="text-emerald-600 font-bold text-sm">₹');
  // AI Generated
  content = content.replace(/text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">AI Generated/g, 'text-xs font-bold text-purple-500 uppercase tracking-wider">AI Generated');
  // Beta
  content = content.replace(
    /<span className="bg-\[\#FF5A36\] text-white text-\[9px\] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ml-1 relative -top-2">Beta<\/span>/g,
    '<span className="bg-purple-500 text-white text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ml-1 relative -top-2">Beta</span>'
  );

  if (orig !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed', filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      walkDir(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      fix(p);
    }
  }
}

walkDir(path.join(process.cwd(), 'src/app/(customer)'));
walkDir(path.join(process.cwd(), 'src/components'));

// Fix Layout of AI Kitchen
const aiPath = path.join(process.cwd(), 'src/app/(customer)/ai-kitchen/page.tsx');
if (fs.existsSync(aiPath)) {
  let c = fs.readFileSync(aiPath, 'utf8');
  c = c.replace(/min-h-screen bg-\[\#fafafa\] dark:bg-\[\#0a0a0a\] pt-24 pb-32/g, 'w-full pt-8 pb-16');
  // Revert ChefHat icon color in badge
  c = c.replace(/ChefHat className="w-4 h-4 text-\[\#FF5A36\]" \/>\s*<span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">AI Generated/g, 'ChefHat className="w-4 h-4 text-purple-500" />\n                        <span className="text-xs font-bold text-purple-500 uppercase tracking-wider">AI Generated');
  fs.writeFileSync(aiPath, c, 'utf8');
  console.log('Fixed AI Kitchen layout');
}
