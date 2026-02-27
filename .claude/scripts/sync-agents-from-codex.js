#!/usr/bin/env node

/**
 * Sync agent definitions from .codex to .claude and .opencode,
 * and keep instruction docs in sync.
 *
 * Usage:
 *   node .claude/scripts/sync-agents-from-codex.js --check
 *   node .claude/scripts/sync-agents-from-codex.js --write
 *   node .claude/scripts/sync-agents-from-codex.js --write --prune
 */

const fs = require("fs");
const path = require("path");

const rootDir = process.cwd();
const codexConfigPath = path.join(rootDir, ".codex", "config.toml");
const codexAgentsDir = path.join(rootDir, ".codex", "agents");
const claudeAgentsDir = path.join(rootDir, ".claude", "agents");
const opencodeAgentsDir = path.join(rootDir, ".opencode", "agents");
const claudeGuidePath = path.join(rootDir, ".claude", "CLAUDE.md");
const codexGuidePath = path.join(rootDir, "AGENTS.md");

const args = new Set(process.argv.slice(2));
const isCheck = args.has("--check");
const isWrite = args.has("--write");
const isPrune = args.has("--prune");

if (!isCheck && !isWrite) {
  console.error("Missing mode. Use --check or --write.");
  process.exit(1);
}

const colors = {
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
};

function log(color, message) {
  process.stdout.write(`${colors[color]}${message}${colors.reset}\n`);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalizeEol(text) {
  return text.replace(/\r\n/g, "\n");
}

function ensureTrailingNewline(text) {
  return text.endsWith("\n") ? text : `${text}\n`;
}

function parseCodexConfig(filePath) {
  const text = normalizeEol(readFile(filePath));
  const lines = text.split("\n");

  const descriptions = new Map();
  let currentAgent = null;

  for (const line of lines) {
    const sectionMatch = line.match(/^\[agents\.([a-z0-9-]+)\]$/i);
    if (sectionMatch) {
      currentAgent = sectionMatch[1];
      continue;
    }

    if (!currentAgent) {
      continue;
    }

    const descriptionMatch = line.match(/^description\s*=\s*"(.*)"\s*$/);
    if (descriptionMatch) {
      descriptions.set(currentAgent, descriptionMatch[1]);
    }
  }

  return descriptions;
}

function extractDeveloperInstructions(tomlText, filePath) {
  const marker = "developer_instructions = '''";
  const start = tomlText.indexOf(marker);
  if (start === -1) {
    throw new Error(`developer_instructions block not found: ${filePath}`);
  }

  const bodyStart = start + marker.length;
  const end = tomlText.indexOf("\n'''", bodyStart);
  if (end === -1) {
    throw new Error(`developer_instructions end marker not found: ${filePath}`);
  }

  let body = tomlText.slice(bodyStart, end);
  if (body.startsWith("\n")) {
    body = body.slice(1);
  }
  return ensureTrailingNewline(normalizeEol(body));
}

function listCodexAgentNames() {
  return fs
    .readdirSync(codexAgentsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".toml"))
    .map((entry) => entry.name.replace(/\.toml$/, ""))
    .sort();
}

function renderClaudeAgent(agentName, description, body) {
  return ensureTrailingNewline(
    normalizeEol(`---
name: ${agentName}
description: ${description}
tools: Read, Write, Grep, Bash
---

${body}`)
  );
}

function renderOpenCodeAgent(description, body) {
  return ensureTrailingNewline(
    normalizeEol(`---
description: ${description}
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

${body}`)
  );
}

function writeIfChanged(filePath, nextText) {
  if (fs.existsSync(filePath)) {
    const prev = normalizeEol(readFile(filePath));
    if (prev === nextText) {
      return false;
    }
  }
  fs.writeFileSync(filePath, nextText, "utf8");
  return true;
}

function checkEquals(filePath, expectedText) {
  if (!fs.existsSync(filePath)) {
    return { ok: false, reason: "missing" };
  }
  const actual = normalizeEol(readFile(filePath));
  if (actual !== expectedText) {
    return { ok: false, reason: "different" };
  }
  return { ok: true, reason: "same" };
}

function pruneUnexpectedFiles(targetDir, allowedAgentNames, extension) {
  const keep = new Set(allowedAgentNames.map((name) => `${name}.${extension}`));
  const removed = [];

  for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(`.${extension}`)) {
      continue;
    }
    if (keep.has(entry.name)) {
      continue;
    }
    const filePath = path.join(targetDir, entry.name);
    fs.unlinkSync(filePath);
    removed.push(entry.name);
  }

  return removed;
}

