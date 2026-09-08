#!/usr/bin/env node

import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";
import { spawnSync } from "node:child_process";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node scripts/render-mermaid-docs.mjs <markdown-file> [...]");
  process.exit(1);
}

const tmpRoot = mkdtempSync(join(tmpdir(), "mermaid-check-"));
let hadFailure = false;

function extractBlocks(markdown) {
  const regex = /```mermaid\s*\n([\s\S]*?)```/g;
  const blocks = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const blockStart = markdown.slice(0, match.index).split("\n").length + 1;
    blocks.push({
      line: blockStart,
      content: match[1].trim() + "\n",
    });
  }

  return blocks;
}

for (const file of files) {
  const markdown = readFileSync(file, "utf8");
  const blocks = extractBlocks(markdown);

  if (blocks.length === 0) {
    console.log(`${file}: no Mermaid blocks found`);
    continue;
  }

  blocks.forEach((block, index) => {
    const inputPath = join(tmpRoot, `${basename(file)}-${index + 1}.mmd`);
    const outputPath = join(tmpRoot, `${basename(file)}-${index + 1}.svg`);

    writeFileSync(inputPath, block.content, "utf8");

    const result = spawnSync(
      "npx",
      ["-y", "@mermaid-js/mermaid-cli", "-i", inputPath, "-o", outputPath],
      { encoding: "utf8" },
    );

    if (result.status !== 0) {
      hadFailure = true;
      console.error(`${file}: Mermaid block ${index + 1} failed near markdown line ${block.line}`);
      if (result.stderr.trim()) {
        console.error(result.stderr.trim());
      } else if (result.stdout.trim()) {
        console.error(result.stdout.trim());
      }
    } else {
      console.log(`${file}: Mermaid block ${index + 1} rendered successfully`);
    }
  });
}

rmSync(tmpRoot, { recursive: true, force: true });
process.exit(hadFailure ? 1 : 0);
