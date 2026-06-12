const fs = require('fs');
const path = require('path');

const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu;

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(walkDir(fullPath));
      }
    } else {
      if (/\.(ts|tsx|json|css|html)$/.test(file)) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walkDir('C:\\Users\\seha\\Desktop\\t3c2');
files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = emojiRegex.exec(content)) !== null) {
      console.log(`Found emoji: ${match[0]} at file: ${file}`);
    }
  } catch (err) {
    // ignore
  }
});
console.log('Search complete.');
