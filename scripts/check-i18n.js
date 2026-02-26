#!/usr/bin/env node

/**
 * i18n key parity checker
 * Verifies that all language key sets in js/i18n.js are identical.
 * Exit code 0 = pass, non-zero = fail.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const i18nPath = path.join(__dirname, '..', 'js', 'i18n.js');
const source = fs.readFileSync(i18nPath, 'utf-8');

// Extract the translations object by running in a sandbox
const sandbox = {};
const code = source
  .replace('const translations =', 'var translations =')
  .split('\nlet currentLang')[0];

vm.runInNewContext(code, sandbox);

const translations = sandbox.translations;

if (!translations) {
  console.error('ERROR: Failed to parse translations from js/i18n.js');
  process.exit(1);
}

// Recursively collect all leaf keys as dot-separated paths
function collectKeys(obj, prefix = '') {
  const keys = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys.push(...collectKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys.sort();
}

const langs = Object.keys(translations);

if (langs.length < 2) {
  console.error(`ERROR: Expected at least 2 languages, found: ${langs.join(', ')}`);
  process.exit(1);
}

console.log(`Languages: ${langs.join(', ')}`);

const keysByLang = {};
for (const lang of langs) {
  keysByLang[lang] = collectKeys(translations[lang]);
  console.log(`  ${lang}: ${keysByLang[lang].length} keys`);
}

// Compare all language pairs
let hasError = false;

for (let i = 0; i < langs.length; i++) {
  for (let j = i + 1; j < langs.length; j++) {
    const a = langs[i];
    const b = langs[j];
    const setA = new Set(keysByLang[a]);
    const setB = new Set(keysByLang[b]);

    const missingInB = keysByLang[a].filter(k => !setB.has(k));
    const missingInA = keysByLang[b].filter(k => !setA.has(k));

    if (missingInB.length > 0) {
      console.error(`\nKeys in '${a}' but missing in '${b}':`);
      missingInB.forEach(k => console.error(`  - ${k}`));
      hasError = true;
    }

    if (missingInA.length > 0) {
      console.error(`\nKeys in '${b}' but missing in '${a}':`);
      missingInA.forEach(k => console.error(`  - ${k}`));
      hasError = true;
    }
  }
}

if (hasError) {
  console.error('\n FAIL: i18n key sets are NOT identical across languages.');
  process.exit(1);
} else {
  console.log('\n PASS: All language key sets are identical.');
  process.exit(0);
}
