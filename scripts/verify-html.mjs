#!/usr/bin/env node
/**
 * Pre-deploy sanity check for BlackSwan HTML exports.
 * Fails loudly if a file is truncated or missing critical runtime blocks.
 */
import fs from 'fs';
import path from 'path';

const REQUIRED_MARKERS = [
  ['data-dc-script', '<script> block with DC runtime / Component class'],
  ['componentDidMount', 'scroll + reveal initialization'],
  ['IntersectionObserver', 'reveal-on-scroll logic'],
  ['// ---- Funnel scrub ----', 'funnel scroll-scrub effect'],
  ['// ---- Horizontal steps ----', 'horizontal step slideshow'],
  ['Noah Heinz', 'team founder card 02'],
  ['Albert Zapke', 'team founder card 03'],
  ['id="bs-contact"', 'closing contact form section'],
  ['id="bsContactForm"', 'Formspree contact form'],
];

export function verifyHtmlFile(filePath) {
  const errors = [];

  if (!fs.existsSync(filePath)) {
    return [`File not found: ${filePath}`];
  }

  const stat = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf8');
  const trimmed = content.trimEnd();

  if (!trimmed.endsWith('</html>')) {
    errors.push('File does not end with </html> — likely truncated mid-export');
  }

  if (!content.includes('</body>')) {
    errors.push('Missing </body> closing tag');
  }

  if (!content.includes('</script>')) {
    errors.push('Missing </script> closing tag');
  }

  for (const [marker, label] of REQUIRED_MARKERS) {
    if (!content.includes(marker)) {
      errors.push(`Missing required marker "${marker}" (${label})`);
    }
  }

  // Heuristic: complete build is ~80k+ bytes; truncated export was ~57k
  if (stat.size < 75000) {
    errors.push(
      `File size ${stat.size} bytes is suspiciously small (expected ~84000+ for complete export)`
    );
  }

  return errors;
}

function main() {
  const targets = process.argv.slice(2);
  if (targets.length === 0) {
    console.error('Usage: node scripts/verify-html.mjs <file-or-dir> [...]');
    process.exit(1);
  }

  const files = [];
  for (const target of targets) {
    const resolved = path.resolve(target);
    if (!fs.existsSync(resolved)) {
      console.error(`\n✗ ${resolved}\n  File not found`);
      process.exit(1);
    }
    const stat = fs.statSync(resolved);
    if (stat.isDirectory()) {
      for (const name of ['index.html', 'BlackSwan Website.dc.html']) {
        const candidate = path.join(resolved, name);
        if (fs.existsSync(candidate)) files.push(candidate);
      }
    } else {
      files.push(resolved);
    }
  }

  let failed = false;
  for (const file of files) {
    const errors = verifyHtmlFile(file);
    if (errors.length === 0) {
      const size = fs.statSync(file).size;
      console.log(`✓ ${file} (${size} bytes)`);
    } else {
      failed = true;
      console.error(`\n✗ ${file}`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
  }

  if (failed) {
    console.error('\nDeploy verification FAILED. Do not ship truncated HTML.');
    process.exit(1);
  }

  console.log('\nAll HTML files passed deploy verification.');
}

if (process.argv[1] && process.argv[1].endsWith('verify-html.mjs')) {
  main();
}
