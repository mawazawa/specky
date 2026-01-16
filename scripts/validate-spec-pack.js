import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const SPEC_PACK_DIR = process.argv[2] || '.';

function validateSpecPack(dir) {
  console.log(`\n🔍 Validating Spec Pack in: ${dir}`);
  let errors = 0;

  // 1. Check File Structure
  const requiredFiles = ['meta.json', 'tasks.md'];
  requiredFiles.forEach(file => {
    if (!fs.existsSync(path.join(dir, file))) {
      console.error(`❌ Missing file: ${file}`);
      errors++;
    }
  });

  if (errors > 0) process.exit(1);

  // 2. Validate Atomic Tasks
  const tasksPath = path.join(dir, 'tasks.md');
  const tasksContent = fs.readFileSync(tasksPath, 'utf8');
  
  // Simple regex to parse tasks (Assuming strictly formatted markdown)
  // Look for "Files:" line
  const fileLines = tasksContent.match(/Files: (.*)/g) || [];
  
  fileLines.forEach((line, index) => {
    // Files: src/a.ts, src/b.ts
    const fileList = line.replace('Files:', '').split(',').map(f => f.trim()).filter(f => f.length > 0);
    
    if (fileList.length > 3) {
      console.error(`❌ Atomic Task Violation (Task #${index + 1}): Touches ${fileList.length} files (Max 3).`);
      console.error(`   Files: ${fileList.join(', ')}`);
      errors++;
    } else {
      console.log(`✅ Task #${index + 1}: ${fileList.length} files (Atomic)`);
    }
  });

  // 3. Validate Meta Schema (Basic check)
  try {
    const metaPath = path.resolve(path.join(dir, 'meta.json'));
    const metaContent = fs.readFileSync(metaPath, 'utf8');
    const meta = JSON.parse(metaContent);

    if (!meta.specPackVersion) {
      console.error(`❌ meta.json missing 'specPackVersion'`);
      errors++;
    }
    if (!meta.verificationDate) {
      console.error(`❌ meta.json missing 'verificationDate'`);
      errors++;
    }
  } catch (e) {
    console.error(`❌ Invalid meta.json: ${e.message}`);
    errors++;
  }

  if (errors === 0) {
    console.log(`\n✨ Spec Pack is VALID.`);
    process.exit(0);
  } else {
    console.error(`\n💀 Validation FAILED with ${errors} errors.`);
    process.exit(1);
  }
}

validateSpecPack(SPEC_PACK_DIR);
