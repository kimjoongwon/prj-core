#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const DEFAULT_CONFIG = {
  worktreeRoot: "../wt",
  directoryNameTemplate: "{{repo}}-{{ticket}}",
  branchPrefix: "feat",
  baseRef: "origin/main",
  envFileName: ".env.worktree",
  port: {
    offsetStep: 20,
    map: {
      ADMIN_WEB_PORT: 3000,
      PROPOSAL_WEB_PORT: 3001,
      CORE_API_PORT: 3006,
      IDP_API_PORT: 3007,
      IDP_WEB_PORT: 3008,
      STORYBOOK_PORT: 6006
    }
  },
  tmux: {
    enabled: true,
    sessionPrefix: "wt",
    windows: [
      { name: "code" },
      { name: "web" },
      { name: "api" },
      { name: "test" }
    ]
  }
};

function main() {
  try {
    const parsed = parseArgs(process.argv.slice(2));
    const command = parsed.command || "help";
    const args = parsed.args;
    const configOverride = parsed.configPath;

    switch (command) {
      case "help":
        printHelp();
        break;
      case "init":
        runInit(configOverride);
        break;
      case "new":
        runNew(args, configOverride);
        break;
      case "go":
        runGo(args, configOverride);
        break;
      case "list":
        runList(configOverride);
        break;
      case "rm":
        runRemove(args, configOverride);
        break;
      default:
        throw new Error(`Unknown command: ${command}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`error: ${message}`);
    process.exit(1);
  }
}

function parseArgs(argv) {
  let configPath;
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      return { command: "help", args: [], configPath };
    }
    if (arg === "--config") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--config requires a path value.");
      }
      configPath = value;
      index += 1;
      continue;
    }
    positional.push(arg);
  }

  return {
    command: positional[0] || "help",
    args: positional.slice(1),
    configPath
  };
}

function printHelp() {
  console.log(`wt - reusable git worktree + tmux helper

Usage:
  node scripts/wt.js <command> [args] [--config <path>]

Commands:
  init                       Create default config when missing.
  new <ticket>               Create branch/worktree + env + tmux session.
  go <ticket-or-branch>      Attach tmux session or print cd path.
  list                       Show worktree entries with status.
  rm <ticket-or-branch>      Remove worktree and delete local branch by default.
  help                       Show this help.

Options:
  --config <path>            Override config path (default: .wt/config.json).

Examples:
  node scripts/wt.js init
  node scripts/wt.js new CORE-123
  node scripts/wt.js go CORE-123
  node scripts/wt.js rm CORE-123 --keep-branch
  node scripts/wt.js rm CORE-123 --force
`);
}

function runInit(configOverride) {
  const repoRoot = getRepoRoot();
  const configPath = resolveConfigPath(repoRoot, configOverride);
  if (fs.existsSync(configPath)) {
    console.log(`Config exists: ${configPath}`);
    return;
  }

  ensureDir(path.dirname(configPath));
  fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2) + "\n", "utf8");
  console.log(`Config created: ${configPath}`);
}

function runNew(args, configOverride) {
  const ticketInput = args[0];
  if (!ticketInput) {
    throw new Error("new requires <ticket>.");
  }

  const context = loadContext(configOverride);
  const ticket = sanitizeTicket(ticketInput);
  const branch = buildBranchName(ticket, context.config.branchPrefix);

  const duplicate = findDuplicate(context.registry.entries, ticket, branch);
  if (duplicate) {
    throw new Error(`Entry already exists for ${duplicate.branch}. Use "go" or "rm".`);
  }
  if (branchExists(context.repoRoot, branch)) {
    throw new Error(`Branch already exists: ${branch}`);
  }

  const slot = allocateSlot(context.registry.entries);
  const repoName = path.basename(context.repoRoot);
  const directoryName = renderTemplate(context.config.directoryNameTemplate, {
    repo: repoName,
    ticket,
    branch: branch.replace(/\//g, "-"),
    slot
  });
  const worktreeRoot = resolvePath(context.config.worktreeRoot, context.repoRoot);
  const worktreePath = path.resolve(worktreeRoot, directoryName);
  const envFilePath = path.join(worktreePath, context.config.envFileName);

  if (fs.existsSync(worktreePath)) {
    throw new Error(`Worktree path already exists: ${worktreePath}`);
  }
  ensureDir(worktreeRoot);

  run("git", ["worktree", "add", "-b", branch, worktreePath, context.config.baseRef], {
    cwd: context.repoRoot
  });

  writeEnvFile({
    ticket,
    branch,
    slot,
    envFilePath,
    config: context.config
  });

  let sessionName = "";
  if (context.config.tmux.enabled && isCommandAvailable("tmux")) {
    sessionName = ensureTmuxSession({
      branch,
      worktreePath,
      tmuxConfig: context.config.tmux
    });
  }

  const entry = {
    ticket,
    branch,
    slot,
    worktreePath,
    envFilePath,
    sessionName,
    createdAt: new Date().toISOString()
  };

  context.registry.entries.push(entry);
  saveRegistry(context.registryPath, context.registry);

  console.log(`Created: ${ticket}`);
  console.log(`Branch : ${branch}`);
  console.log(`Path   : ${worktreePath}`);
  console.log(`Env    : ${envFilePath}`);
  if (sessionName) {
    console.log(`Tmux   : ${sessionName}`);
  } else if (context.config.tmux.enabled) {
    console.log("Tmux   : skipped (tmux not available)");
  }
}

function runGo(args, configOverride) {
  const query = args[0];
  if (!query) {
    throw new Error("go requires <ticket-or-branch>.");
  }

  const context = loadContext(configOverride);
  const entry = findEntry(context.registry.entries, query);
  if (!entry) {
    throw new Error(`Entry not found: ${query}`);
  }
  if (!fs.existsSync(entry.worktreePath)) {
    throw new Error(`Worktree path missing: ${entry.worktreePath}`);
  }

  const tmuxEnabled = context.config.tmux.enabled && isCommandAvailable("tmux");
  if (tmuxEnabled) {
    if (!entry.sessionName) {
      entry.sessionName = ensureTmuxSession({
        branch: entry.branch,
        worktreePath: entry.worktreePath,
        tmuxConfig: context.config.tmux
      });
      saveRegistry(context.registryPath, context.registry);
    } else if (!tmuxSessionExists(entry.sessionName)) {
      entry.sessionName = ensureTmuxSession({
        branch: entry.branch,
        worktreePath: entry.worktreePath,
        tmuxConfig: context.config.tmux
      });
      saveRegistry(context.registryPath, context.registry);
    }

    if (!tmuxSessionExists(entry.sessionName)) {
      throw new Error(`tmux session not available: ${entry.sessionName}`);
    }

    if (process.env.TMUX) {
      runInherit("tmux", ["switch-client", "-t", entry.sessionName]);
    } else {
      runInherit("tmux", ["attach-session", "-t", entry.sessionName]);
    }
    return;
  }

  console.log(`cd ${entry.worktreePath}`);
}

function runList(configOverride) {
  const context = loadContext(configOverride);
  const entries = [...context.registry.entries].sort((a, b) => Number(a.slot) - Number(b.slot));
  if (entries.length === 0) {
    console.log("No entries.");
    return;
  }

  const tmuxAvailable = isCommandAvailable("tmux");
  const rows = entries.map((entry) => {
    const worktreeStatus = fs.existsSync(entry.worktreePath) ? "yes" : "missing";

    let tmuxStatus = "off";
    if (context.config.tmux.enabled) {
      if (!tmuxAvailable) {
        tmuxStatus = "na";
      } else if (!entry.sessionName) {
        tmuxStatus = "none";
      } else {
        tmuxStatus = tmuxSessionExists(entry.sessionName) ? "up" : "down";
      }
    }

    return [
      entry.ticket || "",
      entry.branch || "",
      String(entry.slot ?? ""),
      worktreeStatus,
      tmuxStatus,
      entry.worktreePath || ""
    ];
  });

  printTable(
    ["ticket", "branch", "slot", "worktree", "tmux", "path"],
    rows
  );
}

function runRemove(args, configOverride) {
  const parsed = parseRemoveArgs(args);
  const query = parsed.query;
  if (!query) {
    throw new Error("rm requires <ticket-or-branch>.");
  }

  const context = loadContext(configOverride);
  const entry = findEntry(context.registry.entries, query);
  if (!entry) {
    throw new Error(`Entry not found: ${query}`);
  }

  const tmuxAvailable = isCommandAvailable("tmux");
  if (tmuxAvailable && entry.sessionName && tmuxSessionExists(entry.sessionName)) {
    run("tmux", ["kill-session", "-t", entry.sessionName]);
    console.log(`Tmux stopped: ${entry.sessionName}`);
  }

  if (fs.existsSync(entry.worktreePath)) {
    if (!parsed.force) {
      const status = run("git", ["status", "--porcelain"], { cwd: entry.worktreePath });
      if (status) {
        throw new Error(
          `Worktree has uncommitted changes: ${entry.worktreePath}. Use --force to remove anyway.`
        );
      }
    }

    const removeArgs = ["worktree", "remove"];
    if (parsed.force) {
      removeArgs.push("--force");
    }
    removeArgs.push(entry.worktreePath);
    run("git", removeArgs, { cwd: context.repoRoot });
    console.log(`Worktree removed: ${entry.worktreePath}`);
  } else {
    console.log(`Worktree missing: ${entry.worktreePath}`);
  }
  runAllowFailure("git", ["worktree", "prune"], { cwd: context.repoRoot });

  if (parsed.deleteBranch) {
    if (branchExists(context.repoRoot, entry.branch)) {
      const deleteArgs = ["branch", parsed.force ? "-D" : "-d", entry.branch];
      const deleteResult = runAllowFailure("git", deleteArgs, { cwd: context.repoRoot });
      if (deleteResult.status === 0) {
        console.log(`Branch deleted: ${entry.branch}`);
      } else {
        const message =
          (deleteResult.stderr || deleteResult.stdout || "").trim() ||
          `Unable to delete branch ${entry.branch}`;
        console.log(`Branch kept: ${entry.branch} (${message})`);
      }
    } else {
      console.log(`Branch missing: ${entry.branch}`);
    }
  } else {
    console.log(`Branch kept: ${entry.branch}`);
  }

  context.registry.entries = context.registry.entries.filter((item) => item.branch !== entry.branch);
  saveRegistry(context.registryPath, context.registry);
  console.log(`Registry updated: ${path.basename(context.registryPath)}`);
}

function parseRemoveArgs(args) {
  let query = "";
  let deleteBranch = true;
  let force = false;

  for (const arg of args) {
    if (arg === "--keep-branch" || arg === "--no-delete-branch") {
      deleteBranch = false;
      continue;
    }
    if (arg === "--delete-branch") {
      deleteBranch = true;
      continue;
    }
    if (arg === "--force" || arg === "-f") {
      force = true;
      continue;
    }
    if (!query) {
      query = arg;
      continue;
    }
    throw new Error(`Unexpected rm argument: ${arg}`);
  }

  return { query, deleteBranch, force };
}

function loadContext(configOverride) {
  const repoRoot = getRepoRoot();
  const configPath = resolveConfigPath(repoRoot, configOverride);
  const config = loadConfig(configPath);
  const commonDir = getGitCommonDir(repoRoot);
  const registryPath = path.join(commonDir, "wt-tool", "registry.json");
  const registry = loadRegistry(registryPath);

  return {
    repoRoot,
    configPath,
    config,
    registryPath,
    registry
  };
}

function getRepoRoot() {
  return run("git", ["rev-parse", "--show-toplevel"]);
}

function getGitCommonDir(repoRoot) {
  const raw = run("git", ["rev-parse", "--git-common-dir"], { cwd: repoRoot });
  return resolvePath(raw, repoRoot);
}

function resolveConfigPath(repoRoot, configOverride) {
  if (!configOverride) {
    return path.join(repoRoot, ".wt", "config.json");
  }
  return resolvePath(configOverride, process.cwd());
}

function resolvePath(targetPath, baseDir) {
  if (path.isAbsolute(targetPath)) {
    return targetPath;
  }
  return path.resolve(baseDir, targetPath);
}

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config not found: ${configPath}. Run "node scripts/wt.js init".`);
  }

  let parsed;
  try {
    const content = fs.readFileSync(configPath, "utf8");
    parsed = JSON.parse(content);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to read config: ${message}`);
  }

  return normalizeConfig(parsed);
}

function normalizeConfig(rawConfig) {
  if (!rawConfig || typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
    throw new Error("Config root must be a JSON object.");
  }

  const config = {
    worktreeRoot: stringOrDefault(rawConfig.worktreeRoot, DEFAULT_CONFIG.worktreeRoot),
    directoryNameTemplate: stringOrDefault(
      rawConfig.directoryNameTemplate,
      DEFAULT_CONFIG.directoryNameTemplate
    ),
    branchPrefix: stringOrDefault(rawConfig.branchPrefix, DEFAULT_CONFIG.branchPrefix),
    baseRef: stringOrDefault(rawConfig.baseRef, DEFAULT_CONFIG.baseRef),
    envFileName: stringOrDefault(rawConfig.envFileName, DEFAULT_CONFIG.envFileName),
    port: normalizePortConfig(rawConfig.port),
    tmux: normalizeTmuxConfig(rawConfig.tmux)
  };

  const hasTemplateKey =
    config.directoryNameTemplate.includes("{{repo}}") ||
    config.directoryNameTemplate.includes("{{ticket}}") ||
    config.directoryNameTemplate.includes("{{branch}}") ||
    config.directoryNameTemplate.includes("{{slot}}");
  if (!hasTemplateKey) {
    throw new Error("directoryNameTemplate must include at least one template key.");
  }
  if (!config.envFileName || config.envFileName.includes(path.sep)) {
    throw new Error("envFileName must be a filename in the worktree root.");
  }

  return config;
}

function normalizePortConfig(rawPort) {
  const safeRawPort = rawPort && typeof rawPort === "object" && !Array.isArray(rawPort) ? rawPort : {};
  const rawMap =
    safeRawPort.map && typeof safeRawPort.map === "object" && !Array.isArray(safeRawPort.map)
      ? safeRawPort.map
      : DEFAULT_CONFIG.port.map;
  const offsetStep = Number(safeRawPort.offsetStep ?? DEFAULT_CONFIG.port.offsetStep);

  if (!Number.isInteger(offsetStep) || offsetStep <= 0) {
    throw new Error("port.offsetStep must be a positive integer.");
  }

  const map = {};
  for (const [key, value] of Object.entries(rawMap)) {
    if (!/^[A-Z0-9_]+$/.test(key)) {
      throw new Error(`Invalid env var in port.map: ${key}`);
    }
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) {
      throw new Error(`Invalid base port for ${key}: ${value}`);
    }
    map[key] = numeric;
  }

  return { offsetStep, map };
}

function normalizeTmuxConfig(rawTmux) {
  const safeRawTmux = rawTmux && typeof rawTmux === "object" && !Array.isArray(rawTmux) ? rawTmux : {};
  const windowsInput = Array.isArray(safeRawTmux.windows) ? safeRawTmux.windows : DEFAULT_CONFIG.tmux.windows;
  const windows = windowsInput.map((windowConfig, index) => {
    if (!windowConfig || typeof windowConfig !== "object" || Array.isArray(windowConfig)) {
      throw new Error(`tmux.windows[${index}] must be an object.`);
    }
    const name = stringOrDefault(windowConfig.name, "");
    if (!name) {
      throw new Error(`tmux.windows[${index}].name is required.`);
    }
    const command = windowConfig.command == null ? "" : String(windowConfig.command);
    return { name, command };
  });

  return {
    enabled: Boolean(safeRawTmux.enabled ?? DEFAULT_CONFIG.tmux.enabled),
    sessionPrefix: stringOrDefault(safeRawTmux.sessionPrefix, DEFAULT_CONFIG.tmux.sessionPrefix),
    windows
  };
}

function stringOrDefault(value, fallback) {
  if (value == null) {
    return fallback;
  }
  return String(value);
}

function loadRegistry(registryPath) {
  if (!fs.existsSync(registryPath)) {
    return { version: 1, entries: [] };
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    const entries = Array.isArray(parsed.entries) ? parsed.entries : [];
    return {
      version: Number(parsed.version) || 1,
      entries: entries.map((entry) => ({
        ticket: String(entry.ticket || ""),
        branch: String(entry.branch || ""),
        slot: Number(entry.slot ?? 0),
        worktreePath: String(entry.worktreePath || ""),
        envFilePath: String(entry.envFilePath || ""),
        sessionName: String(entry.sessionName || ""),
        createdAt: String(entry.createdAt || "")
      }))
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse registry: ${message}`);
  }
}

