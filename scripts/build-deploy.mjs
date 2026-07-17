#!/usr/bin/env node
/**
 * Build the Netlify deploy folder from canonical source files.
 * Never hand-copy HTML — always run: npm run build
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyHtmlFile } from './verify-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DEPLOY = path.join(ROOT, 'deploy');
const SOURCE_HTML = path.join(ROOT, 'BlackSwan Website.dc.html');
const SOURCE_HTML_DE = path.join(ROOT, 'BlackSwan Website.de.dc.html');

const COPY_DIRS = ['assets', '_ds'];
const COPY_FILES = ['support.js'];

function rmDir(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function syncHtml(from, to) {
  const content = fs.readFileSync(from);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.writeFileSync(to, content);
}

function main() {
  if (!fs.existsSync(SOURCE_HTML)) {
    console.error(`Canonical source missing: ${SOURCE_HTML}`);
    process.exit(1);
  }

  console.log('Building deploy folder...');
  console.log(`  Source: ${SOURCE_HTML}`);

  // Sync root index.html from canonical source (fixes truncated exports)
  const rootIndex = path.join(ROOT, 'index.html');
  syncHtml(SOURCE_HTML, rootIndex);
  console.log(`  Synced: index.html (from BlackSwan Website.dc.html)`);

  // Clean rebuild of deploy/
  rmDir(DEPLOY);
  fs.mkdirSync(DEPLOY, { recursive: true });

  syncHtml(SOURCE_HTML, path.join(DEPLOY, 'index.html'));
  syncHtml(SOURCE_HTML, path.join(DEPLOY, 'BlackSwan Website.dc.html'));
  console.log('  Copied: index.html, BlackSwan Website.dc.html');

  const deployDeIndex = path.join(DEPLOY, 'de', 'index.html');
  if (fs.existsSync(SOURCE_HTML_DE)) {
    syncHtml(SOURCE_HTML_DE, deployDeIndex);
    console.log('  Copied: de/index.html (from BlackSwan Website.de.dc.html)');
  }

  for (const file of COPY_FILES) {
    const src = path.join(ROOT, file);
    if (!fs.existsSync(src)) {
      console.error(`Required file missing: ${src}`);
      process.exit(1);
    }
    copyFile(src, path.join(DEPLOY, file));
    console.log(`  Copied: ${file}`);
  }

  for (const dir of COPY_DIRS) {
    const src = path.join(ROOT, dir);
    if (!fs.existsSync(src)) {
      console.error(`Required directory missing: ${src}`);
      process.exit(1);
    }
    copyDir(src, path.join(DEPLOY, dir));
    console.log(`  Copied: ${dir}/`);
  }

  // Verify all HTML outputs before declaring success
  const htmlTargets = [
    rootIndex,
    path.join(DEPLOY, 'index.html'),
    path.join(DEPLOY, 'BlackSwan Website.dc.html'),
  ];
  if (fs.existsSync(deployDeIndex)) {
    htmlTargets.push(deployDeIndex);
  }

  let failed = false;
  for (const file of htmlTargets) {
    const errors = verifyHtmlFile(file);
    if (errors.length === 0) {
      console.log(`  ✓ Verified: ${path.relative(ROOT, file)} (${fs.statSync(file).size} bytes)`);
    } else {
      failed = true;
      console.error(`  ✗ Failed: ${path.relative(ROOT, file)}`);
      for (const err of errors) {
        console.error(`    - ${err}`);
      }
    }
  }

  if (failed) {
    console.error('\nBuild FAILED verification. Deploy folder may be incomplete.');
    process.exit(1);
  }

  console.log(`\nDeploy folder ready: ${DEPLOY}`);
}

main();