function findUnexpectedFiles(targetDir, allowedAgentNames, extension) {
  const keep = new Set(allowedAgentNames.map((name) => `${name}.${extension}`));
  const unexpected = [];

  for (const entry of fs.readdirSync(targetDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(`.${extension}`)) {
      continue;
    }
    if (!keep.has(entry.name)) {
      unexpected.push(entry.name);
    }
  }

  return unexpected.sort();
}

function main() {
  if (!fs.existsSync(codexConfigPath)) {
    throw new Error(`Missing file: ${codexConfigPath}`);
  }
  if (!fs.existsSync(codexAgentsDir)) {
    throw new Error(`Missing directory: ${codexAgentsDir}`);
  }
  if (!fs.existsSync(claudeAgentsDir)) {
    throw new Error(`Missing directory: ${claudeAgentsDir}`);
  }
  if (!fs.existsSync(opencodeAgentsDir)) {
    throw new Error(`Missing directory: ${opencodeAgentsDir}`);
  }
  if (!fs.existsSync(claudeGuidePath)) {
    throw new Error(`Missing file: ${claudeGuidePath}`);
  }

  const descriptions = parseCodexConfig(codexConfigPath);
  const agentNames = listCodexAgentNames();

  let writeCount = 0;
  let mismatchCount = 0;
  let removedCount = 0;

  for (const agentName of agentNames) {
    const description = descriptions.get(agentName) || "";
    const tomlPath = path.join(codexAgentsDir, `${agentName}.toml`);
    const body = extractDeveloperInstructions(readFile(tomlPath), tomlPath);

    const claudeText = renderClaudeAgent(agentName, description, body);
    const opencodeText = renderOpenCodeAgent(description, body);

    const claudePath = path.join(claudeAgentsDir, `${agentName}.md`);
    const opencodePath = path.join(opencodeAgentsDir, `${agentName}.md`);

    if (isCheck) {
      const claudeCheck = checkEquals(claudePath, claudeText);
      const opencodeCheck = checkEquals(opencodePath, opencodeText);

      if (!claudeCheck.ok) {
        mismatchCount += 1;
        log("red", `CLAUDE ${claudeCheck.reason.toUpperCase()}: ${agentName}.md`);
      }
      if (!opencodeCheck.ok) {
        mismatchCount += 1;
        log("red", `OPENCODE ${opencodeCheck.reason.toUpperCase()}: ${agentName}.md`);
      }
    }

    if (isWrite) {
      if (writeIfChanged(claudePath, claudeText)) {
        writeCount += 1;
        log("yellow", `Updated .claude/agents/${agentName}.md`);
      }
      if (writeIfChanged(opencodePath, opencodeText)) {
        writeCount += 1;
        log("yellow", `Updated .opencode/agents/${agentName}.md`);
      }
    }
  }

  if (isWrite && isPrune) {
    const removedClaude = pruneUnexpectedFiles(claudeAgentsDir, agentNames, "md");
    const removedOpenCode = pruneUnexpectedFiles(opencodeAgentsDir, agentNames, "md");
    removedCount += removedClaude.length + removedOpenCode.length;

    for (const fileName of removedClaude) {
      log("yellow", `Removed .claude/agents/${fileName}`);
    }
    for (const fileName of removedOpenCode) {
      log("yellow", `Removed .opencode/agents/${fileName}`);
    }
  }

  if (isCheck) {
    const extraClaude = findUnexpectedFiles(claudeAgentsDir, agentNames, "md");
    const extraOpenCode = findUnexpectedFiles(opencodeAgentsDir, agentNames, "md");

    for (const fileName of extraClaude) {
      mismatchCount += 1;
      log("red", `CLAUDE EXTRA: ${fileName}`);
    }
    for (const fileName of extraOpenCode) {
      mismatchCount += 1;
      log("red", `OPENCODE EXTRA: ${fileName}`);
    }

    const guideCheck = checkEquals(codexGuidePath, ensureTrailingNewline(normalizeEol(readFile(claudeGuidePath))));
    if (!guideCheck.ok) {
      mismatchCount += 1;
      log("red", `CODEX GUIDE ${guideCheck.reason.toUpperCase()}: AGENTS.md`);
    }
  }

  if (isWrite) {
    const guideText = ensureTrailingNewline(normalizeEol(readFile(claudeGuidePath)));
    if (writeIfChanged(codexGuidePath, guideText)) {
      writeCount += 1;
      log("yellow", "Updated AGENTS.md from .claude/CLAUDE.md");
    }
  }

  if (isWrite) {
    log("green", `Sync completed. updated=${writeCount} removed=${removedCount}`);
  } else if (mismatchCount === 0) {
    log("green", "Check passed. agents and guide are in sync.");
  } else {
    log("red", `Check failed. mismatches=${mismatchCount}`);
    process.exit(1);
  }
}

try {
  main();
} catch (error) {
  log("red", `Error: ${error.message}`);
  process.exit(1);
}
