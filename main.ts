// SPDX-License-Identifier: MIT
// The Excuse That Almost Works — the entry program.
// It writes one line to the kit's output file: the text a gamer sends
// the boss to skip work during GTA 6 launch week. The line is a cover
// story, not a confession: a train held at the depot, a signal failure,
// and a forty-minute wait that has already happened twice.

import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "Sorry, my train's held at the depot, signal failure, they're saying 40 minutes but it's been 40 minutes twice.";

function wordCount(text: string): number {
  return text.split(/\s+/).filter((part) => part.length > 0).length;
}

function checkExcuse(text: string): void {
  if (text.length < 1 || text.length > 140) {
    throw new Error(`excuse must be 1-140 characters, got ${text.length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("excuse must not be only whitespace");
  }
  const words = wordCount(text);
  if (words > 20) {
    throw new Error(`excuse must be at most 20 words, got ${words}`);
  }
  if (text !== text.trim()) {
    throw new Error("excuse must not start or end with whitespace");
  }
  if (text.includes("\n")) {
    throw new Error("excuse must be a single line");
  }
}

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR;
  if (!outDir) {
    throw new Error("MAKEFUN_OUTPUT_DIR is not set");
  }
  checkExcuse(EXCUSE);
  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "entry.txt");
  writeFileSync(target, EXCUSE, "utf8");
  chmodSync(target, 0o644);
  const written = readFileSync(target, "utf8");
  if (written !== EXCUSE) {
    throw new Error(`entry.txt mismatch: expected ${EXCUSE.length} chars, got ${written.length}`);
  }
  console.log(`wrote ${EXCUSE.length}-character, ${wordCount(EXCUSE)}-word entry to ${target}`);
}

main();
