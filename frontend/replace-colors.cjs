const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir(path.join(__dirname, 'src'), function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Replace bg-white/X with bg-foreground/X
    content = content.replace(/bg-white\/(\d+)(?!\w)/g, 'bg-foreground/$1');
    content = content.replace(/bg-white\\\/(\[\d*\.?\d+\])/g, 'bg-foreground/$1'); // matches bg-white/[0.05]
    content = content.replace(/bg-white\/(\[\d*\.?\d+\])/g, 'bg-foreground/$1');
    
    // Replace border-white/X with border-foreground/X
    content = content.replace(/border-white\/(\d+)(?!\w)/g, 'border-foreground/$1');
    content = content.replace(/border-white\\\/(\[\d*\.?\d+\])/g, 'border-foreground/$1');
    content = content.replace(/border-white\/(\[\d*\.?\d+\])/g, 'border-foreground/$1');

    // Replace hover:bg-white/X with hover:bg-foreground/X
    content = content.replace(/hover:bg-white\/(\d+)/g, 'hover:bg-foreground/$1');
    content = content.replace(/hover:bg-white\/(\[\d*\.?\d+\])/g, 'hover:bg-foreground/$1');

    // We do NOT completely replace text-white because sometimes text is on primary buttons and needs to be white.
    // Instead we specifically replace text-white that are part of slate/slate-groups usually intended as foreground.
    
    // Replace specific known bad light-mode classes:
    content = content.replace(/text-slate-300/g, 'text-muted-foreground');
    content = content.replace(/text-slate-400/g, 'text-muted-foreground');
    content = content.replace(/text-slate-500/g, 'text-muted-foreground/80');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
