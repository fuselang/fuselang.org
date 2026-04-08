const Parser = require('tree-sitter');
const Fuse = require('tree-sitter-fuse');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Capture name → CSS class mapping (from tree-sitter-fuse highlights.scm)
const CAPTURE_CLASSES = {
  'keyword': 'k',
  'keyword.function': 'kf',
  'type': 'nc',
  'function': 'nf',
  'function.method': 'na',
  'parameter': 'nv',
  'variable': null,           // default text, no wrapping needed
  'variable.builtin': null,    // self — no special highlighting
  'constant': 'nc',
  'boolean': 'bp',
  'number': 'mi',
  'float': 'mf',
  'string': 's',
  'escape': 's',
  'comment': 'c',
  'spell': null,              // ignore spell capture
  'operator': 'o',
  'property': 'na',
  'punctuation.bracket': 'p',
  'punctuation.delimiter': 'p',
};

// Initialize parser
const parser = new Parser();
parser.setLanguage(Fuse);

const querySource = fs.readFileSync(
  require.resolve('tree-sitter-fuse/queries/highlights.scm'),
  'utf8'
);
const query = new Parser.Query(Fuse, querySource);

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightCode(code) {
  const tree = parser.parse(code);
  const captures = query.captures(tree.rootNode);

  // Build a list of non-overlapping highlight ranges.
  // tree-sitter captures can overlap (e.g., @variable and @function on same node).
  // We want the most specific capture (last in list wins for same range,
  // but we prefer non-@variable captures).
  const ranges = [];
  const seen = new Map(); // startIndex-endIndex → index in ranges

  for (const cap of captures) {
    const cls = CAPTURE_CLASSES[cap.name];
    if (cls === null || cls === undefined) continue; // skip @variable, @spell, etc.

    const key = cap.node.startIndex + '-' + cap.node.endIndex;
    if (seen.has(key)) {
      // Replace with more specific capture (later captures are more specific in tree-sitter)
      ranges[seen.get(key)] = {
        start: cap.node.startIndex,
        end: cap.node.endIndex,
        cls: cls,
      };
    } else {
      seen.set(key, ranges.length);
      ranges.push({
        start: cap.node.startIndex,
        end: cap.node.endIndex,
        cls: cls,
      });
    }
  }

  // Sort by start position, then by length (shorter first for nesting)
  ranges.sort((a, b) => a.start - b.start || a.end - b.end);

  // Build HTML by walking through the code
  let result = '';
  let pos = 0;

  for (const r of ranges) {
    if (r.start < pos) continue; // skip overlapping ranges already covered

    // Add unhighlighted text before this range
    if (r.start > pos) {
      result += escapeHtml(code.slice(pos, r.start));
    }

    // Add highlighted token
    result += '<span class="' + r.cls + '">' + escapeHtml(code.slice(r.start, r.end)) + '</span>';
    pos = r.end;
  }

  // Add remaining text
  if (pos < code.length) {
    result += escapeHtml(code.slice(pos));
  }

  return result;
}

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function extractFuseBlocks(content) {
  const blocks = [];
  const re = /\{\{<\s*fuse\s*>\}\}([\s\S]*?)\{\{<\s*\/fuse\s*>\}\}/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function walkDir(dir, ext) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walkDir(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

// Main
const contentDir = path.join(__dirname, '..', 'content');
const dataDir = path.join(__dirname, '..', 'data');

// Ensure data dir exists
fs.mkdirSync(dataDir, { recursive: true });

const highlights = {};
let count = 0;

// Process all markdown content files
const mdFiles = walkDir(contentDir, '.md');
for (const file of mdFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const blocks = extractFuseBlocks(content);
  for (const block of blocks) {
    const trimmed = block.replace(/^\n/, '').replace(/\n$/, '');
    const hash = md5(trimmed);
    if (!highlights[hash]) {
      highlights[hash] = highlightCode(trimmed);
      count++;
    }
  }
}

// Write data file
fs.writeFileSync(
  path.join(dataDir, 'highlights.json'),
  JSON.stringify(highlights, null, 2)
);

console.log(`Generated ${count} highlighted code blocks → data/highlights.json`);