function saveRegistry(registryPath, registry) {
  ensureDir(path.dirname(registryPath));
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf8");
}

function sanitizeTicket(input) {
  const clean = String(input)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!clean) {
    throw new Error("Ticket cannot be empty after sanitization.");
  }

  return clean;
}

function buildBranchName(ticket, branchPrefix) {
  const prefix = String(branchPrefix || "").trim().replace(/\/+$/g, "");
  if (!prefix) {
    return ticket;
  }
  if (ticket === prefix || ticket.startsWith(`${prefix}/`)) {
    return ticket;
  }
  return `${prefix}/${ticket}`;
}

function allocateSlot(entries) {
  const used = new Set();
  for (const entry of entries) {
    if (Number.isInteger(entry.slot) && entry.slot >= 0) {
      used.add(entry.slot);
    }
  }
  let slot = 0;
  while (used.has(slot)) {
    slot += 1;
  }
  return slot;
}

function renderTemplate(template, data) {
  return String(template).replace(
    /\{\{\s*(repo|ticket|branch|slot)\s*\}\}/g,
    (_match, key) => String(data[key])
  );
}

function findDuplicate(entries, ticket, branch) {
  return entries.find((entry) => entry.ticket === ticket || entry.branch === branch) || null;
}

function findEntry(entries, query) {
  const needle = String(query || "").trim();
  if (!needle) {
    return null;
  }

  const exactMatches = entries.filter(
    (entry) => entry.ticket === needle || entry.branch === needle || entry.worktreePath === needle
  );
  if (exactMatches.length === 1) {
    return exactMatches[0];
  }
  if (exactMatches.length > 1) {
    throw new Error(`Ambiguous identifier: ${needle}`);
  }

  const shortMatches = entries.filter((entry) => entry.branch.split("/").pop() === needle);
  if (shortMatches.length === 1) {
    return shortMatches[0];
  }
  if (shortMatches.length > 1) {
    const branches = shortMatches.map((entry) => entry.branch).join(", ");
    throw new Error(`Ambiguous identifier: ${needle}. Matches: ${branches}`);
  }

  return null;
}

