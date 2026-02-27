#!/usr/bin/env node

/**
 * Watch .codex agents/config and sync to .claude/.opencode.
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const rootDir = process.cwd();
const codexAgentsDir = path.join(rootDir, ".codex", "agents");
const codexConfigPath = path.join(rootDir, ".codex", "config.toml");
const claudeGuidePath = path.join(rootDir, ".claude", "CLAUDE.md");
const syncScriptPath = path.join(rootDir, ".claude", "scripts", "sync-agents-from-codex.js");

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

function runSync() {
  return new Promise((resolve, reject) => {
    const proc = spawn("node", [syncScriptPath, "--write", "--prune"], {
      stdio: "inherit",
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`sync failed with exit code ${code}`));
      }
    });
  });
}

let timer = null;
function scheduleSync(trigger) {
  log("yellow", `Detected change: ${trigger}`);
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(async () => {
    try {
      await runSync();
      log("green", "Sync finished.");
    } catch (error) {
      log("red", `Sync error: ${error.message}`);
    }
  }, 600);
}

function watchDirectory(dirPath, filterExt = "") {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Missing directory: ${dirPath}`);
  }
  return fs.watch(dirPath, (eventType, fileName) => {
    if (!fileName) {
      scheduleSync(`${eventType} (unknown file)`);
      return;
    }
    if (filterExt && !fileName.endsWith(filterExt)) {
      return;
    }
    scheduleSync(`${eventType} ${path.join(path.basename(dirPath), fileName)}`);
  });
}

async function main() {
  if (!fs.existsSync(syncScriptPath)) {
    throw new Error(`Missing script: ${syncScriptPath}`);
  }

  log("cyan", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  log("yellow", "Watching Codex agents for sync");
  log("cyan", "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  await runSync();
  log("green", "Initial sync completed.");

  const watchers = [];
  watchers.push(watchDirectory(codexAgentsDir, ".toml"));

  if (!fs.existsSync(codexConfigPath)) {
    throw new Error(`Missing file: ${codexConfigPath}`);
  }
  if (!fs.existsSync(claudeGuidePath)) {
    throw new Error(`Missing file: ${claudeGuidePath}`);
  }
  watchers.push(
    fs.watch(codexConfigPath, (eventType) => {
      scheduleSync(`${eventType} ${path.basename(codexConfigPath)}`);
    })
  );
  watchers.push(
    fs.watch(claudeGuidePath, (eventType) => {
      scheduleSync(`${eventType} ${path.basename(claudeGuidePath)}`);
    })
  );

  log("yellow", `Watching: ${codexAgentsDir}`);
  log("yellow", `Watching: ${codexConfigPath}`);
  log("yellow", `Watching: ${claudeGuidePath}`);
  log("yellow", "Stop: Ctrl+C");

  const shutdown = () => {
    for (const watcher of watchers) {
      watcher.close();
    }
    log("yellow", "Watcher stopped.");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((error) => {
  log("red", `Error: ${error.message}`);
  process.exit(1);
});