function writeEnvFile({ ticket, branch, slot, envFilePath, config }) {
  const offset = slot * config.port.offsetStep;
  const lines = [
    "# Generated by scripts/wt.js",
    `WT_SLOT=${formatEnvValue(slot)}`,
    `WT_TICKET=${formatEnvValue(ticket)}`,
    `WT_BRANCH=${formatEnvValue(branch)}`
  ];

  for (const key of Object.keys(config.port.map).sort()) {
    const value = config.port.map[key] + offset;
    lines.push(`${key}=${value}`);
  }

  lines.push("");
  fs.writeFileSync(envFilePath, lines.join("\n"), "utf8");
}

function formatEnvValue(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:-]+$/.test(text)) {
    return text;
  }
  return `"${text.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function ensureTmuxSession({ branch, worktreePath, tmuxConfig }) {
  const sessionName = buildTmuxSessionName(tmuxConfig.sessionPrefix, branch);
  if (tmuxSessionExists(sessionName)) {
    return sessionName;
  }

  const windows = tmuxConfig.windows.length > 0 ? tmuxConfig.windows : [{ name: "code", command: "" }];
  const firstWindow = windows[0];

  run("tmux", ["new-session", "-d", "-s", sessionName, "-n", firstWindow.name, "-c", worktreePath]);
  if (firstWindow.command) {
    run("tmux", ["send-keys", "-t", `${sessionName}:${firstWindow.name}`, firstWindow.command, "C-m"]);
  }

  for (let index = 1; index < windows.length; index += 1) {
    const windowConfig = windows[index];
    run("tmux", ["new-window", "-t", sessionName, "-n", windowConfig.name, "-c", worktreePath]);
    if (windowConfig.command) {
      run("tmux", ["send-keys", "-t", `${sessionName}:${windowConfig.name}`, windowConfig.command, "C-m"]);
    }
  }

  return sessionName;
}

function buildTmuxSessionName(prefix, branch) {
  const prefixSafe = String(prefix || "wt").replace(/[^A-Za-z0-9_-]/g, "-");
  const branchSafe = String(branch).replace(/[^A-Za-z0-9_-]/g, "-");
  const base = `${prefixSafe}-${branchSafe}`.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return base.slice(0, 50) || `wt-${Date.now()}`;
}

function branchExists(repoRoot, branch) {
  const result = runAllowFailure("git", ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`], {
    cwd: repoRoot
  });
  return result.status === 0;
}

function tmuxSessionExists(sessionName) {
  const result = runAllowFailure("tmux", ["has-session", "-t", sessionName]);
  return result.status === 0;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8"
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    const stderr = (result.stderr || "").trim();
    const stdout = (result.stdout || "").trim();
    throw new Error(stderr || stdout || `${command} failed`);
  }

  return (result.stdout || "").trim();
}

function runAllowFailure(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    encoding: "utf8"
  });
}

function runInherit(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    stdio: "inherit"
  });
  if (result.error) {
    throw new Error(result.error.message);
  }
  if (result.status !== 0) {
    throw new Error(`${command} failed`);
  }
}

function isCommandAvailable(command) {
  const result = runAllowFailure("which", [command]);
  return result.status === 0;
}

function ensureDir(targetDir) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function printTable(headers, rows) {
  const widths = headers.map((header) => header.length);
  for (const row of rows) {
    row.forEach((cell, columnIndex) => {
      widths[columnIndex] = Math.max(widths[columnIndex], String(cell).length);
    });
  }

  const renderRow = (cells) =>
    cells
      .map((cell, columnIndex) => String(cell).padEnd(widths[columnIndex], " "))
      .join("  ");

  console.log(renderRow(headers));
  console.log(widths.map((width) => "-".repeat(width)).join("  "));
  for (const row of rows) {
    console.log(renderRow(row));
  }
}

main();
