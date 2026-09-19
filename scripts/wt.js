#!/usr/bin/env node


const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

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
      CORE_API_PORT: 3006,
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
    const json = parsed.json;

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
      case "new-run":
        runNewRun(args, configOverride, { json });
        break;
      case "go":
        runGo(args, configOverride);
        break;
      case "list":
        runList(configOverride, { json });
        break;
      case "rm":
        runRemove(args, configOverride);
        break;
      case "plan-merge":
        runPlanMerge(args, configOverride, { json });
        break;
      case "pr":
        runPr(args, configOverride, { json });
        break;
      case "merge":
        runMerge(args, configOverride, { json });
        break;
      case "finish":
        runFinish(args, configOverride, { json });
        break;
      default:
        throw new Error(`알 수 없는 명령입니다: ${command}`);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`오류: ${message}`);
    process.exit(1);
  }
}

function parseArgs(argv) {
  let configPath;
  let json = false;
  const positional = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      return { command: "help", args: [], configPath, json };
    }
    if (arg === "--config") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error("--config에는 경로 값이 필요합니다.");
      }
      configPath = value;
      index += 1;
      continue;
    }
    if (arg === "--json") {
      json = true;
      continue;
    }
    positional.push(arg);
  }

  return {
    command: positional[0] || "help",
    args: positional.slice(1),
    configPath,
    json
  };
}

function printHelp() {
  console.log(`wt - git worktree + tmux 작업 도우미

사용법:
  pnpm wt
  pnpm wt:<command> [args]
  pnpm exec tsx scripts/wt.ts <command> [args] [--config <path>]

명령:
  init                       설정이 없으면 기본 config를 만듭니다.
  new <ticket>               브랜치/worktree/env/tmux 세션을 생성합니다.
  new-run <ticket>           worktree를 만들고 Codex 작업과 PR 흐름을 이어서 준비합니다.
  go <ticket-or-branch>      tmux 세션에 붙거나 cd 경로를 출력합니다.
  list                       등록된 worktree와 상태를 출력합니다.
  rm <ticket-or-branch>      worktree를 정리하고 기본적으로 로컬 브랜치도 삭제합니다.
  plan-merge <ticket|branch> 브랜치 작업 결과를 보고 병합 전략을 추천합니다.
  pr <ticket|branch>         브랜치를 push하고 PR을 만들거나 엽니다.
  merge <ticket|branch>      선택한 전략 또는 추천 전략으로 PR을 병합합니다.
  finish <ticket|branch>     rebase/push/PR/merge/cleanup을 한 번에 실행합니다.
  help                       이 도움말을 출력합니다.

옵션:
  --config <path>            설정 경로를 덮어씁니다. 기본값은 .wt/config.json 입니다.
  --json                     지원하는 명령에서 기계 판독용 JSON을 출력합니다.

예시:
  pnpm wt
  pnpm wt:init
  pnpm wt:new CORE-123
  pnpm wt:new-run CORE-123 --prompt "회원 목록 화면 구현"
  pnpm wt:go CORE-123
  pnpm wt:plan-merge CORE-123 --json
  pnpm wt:pr CORE-123
  pnpm wt:merge CORE-123 --strategy auto --auto
  pnpm wt:finish CORE-123 --strategy auto
  pnpm wt:rm CORE-123 --keep-branch
  pnpm wt:rm CORE-123 --force
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
  fs.writeFileSync(configPath, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, "utf8");
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

function runNewRun(args, configOverride, options = {}) {
  const parsed = parseNewRunArgs(args);
  const shouldGo = parsed.go && !options.json;
  const prompt = resolveNewRunPrompt(parsed.prompt);
  const beforeContext = loadContext(configOverride);
  const ticket = sanitizeTicket(parsed.ticket);
  const branch = buildBranchName(ticket, beforeContext.config.branchPrefix);
  let entry =
    findEntry(beforeContext.registry.entries, branch) || findEntry(beforeContext.registry.entries, ticket);
  const reusedEntry = Boolean(entry);

  if (!entry) {
    runNew([parsed.ticket], configOverride);
  }

  const context = loadContext(configOverride);
  if (!(context.config.tmux.enabled && isCommandAvailable("tmux"))) {
    throw new Error('new-run requires tmux enabled and available. Use "wt:new" then run Codex manually.');
  }
  if (!isCommandAvailable("codex")) {
    throw new Error("codex command not found. Install Codex CLI first.");
  }

  entry = findEntry(context.registry.entries, branch) || findEntry(context.registry.entries, ticket);
  if (!entry) {
    throw new Error(`Created entry not found: ${parsed.ticket}`);
  }
  if (!fs.existsSync(entry.worktreePath)) {
    throw new Error(`Worktree path missing: ${entry.worktreePath}`);
  }

  if (!entry.sessionName || !tmuxSessionExists(entry.sessionName)) {
    entry.sessionName = ensureTmuxSession({
      branch: entry.branch,
      worktreePath: entry.worktreePath,
      tmuxConfig: context.config.tmux
    });
    saveRegistry(context.registryPath, context.registry);
  }

  const defaultWindow = context.config.tmux.windows[0] ? context.config.tmux.windows[0].name : "code";
  const windowName = parsed.window || defaultWindow;
  ensureTmuxWindow({
    sessionName: entry.sessionName,
    windowName,
    worktreePath: entry.worktreePath
  });

  const codexExecCommand = `source ${shellQuote(context.config.envFileName)} && codex exec ${shellQuote(prompt)}`;
  const prCommand = `pnpm wt:pr ${shellQuote(entry.ticket || entry.branch)}`;
  const queuedCommand = parsed.autoPr ? `${codexExecCommand} && ${prCommand}` : codexExecCommand;

  run("tmux", ["send-keys", "-t", `${entry.sessionName}:${windowName}`, queuedCommand, "C-m"]);

  if (options.json) {
    printJson({
      command: "new-run",
      ticket: entry.ticket,
      branch: entry.branch,
      path: entry.worktreePath,
      sessionName: entry.sessionName,
      windowName,
      reusedEntry,
      autoPr: parsed.autoPr,
      goRequested: parsed.go,
      attached: shouldGo
    });
  } else {
    if (reusedEntry) {
      console.log(`Entry  : reused (${entry.ticket || entry.branch})`);
    }
    console.log("Codex  : queued (exec)");
    console.log(`PR     : ${parsed.autoPr ? "queued (after Codex success)" : "skipped (--no-pr)"}`);
    console.log(`Window : ${entry.sessionName}:${windowName}`);
  }

  if (shouldGo) {
    runGo([entry.ticket || entry.branch], configOverride);
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

    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      console.log(`tmux attach -t ${entry.sessionName}`);
      console.log(`cd ${entry.worktreePath}`);
      return;
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

function runList(configOverride, options = {}) {
  const context = loadContext(configOverride);
  const entries = [...context.registry.entries].sort((a, b) => Number(a.slot) - Number(b.slot));
  const json = Boolean(options.json);
  if (entries.length === 0 && json) {
    printJson({
      command: "list",
      entries: []
    });
    return;
  }
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

    return {
      ticket: entry.ticket || "",
      branch: entry.branch || "",
      slot: Number(entry.slot ?? 0),
      worktree: worktreeStatus,
      tmux: tmuxStatus,
      path: entry.worktreePath || ""
    };
  });

  if (json) {
    printJson({
      command: "list",
      entries: rows
    });
    return;
  }

  printTable(
    ["ticket", "branch", "slot", "worktree", "tmux", "path"],
    rows.map((item) => [
      item.ticket,
      item.branch,
      String(item.slot),
      item.worktree,
      item.tmux,
      item.path
    ])
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
  const result = removeEntry(context, entry, {
    force: parsed.force,
    deleteBranch: parsed.deleteBranch
  });

  if (result.tmuxStopped) {
    console.log(`Tmux stopped: ${result.sessionName}`);
  }
  console.log(result.worktreeRemoved ? `Worktree removed: ${entry.worktreePath}` : `Worktree missing: ${entry.worktreePath}`);
  if (result.branchDeleted) {
    console.log(`Branch deleted: ${entry.branch}`);
  } else if (parsed.deleteBranch) {
    const detail = result.branchDeleteMessage ? ` (${result.branchDeleteMessage})` : "";
    console.log(`Branch kept: ${entry.branch}${detail}`);
  } else {
    console.log(`Branch kept: ${entry.branch}`);
  }
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

function parseNewRunArgs(args) {
  let ticket = "";
  let prompt = "";
  let window = "";
  let go = true;
  let autoPr = true;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--prompt") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--prompt requires a value.");
      }
      prompt = value;
      index += 1;
      continue;
    }
    if (arg === "--window") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--window requires a value.");
      }
      window = value;
      index += 1;
      continue;
    }
    if (arg === "--no-go") {
      go = false;
      continue;
    }
    if (arg === "--go") {
      go = true;
      continue;
    }
    if (arg === "--no-pr") {
      autoPr = false;
      continue;
    }
    if (arg === "--pr") {
      autoPr = true;
      continue;
    }
    if (!ticket) {
      ticket = arg;
      continue;
    }
    throw new Error(`Unexpected new-run argument: ${arg}`);
  }

  if (!ticket) {
    throw new Error("new-run requires <ticket>.");
  }
  return { ticket, prompt, window, go, autoPr };
}

function resolveNewRunPrompt(rawPrompt) {
  const trimmed = String(rawPrompt || "").trim();
  if (trimmed) {
    return trimmed;
  }
  if (!process.stdin.isTTY) {
    throw new Error("new-run requires --prompt <text> when stdin is not interactive.");
  }
  const input = readInteractiveLine("Codex prompt: ");
  if (!input) {
    throw new Error("Codex prompt cannot be empty.");
  }
  return input;
}

function readInteractiveLine(label) {
  process.stdout.write(label);
  const chunks = [];
  const buffer = Buffer.alloc(1024);

  while (true) {
    let bytesRead = 0;
    try {
      bytesRead = fs.readSync(process.stdin.fd, buffer, 0, buffer.length, null);
    } catch (error) {
      const code = error && typeof error === "object" ? error.code : "";
      if (code === "EINTR" || code === "EAGAIN" || code === "EWOULDBLOCK") {
        continue;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(message);
    }
    if (bytesRead <= 0) {
      break;
    }
    const slice = Buffer.from(buffer.subarray(0, bytesRead));
    const ctrlCIndex = slice.indexOf(3);
    if (ctrlCIndex >= 0) {
      process.stdout.write("\n");
      throw new Error("Prompt input cancelled.");
    }
    const newlineIndex = slice.indexOf(10);
    if (newlineIndex >= 0) {
      chunks.push(slice.subarray(0, newlineIndex));
      break;
    }
    chunks.push(slice);
  }

  process.stdout.write("\n");
  const line = Buffer.concat(chunks).toString("utf8").replace(/\r$/, "");
  return line.trim();
}

function removeEntry(context, entry, options = {}) {
  const force = Boolean(options.force);
  const deleteBranch = options.deleteBranch !== false;
  const result = {
    tmuxStopped: false,
    sessionName: entry.sessionName || "",
    worktreeRemoved: false,
    branchDeleted: false,
    branchDeleteMessage: "",
    registryUpdated: false
  };

  const tmuxAvailable = isCommandAvailable("tmux");
  if (tmuxAvailable && entry.sessionName && tmuxSessionExists(entry.sessionName)) {
    run("tmux", ["kill-session", "-t", entry.sessionName]);
    result.tmuxStopped = true;
  }

  if (fs.existsSync(entry.worktreePath)) {
    if (!force) {
      const status = run("git", ["status", "--porcelain"], { cwd: entry.worktreePath });
      if (status) {
        throw new Error(
          `Worktree has uncommitted changes: ${entry.worktreePath}. Use --force to remove anyway.`
        );
      }
    }

    const removeArgs = ["worktree", "remove"];
    if (force) {
      removeArgs.push("--force");
    }
    removeArgs.push(entry.worktreePath);
    run("git", removeArgs, { cwd: context.repoRoot });
    result.worktreeRemoved = true;
  }
  runAllowFailure("git", ["worktree", "prune"], { cwd: context.repoRoot });

  if (deleteBranch) {
    if (branchExists(context.repoRoot, entry.branch)) {
      const deleteArgs = ["branch", force ? "-D" : "-d", entry.branch];
      const deleteResult = runAllowFailure("git", deleteArgs, { cwd: context.repoRoot });
      if (deleteResult.status === 0) {
        result.branchDeleted = true;
      } else {
        result.branchDeleteMessage =
          (deleteResult.stderr || deleteResult.stdout || "").trim() ||
          `Unable to delete branch ${entry.branch}`;
      }
    } else {
      result.branchDeleteMessage = "Branch missing";
    }
  }

  context.registry.entries = context.registry.entries.filter((item) => item.branch !== entry.branch);
  saveRegistry(context.registryPath, context.registry);
  result.registryUpdated = true;
  return result;
}

function runPlanMerge(args, configOverride, options = {}) {
  const parsed = parsePlanMergeArgs(args);
  const context = loadContext(configOverride);
  const target = resolveBranchTarget(context, parsed.query);
  const baseInfo = resolveBaseInfo(context.config.baseRef, parsed.base);

  fetchBaseRef(context.repoRoot, baseInfo.baseBranch);
  const plan = buildMergePlan({
    repoRoot: context.repoRoot,
    branch: target.branch,
    baseRef: baseInfo.baseRef,
    baseBranch: baseInfo.baseBranch
  });

  if (options.json) {
    printJson({
      command: "plan-merge",
      ticket: target.ticket,
      branch: target.branch,
      baseRef: baseInfo.baseRef,
      baseBranch: baseInfo.baseBranch,
      plan
    });
    return;
  }

  printMergePlan(plan, {
    branch: target.branch,
    ticket: target.ticket,
    baseBranch: baseInfo.baseBranch
  });
}

function runPr(args, configOverride, options = {}) {
  const parsed = parsePrArgs(args);
  const context = loadContext(configOverride);
  const target = resolveBranchTarget(context, parsed.query);
  const baseInfo = resolveBaseInfo(context.config.baseRef, parsed.base);
  ensureGhAvailable();

  if (parsed.push) {
    run("git", ["push", "-u", "origin", target.branch], { cwd: context.repoRoot });
  }

  const prResult = ensureOpenPullRequest({
    repoRoot: context.repoRoot,
    branch: target.branch,
    baseBranch: baseInfo.baseBranch,
    draft: parsed.draft,
    fill: parsed.fill,
    title: parsed.title,
    bodyFile: parsed.bodyFile
  });

  if (options.json) {
    printJson({
      command: "pr",
      ticket: target.ticket,
      branch: target.branch,
      pushed: parsed.push,
      created: prResult.created,
      pr: prResult.pr
    });
    return;
  }

  if (parsed.push) {
    console.log(`Pushed : ${target.branch}`);
  }
  console.log(prResult.created ? `PR created: #${prResult.pr.number}` : `PR exists : #${prResult.pr.number}`);
  console.log(`URL    : ${prResult.pr.url}`);
}

function runMerge(args, configOverride, options = {}) {
  const parsed = parseMergeArgs(args);
  const context = loadContext(configOverride);
  const target = resolveBranchTarget(context, parsed.query);
  const baseInfo = resolveBaseInfo(context.config.baseRef, parsed.base);
  ensureGhAvailable();

  fetchBaseRef(context.repoRoot, baseInfo.baseBranch);
  const pr = getRequiredOpenPullRequest(context.repoRoot, target.branch);
  const plan = buildMergePlan({
    repoRoot: context.repoRoot,
    branch: target.branch,
    baseRef: baseInfo.baseRef,
    baseBranch: baseInfo.baseBranch
  });
  const strategy = parsed.strategy === "auto" ? plan.recommended.strategy : parsed.strategy;
  const mergeExecution = executePullRequestMerge({
    repoRoot: context.repoRoot,
    prNumber: pr.number,
    strategy,
    auto: parsed.auto,
    admin: parsed.admin,
    deleteBranch: parsed.deleteBranch,
    dryRun: parsed.dryRun
  });

  const prAfter = parsed.dryRun ? pr : getPullRequest(context.repoRoot, pr.number);

  if (options.json) {
    printJson({
      command: "merge",
      ticket: target.ticket,
      branch: target.branch,
      dryRun: parsed.dryRun,
      requestedStrategy: parsed.strategy,
      selectedStrategy: strategy,
      plan,
      mergeExecution,
      prBefore: pr,
      prAfter
    });
    return;
  }

  console.log(`PR     : #${pr.number} ${pr.url}`);
  console.log(`Method : ${strategy}${parsed.strategy === "auto" ? " (recommended)" : ""}`);
  if (parsed.dryRun) {
    console.log(`DryRun : ${mergeExecution.command}`);
    return;
  }
  if (mergeExecution.output) {
    console.log(mergeExecution.output);
  }
  console.log(`State  : ${prAfter.state}`);
  if (prAfter.mergedAt) {
    console.log(`Merged : ${prAfter.mergedAt}`);
  }
}

function runFinish(args, configOverride, options = {}) {
  const parsed = parseFinishArgs(args);
  const context = loadContext(configOverride);
  const target = resolveBranchTarget(context, parsed.query);
  const baseInfo = resolveBaseInfo(context.config.baseRef, parsed.base);
  ensureGhAvailable();
  if (!target.entry) {
    throw new Error(`finish requires a tracked worktree entry: ${target.branch}`);
  }
  if (!fs.existsSync(target.entry.worktreePath)) {
    throw new Error(`Worktree path missing: ${target.entry.worktreePath}`);
  }
  if (!parsed.force && !parsed.dryRun) {
    ensureCleanWorktree(target.entry.worktreePath);
  }

  fetchBaseRef(context.repoRoot, baseInfo.baseBranch);

  const steps = [];
  if (parsed.rebase) {
    steps.push(`git -C ${target.entry.worktreePath} rebase ${baseInfo.baseRef}`);
    if (!parsed.dryRun) {
      run("git", ["rebase", baseInfo.baseRef], { cwd: target.entry.worktreePath });
    }
  }

  if (parsed.push) {
    steps.push(`git push -u origin ${target.branch}`);
    if (!parsed.dryRun) {
      run("git", ["push", "-u", "origin", target.branch], { cwd: context.repoRoot });
    }
  }

  const existingPr = findOpenPullRequestByBranch(context.repoRoot, target.branch);
  const prResult = parsed.dryRun
    ? {
        created: false,
        wouldCreate: !existingPr,
        pr: existingPr
      }
    : ensureOpenPullRequest({
        repoRoot: context.repoRoot,
        branch: target.branch,
        baseBranch: baseInfo.baseBranch,
        draft: parsed.draft,
        fill: true
      });

  const plan = buildMergePlan({
    repoRoot: context.repoRoot,
    branch: target.branch,
    baseRef: baseInfo.baseRef,
    baseBranch: baseInfo.baseBranch
  });
  const selectedStrategy = parsed.strategy === "auto" ? plan.recommended.strategy : parsed.strategy;

  const mergeExecution = prResult.pr
    ? executePullRequestMerge({
        repoRoot: context.repoRoot,
        prNumber: prResult.pr.number,
        strategy: selectedStrategy,
        auto: parsed.auto,
        admin: parsed.admin,
        deleteBranch: false,
        dryRun: parsed.dryRun
      })
    : {
        command: "skip (open PR required before merge)",
        output: ""
      };

  const prAfterMerge = prResult.pr
    ? parsed.dryRun
      ? prResult.pr
      : getPullRequest(context.repoRoot, prResult.pr.number)
    : null;
  const merged = Boolean(prAfterMerge && prAfterMerge.state === "MERGED");

  let remoteBranchDeleted = false;
  let remoteBranchDeleteMessage = "";
  if (!parsed.dryRun && merged && parsed.deleteRemoteBranch) {
    const remoteDelete = runAllowFailure("git", ["push", "origin", "--delete", target.branch], {
      cwd: context.repoRoot
    });
    if (remoteDelete.status === 0) {
      remoteBranchDeleted = true;
    } else {
      remoteBranchDeleteMessage = (remoteDelete.stderr || remoteDelete.stdout || "").trim();
    }
  }

  let cleanup = null;
  if (!parsed.dryRun && merged && !parsed.keepWorktree) {
    cleanup = removeEntry(context, target.entry, {
      force: parsed.force,
      deleteBranch: !parsed.keepBranch
    });
  }

  if (options.json) {
    printJson({
      command: "finish",
      ticket: target.ticket,
      branch: target.branch,
      dryRun: parsed.dryRun,
      steps,
      pr: {
        created: prResult.created,
        wouldCreate: Boolean(prResult.wouldCreate),
        before: prResult.pr,
        after: prAfterMerge
      },
      plan,
      requestedStrategy: parsed.strategy,
      selectedStrategy,
      mergeExecution,
      merged,
      remoteBranchDeleted,
      remoteBranchDeleteMessage,
      cleanup
    });
    return;
  }

  console.log(`Branch : ${target.branch}`);
  if (prResult.pr) {
    console.log(`PR     : #${prResult.pr.number} ${prResult.pr.url}`);
  } else {
    console.log("PR     : missing (will be created on non-dry-run finish)");
  }
  console.log(`Method : ${selectedStrategy}${parsed.strategy === "auto" ? " (recommended)" : ""}`);
  if (parsed.dryRun) {
    if (prResult.wouldCreate) {
      console.log(`DryRun : gh pr create --base ${baseInfo.baseBranch} --head ${target.branch} --fill`);
    }
    console.log(`DryRun : ${mergeExecution.command}`);
    return;
  }
  if (!prAfterMerge) {
    console.log("State  : skipped (open PR required)");
    return;
  }
  console.log(`State  : ${prAfterMerge.state}`);
  if (prAfterMerge.mergedAt) {
    console.log(`Merged : ${prAfterMerge.mergedAt}`);
  }
  if (!merged) {
    console.log("Cleanup: skipped (PR not merged yet)");
    return;
  }
  if (parsed.deleteRemoteBranch) {
    if (remoteBranchDeleted) {
      console.log(`Remote : deleted (${target.branch})`);
    } else if (remoteBranchDeleteMessage) {
      console.log(`Remote : kept (${remoteBranchDeleteMessage})`);
    }
  }
  if (cleanup) {
    console.log("Cleanup: worktree registry cleaned");
  }
}

function parsePlanMergeArgs(args) {
  let query = "";
  let base = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--base requires a value.");
      }
      base = value;
      index += 1;
      continue;
    }
    if (!query) {
      query = arg;
      continue;
    }
    throw new Error(`Unexpected plan-merge argument: ${arg}`);
  }

  return { query, base };
}

function parsePrArgs(args) {
  let query = "";
  let base = "";
  let draft = false;
  let push = true;
  let fill = true;
  let title = "";
  let bodyFile = "";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--base requires a value.");
      }
      base = value;
      index += 1;
      continue;
    }
    if (arg === "--draft") {
      draft = true;
      continue;
    }
    if (arg === "--no-push") {
      push = false;
      continue;
    }
    if (arg === "--no-fill") {
      fill = false;
      continue;
    }
    if (arg === "--title") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--title requires a value.");
      }
      title = value;
      index += 1;
      continue;
    }
    if (arg === "--body-file") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--body-file requires a path.");
      }
      bodyFile = value;
      index += 1;
      continue;
    }
    if (!query) {
      query = arg;
      continue;
    }
    throw new Error(`Unexpected pr argument: ${arg}`);
  }

  if (!fill && !title) {
    throw new Error('pr requires --title when --no-fill is used.');
  }

  return { query, base, draft, push, fill, title, bodyFile };
}

function parseMergeArgs(args) {
  let query = "";
  let base = "";
  let strategy = "auto";
  let auto = true;
  let admin = false;
  let dryRun = false;
  let deleteBranch = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--base requires a value.");
      }
      base = value;
      index += 1;
      continue;
    }
    if (arg === "--strategy") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--strategy requires a value.");
      }
      strategy = parseMergeStrategy(value, "--strategy");
      index += 1;
      continue;
    }
    if (arg === "--auto") {
      auto = true;
      continue;
    }
    if (arg === "--no-auto") {
      auto = false;
      continue;
    }
    if (arg === "--admin") {
      admin = true;
      continue;
    }
    if (arg === "--delete-branch") {
      deleteBranch = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (!query) {
      query = arg;
      continue;
    }
    throw new Error(`Unexpected merge argument: ${arg}`);
  }

  return { query, base, strategy, auto, admin, deleteBranch, dryRun };
}

function parseFinishArgs(args) {
  let query = "";
  let base = "";
  let strategy = "auto";
  let draft = false;
  let push = true;
  let rebase = true;
  let auto = true;
  let admin = false;
  let keepWorktree = false;
  let keepBranch = false;
  let deleteRemoteBranch = true;
  let force = false;
  let dryRun = false;

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--base") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--base requires a value.");
      }
      base = value;
      index += 1;
      continue;
    }
    if (arg === "--strategy") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--strategy requires a value.");
      }
      strategy = parseMergeStrategy(value, "--strategy");
      index += 1;
      continue;
    }
    if (arg === "--draft") {
      draft = true;
      continue;
    }
    if (arg === "--no-push") {
      push = false;
      continue;
    }
    if (arg === "--no-rebase") {
      rebase = false;
      continue;
    }
    if (arg === "--auto") {
      auto = true;
      continue;
    }
    if (arg === "--no-auto") {
      auto = false;
      continue;
    }
    if (arg === "--admin") {
      admin = true;
      continue;
    }
    if (arg === "--keep-worktree") {
      keepWorktree = true;
      continue;
    }
    if (arg === "--keep-branch") {
      keepBranch = true;
      continue;
    }
    if (arg === "--keep-remote-branch") {
      deleteRemoteBranch = false;
      continue;
    }
    if (arg === "--force" || arg === "-f") {
      force = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (!query) {
      query = arg;
      continue;
    }
    throw new Error(`Unexpected finish argument: ${arg}`);
  }

  return {
    query,
    base,
    strategy,
    draft,
    push,
    rebase,
    auto,
    admin,
    keepWorktree,
    keepBranch,
    deleteRemoteBranch,
    force,
    dryRun
  };
}

function parseMergeStrategy(value, optionName) {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized !== "auto" && normalized !== "merge" && normalized !== "squash" && normalized !== "rebase") {
    throw new Error(`${optionName} must be one of: auto, merge, squash, rebase.`);
  }
  return normalized;
}

function resolveBranchTarget(context, query) {
  if (query) {
    const entry = findEntry(context.registry.entries, query);
    if (entry) {
      return {
        branch: entry.branch,
        ticket: entry.ticket || entry.branch.split("/").pop(),
        entry
      };
    }

    const candidate = String(query).trim();
    const localBranch = branchExists(context.repoRoot, candidate)
      ? candidate
      : branchExists(context.repoRoot, buildBranchName(sanitizeTicket(candidate), context.config.branchPrefix))
        ? buildBranchName(sanitizeTicket(candidate), context.config.branchPrefix)
        : "";

    if (!localBranch) {
      throw new Error(`Entry/branch not found: ${query}`);
    }

    const linkedEntry = context.registry.entries.find((item) => item.branch === localBranch) || null;
    return {
      branch: localBranch,
      ticket: linkedEntry ? linkedEntry.ticket : localBranch.split("/").pop(),
      entry: linkedEntry
    };
  }

  const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: context.repoRoot });
  if (branch === "HEAD") {
    throw new Error("Detached HEAD is not supported. Provide <ticket-or-branch>.");
  }
  const entry = context.registry.entries.find((item) => item.branch === branch) || null;
  return {
    branch,
    ticket: entry ? entry.ticket : branch.split("/").pop(),
    entry
  };
}

function resolveBaseInfo(configBaseRef, baseOverride) {
  const rawBaseRef = baseOverride
    ? baseOverride.includes("/")
      ? baseOverride
      : `origin/${baseOverride}`
    : String(configBaseRef || "origin/main");
  const parts = rawBaseRef.split("/");
  const baseBranch = parts[parts.length - 1] || "main";
  return {
    baseRef: rawBaseRef,
    baseBranch
  };
}

function fetchBaseRef(repoRoot, baseBranch) {
  runAllowFailure("git", ["fetch", "origin", baseBranch], { cwd: repoRoot });
}

function ensureCleanWorktree(worktreePath) {
  const status = run("git", ["status", "--porcelain"], { cwd: worktreePath });
  if (status) {
    throw new Error(`Worktree has uncommitted changes: ${worktreePath}`);
  }
}

function buildMergePlan({ repoRoot, branch, baseRef, baseBranch }) {
  const aheadBehindRaw = run("git", ["rev-list", "--left-right", "--count", `${baseRef}...${branch}`], {
    cwd: repoRoot
  });
  const aheadBehind = aheadBehindRaw.split(/\s+/);
  const behindCount = toPositiveInt(aheadBehind[0]);
  const aheadCount = toPositiveInt(aheadBehind[1]);
  const commitCount = toPositiveInt(run("git", ["rev-list", "--count", `${baseRef}..${branch}`], { cwd: repoRoot }));
  const mergeCommitCount = toPositiveInt(
    run("git", ["rev-list", "--count", "--merges", `${baseRef}..${branch}`], { cwd: repoRoot })
  );
  const commitSubjectsOutput = runAllowFailure("git", ["log", "--format=%s", `${baseRef}..${branch}`], {
    cwd: repoRoot
  });
  const commitSubjects = splitLines(commitSubjectsOutput.stdout || "");
  const changedFiles = splitLines(run("git", ["diff", "--name-only", `${baseRef}...${branch}`], { cwd: repoRoot }));
  const changedDomainList = [...new Set(changedFiles.map((file) => file.split("/")[0] || file))].filter(Boolean);
  const numStatLines = splitLines(run("git", ["diff", "--numstat", `${baseRef}...${branch}`], { cwd: repoRoot }));
  const lineStat = parseNumStat(numStatLines);
  const hasFixupCommits = commitSubjects.some((subject) => /^(fixup!|squash!)/i.test(subject));
  const hasWipCommits = commitSubjects.some((subject) => /\b(wip|tmp)\b/i.test(subject));
  const conventionalCommitCount = commitSubjects.filter((subject) =>
    /^(feat|fix|docs|style|refactor|test|chore)(\([^)]+\))?:/i.test(subject)
  ).length;
  const hasSchemaChange = changedFiles.some(
    (file) =>
      (file.startsWith("packages/be-prisma/schema/") && file.endsWith(".prisma")) ||
      file.includes("schema.prisma") ||
      file.includes("/migrations/") ||
      file.includes("/src/reference-data/definitions/") ||
      file.includes("/src/bootstrap/data/") ||
      file.includes("/src/demo-data/") ||
      file.endsWith("/seed.ts") ||
      file.endsWith("/data-migrate.ts")
  );

  const metrics = {
    baseRef,
    baseBranch,
    branch,
    aheadCount,
    behindCount,
    commitCount,
    mergeCommitCount,
    fileCount: changedFiles.length,
    domainCount: changedDomainList.length,
    changedDomains: changedDomainList,
    insertions: lineStat.insertions,
    deletions: lineStat.deletions,
    changedLines: lineStat.insertions + lineStat.deletions,
    hasFixupCommits,
    hasWipCommits,
    hasSchemaChange,
    conventionalCommitCount,
    commitSubjects
  };
  const recommended = recommendMergeStrategy(metrics);

  return {
    metrics,
    recommended
  };
}

function recommendMergeStrategy(metrics) {
  const reasons = [];

  if (metrics.commitCount <= 0) {
    return {
      strategy: "rebase",
      reasons: ["No commits ahead of base branch."]
    };
  }

  if (metrics.mergeCommitCount > 0) {
    reasons.push("Branch already contains merge commits.");
    reasons.push("Use merge commit to preserve existing branch history.");
    return { strategy: "merge", reasons };
  }

  if (metrics.hasFixupCommits || metrics.hasWipCommits) {
    reasons.push("Detected fixup/squash or WIP style commits.");
    reasons.push("Squash keeps main history clean.");
    return { strategy: "squash", reasons };
  }

  if (metrics.commitCount === 1) {
    reasons.push("Single-commit branch.");
    reasons.push("Squash keeps PR history compact.");
    return { strategy: "squash", reasons };
  }

  if (
    metrics.commitCount <= 4 &&
    metrics.domainCount <= 2 &&
    metrics.changedLines <= 1200 &&
    metrics.conventionalCommitCount >= Math.max(1, metrics.commitCount - 1)
  ) {
    reasons.push("Small multi-commit branch with mostly conventional commit messages.");
    reasons.push("Rebase preserves meaningful commit boundaries with linear history.");
    return { strategy: "rebase", reasons };
  }

  if (metrics.hasSchemaChange && metrics.domainCount >= 3 && metrics.commitCount >= 5) {
    reasons.push("Cross-domain change with schema/migration touchpoints.");
    reasons.push("Merge commit preserves contextual branch history.");
    return { strategy: "merge", reasons };
  }

  if (metrics.commitCount > 7 || metrics.fileCount > 120 || metrics.changedLines > 3000) {
    reasons.push("Large branch (commit count / file count / changed lines).");
    reasons.push("Squash reduces long noisy history into one merge unit.");
    return { strategy: "squash", reasons };
  }

  reasons.push("Defaulting to rebase for readable linear history.");
  return { strategy: "rebase", reasons };
}

function parseNumStat(lines) {
  let insertions = 0;
  let deletions = 0;

  for (const line of lines) {
    const parts = line.split("\t");
    if (parts.length < 3) {
      continue;
    }
    const add = parts[0] === "-" ? 0 : toPositiveInt(parts[0]);
    const del = parts[1] === "-" ? 0 : toPositiveInt(parts[1]);
    insertions += add;
    deletions += del;
  }

  return { insertions, deletions };
}

function splitLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function toPositiveInt(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return 0;
  }
  return Math.floor(numeric);
}

function ensureGhAvailable() {
  if (!isCommandAvailable("gh")) {
    throw new Error("gh command not found. Install GitHub CLI first.");
  }
}

function ensureOpenPullRequest({ repoRoot, branch, baseBranch, draft, fill, title, bodyFile }) {
  const existing = findOpenPullRequestByBranch(repoRoot, branch);
  if (existing) {
    return { created: false, pr: existing };
  }

  const args = ["pr", "create", "--base", baseBranch, "--head", branch];
  if (fill) {
    args.push("--fill");
  }
  if (title) {
    args.push("--title", title);
  }
  if (bodyFile) {
    args.push("--body-file", bodyFile);
  }
  if (draft) {
    args.push("--draft");
  }
  run("gh", args, { cwd: repoRoot });

  const created = findOpenPullRequestByBranch(repoRoot, branch);
  if (!created) {
    throw new Error(`PR creation reported success but no open PR found for ${branch}.`);
  }
  return { created: true, pr: created };
}

function getRequiredOpenPullRequest(repoRoot, branch) {
  const pr = findOpenPullRequestByBranch(repoRoot, branch);
  if (!pr) {
    throw new Error(`No open PR found for branch: ${branch}. Run "wt pr ${branch}" first.`);
  }
  return pr;
}

function findOpenPullRequestByBranch(repoRoot, branch) {
  const list = runJson("gh", [
    "pr",
    "list",
    "--head",
    branch,
    "--state",
    "open",
    "--json",
    "number,url,title,state,isDraft,headRefName,baseRefName,mergeStateStatus,mergedAt"
  ], { cwd: repoRoot });
  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }
  return normalizePullRequest(list[0]);
}

function getPullRequest(repoRoot, selector) {
  const pr = runJson(
    "gh",
    [
      "pr",
      "view",
      String(selector),
      "--json",
      "number,url,title,state,isDraft,headRefName,baseRefName,mergeStateStatus,mergedAt"
    ],
    { cwd: repoRoot }
  );
  return normalizePullRequest(pr);
}

function normalizePullRequest(pr) {
  return {
    number: toPositiveInt(pr.number),
    url: String(pr.url || ""),
    title: String(pr.title || ""),
    state: String(pr.state || ""),
    isDraft: Boolean(pr.isDraft),
    headRefName: String(pr.headRefName || ""),
    baseRefName: String(pr.baseRefName || ""),
    mergeStateStatus: String(pr.mergeStateStatus || ""),
    mergedAt: String(pr.mergedAt || "")
  };
}

function executePullRequestMerge({ repoRoot, prNumber, strategy, auto, admin, deleteBranch, dryRun }) {
  if (strategy !== "merge" && strategy !== "squash" && strategy !== "rebase") {
    throw new Error(`Unsupported merge strategy for execution: ${strategy}`);
  }

  const args = ["pr", "merge", String(prNumber), `--${strategy}`];
  if (auto) {
    args.push("--auto");
  }
  if (admin) {
    args.push("--admin");
  }
  if (deleteBranch) {
    args.push("--delete-branch");
  }

  const command = `gh ${args.map(shellQuote).join(" ")}`;
  if (dryRun) {
    return { command, output: "" };
  }

  const output = run("gh", args, { cwd: repoRoot });
  return { command, output };
}

function _normalizeRepoPath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function shellQuote(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:-]+$/.test(text)) {
    return text;
  }
  return `'${text.replace(/'/g, "'\"'\"'")}'`;
}

function printMergePlan(plan, info) {
  console.log(`Branch : ${info.branch}`);
  console.log(`Base   : ${info.baseBranch}`);
  console.log(`Commits: ${plan.metrics.commitCount} (merge commits: ${plan.metrics.mergeCommitCount})`);
  console.log(`Ahead  : ${plan.metrics.aheadCount} / Behind: ${plan.metrics.behindCount}`);
  console.log(`Files  : ${plan.metrics.fileCount}`);
  console.log(`Lines  : +${plan.metrics.insertions} -${plan.metrics.deletions}`);
  console.log(`Domain : ${plan.metrics.changedDomains.join(", ") || "none"}`);
  console.log(`Suggest: ${plan.recommended.strategy}`);
  if (plan.recommended.reasons.length > 0) {
    for (const reason of plan.recommended.reasons) {
      console.log(`- ${reason}`);
    }
  }
}

function runJson(command, args, options = {}) {
  const output = run(command, args, options);
  try {
    return JSON.parse(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse JSON output from ${command}: ${message}`);
  }
}

function printJson(payload) {
  console.log(JSON.stringify(payload, null, 2));
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
    commonDir,
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
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

function sanitizeTicket(input) {
  const clean = String(input)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}._-]/gu, "-")
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
  if (ticket.startsWith(`${prefix}/`)) {
    return ticket;
  }
  if (ticket.startsWith(`${prefix}-`) || ticket.startsWith(`${prefix}_`)) {
    const suffix = ticket.slice(prefix.length + 1).replace(/^[-_]+/, "");
    return `${prefix}/${suffix || prefix}`;
  }
  if (ticket === prefix) {
    return `${prefix}/${prefix}`;
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
  const values = buildWorktreeEnvValues({ ticket, branch, slot, config });
  const lines = [
    "# Generated by scripts/wt.js",
    `WT_SLOT=${formatEnvValue(values.WT_SLOT)}`,
    `WT_TICKET=${formatEnvValue(values.WT_TICKET)}`,
    `WT_BRANCH=${formatEnvValue(values.WT_BRANCH)}`
  ];

  for (const key of Object.keys(config.port.map).sort()) {
    lines.push(`${key}=${formatEnvValue(values[key])}`);
  }

  lines.push(
    "",
    "# Shared local infrastructure defaults",
    `POSTGRES_HOST=${formatEnvValue(values.POSTGRES_HOST)}`,
    `POSTGRES_PORT=${formatEnvValue(values.POSTGRES_PORT)}`,
    `POSTGRES_USER=${formatEnvValue(values.POSTGRES_USER)}`,
    `POSTGRES_PASSWORD=${formatEnvValue(values.POSTGRES_PASSWORD)}`,
    `POSTGRES_DATABASE=${formatEnvValue(values.POSTGRES_DATABASE)}`,
    `DATABASE_URL=${formatEnvValue(values.DATABASE_URL)}`,
    `DIRECT_URL=${formatEnvValue(values.DIRECT_URL)}`,
    `REDIS_HOST=${formatEnvValue(values.REDIS_HOST)}`,
    `REDIS_PORT=${formatEnvValue(values.REDIS_PORT)}`,
    `CORS_ENABLED=${formatEnvValue(values.CORS_ENABLED)}`,
    `NODE_ENV=${formatEnvValue(values.NODE_ENV)}`,
    "",
    "# Derived local service URLs",
    `ADMIN_WEB_URL=${formatEnvValue(values.ADMIN_WEB_URL)}`,
    `CORE_API_URL=${formatEnvValue(values.CORE_API_URL)}`,
    `STORYBOOK_URL=${formatEnvValue(values.STORYBOOK_URL)}`,
    `CORE_API_INTERNAL_URL=${formatEnvValue(values.CORE_API_INTERNAL_URL)}`,
    `NEXT_PUBLIC_WS_URL=${formatEnvValue(values.NEXT_PUBLIC_WS_URL)}`,
    `OIDC_ISSUER=${formatEnvValue(values.OIDC_ISSUER)}`,
    `OIDC_JWKS_URI=${formatEnvValue(values.OIDC_JWKS_URI)}`,
    `OIDC_ADMIN_BASE_URL=${formatEnvValue(values.OIDC_ADMIN_BASE_URL)}`,
    `OIDC_INTERACTION_BASE_URL=${formatEnvValue(values.OIDC_INTERACTION_BASE_URL)}`,
    `OIDC_STORYBOOK_BASE_URL=${formatEnvValue(values.OIDC_STORYBOOK_BASE_URL)}`
  );

  lines.push("");
  fs.writeFileSync(envFilePath, lines.join("\n"), "utf8");
  const worktreePath = path.dirname(envFilePath);
  writeAppEnvFiles({
    worktreePath,
    values
  });
  pullLocalSecretsIntoWorktree(worktreePath);
}

// OpenBao에서 로컬 개발용 시크릿을 가져와 worktree의 .env에 병합한다.
// 토큰이 없거나 네트워크가 불가능해도 worktree 생성 자체는 계속 진행한다.
function pullLocalSecretsIntoWorktree(worktreePath) {
  const pullScriptPath = path.join(worktreePath, "scripts", "pull-local-secrets.mjs");
  if (!fs.existsSync(pullScriptPath)) {
    return;
  }
  const pullResult = runAllowFailure(process.execPath, [pullScriptPath, "--quiet"], {
    cwd: worktreePath
  });
  const pullWarnings = (pullResult.stderr || "").trim();
  if (pullWarnings) {
    console.log(pullWarnings);
  }
  if (pullResult.status !== 0) {
    console.log(
      "Secrets: OpenBao 시크릿 pull 실패 — placeholder 값으로 진행합니다. 로그인 후 pnpm secrets:pull로 재시도하세요."
    );
  }
}

function buildWorktreeEnvValues({ ticket, branch, slot, config }) {
  const offset = slot * config.port.offsetStep;
  const values = {
    WT_SLOT: String(slot),
    WT_TICKET: ticket,
    WT_BRANCH: branch
  };

  for (const key of Object.keys(config.port.map).sort()) {
    values[key] = String(config.port.map[key] + offset);
  }

  const localPostgresUser = process.env.POSTGRES_USER || "cocrepo";
  const localPostgresPassword =
    process.env.POSTGRES_PASSWORD ??
    (localPostgresUser === "cocrepo"
      ? "devpassword"
      : localPostgresUser === "postgres"
        ? "postgres"
        : "");

  values.POSTGRES_HOST = "localhost";
  values.POSTGRES_PORT = "5432";
  values.POSTGRES_USER = localPostgresUser;
  values.POSTGRES_PASSWORD = localPostgresPassword;
  values.POSTGRES_DATABASE = "plate";
  values.DATABASE_URL = buildPostgresUrl({
    host: values.POSTGRES_HOST,
    port: values.POSTGRES_PORT,
    user: values.POSTGRES_USER,
    password: values.POSTGRES_PASSWORD,
    database: values.POSTGRES_DATABASE
  });
  values.DIRECT_URL = values.DATABASE_URL;
  values.REDIS_HOST = "localhost";
  values.REDIS_PORT = "6379";
  values.REDIS_PASSWORD = "";
  values.CORS_ENABLED = "true";
  values.NODE_ENV = "development";
  values.NODE_OPTIONS = "--no-deprecation";

  const adminWebPort = envValue(values, "ADMIN_WEB_PORT", "3000");
  const coreApiPort = envValue(values, "CORE_API_PORT", "3006");
  const storybookPort = envValue(values, "STORYBOOK_PORT", "6006");

  values.ADMIN_WEB_URL = `http://localhost:${adminWebPort}`;
  values.CORE_API_URL = `http://localhost:${coreApiPort}`;
  values.STORYBOOK_URL = `http://localhost:${storybookPort}`;
  values.CORE_API_INTERNAL_URL = values.CORE_API_URL;
  values.NEXT_PUBLIC_WS_URL = `ws://localhost:${coreApiPort}`;
  values.OIDC_ISSUER = values.ADMIN_WEB_URL;
  values.OIDC_JWKS_URI = `${values.ADMIN_WEB_URL}/oidc/jwks`;
  values.OIDC_ADMIN_BASE_URL = values.ADMIN_WEB_URL;
  values.OIDC_INTERACTION_BASE_URL = `${values.ADMIN_WEB_URL}/admin`;
  values.OIDC_STORYBOOK_BASE_URL = values.STORYBOOK_URL;

  return values;
}

function writeAppEnvFiles({ worktreePath, values }) {
  writeEnvValuesFile(path.join(worktreePath, "apps/core/api/.env"), {
    APP_NAME: "core-api",
    APP_PORT: envValue(values, "CORE_API_PORT", "3006"),
    NODE_ENV: values.NODE_ENV,
    CHOKIDAR_USEPOLLING: "1",
    CHOKIDAR_INTERVAL: "1000",
    WATCHPACK_POLLING: "true",
    NODE_OPTIONS: values.NODE_OPTIONS,
    APP_ADMIN_EMAIL: "admin@example.com",
    API_PREFIX: "api",
    FRONTEND_DOMAIN: values.ADMIN_WEB_URL,
    BACKEND_DOMAIN: values.CORE_API_URL,
    APP_FALLBACK_LANGUAGE: "en",
    APP_HEADER_LANGUAGE: "x-custom-lang",
    DATABASE_URL: values.DATABASE_URL,
    DIRECT_URL: values.DIRECT_URL,
    REDIS_HOST: values.REDIS_HOST,
    REDIS_PORT: values.REDIS_PORT,
    REDIS_PASSWORD: values.REDIS_PASSWORD,
    CORS_ENABLED: values.CORS_ENABLED,
    SMTP_HOST: "smtp.resend.com",
    SMTP_PORT: "465",
    SMTP_SECURE: "true",
    SMTP_USERNAME: "resend",
    SMTP_PASSWORD: "re_xxxxxxxxx",
    SMTP_SENDER: "noreply@onjitda.com",
    OBJECT_STORAGE_PROVIDER: "cloudflare-r2",
    OBJECT_STORAGE_ACCESS_KEY: "dev-access-key",
    OBJECT_STORAGE_SECRET_KEY: "dev-secret-key",
    OBJECT_STORAGE_API_TOKEN: "",
    OBJECT_STORAGE_REGION: "auto",
    OBJECT_STORAGE_BUCKET: "dev-bucket",
    OBJECT_STORAGE_ENDPOINT: "https://example.r2.cloudflarestorage.com",
    OBJECT_STORAGE_PUBLIC_BASE_URL: "",
    OBJECT_STORAGE_FORCE_PATH_STYLE: "false",
    OIDC_ISSUER: values.OIDC_ISSUER,
    OIDC_COOKIE_SECRET: "dev-cookie-secret-must-be-at-least-32-characters",
    OIDC_JWKS_URI: values.OIDC_JWKS_URI,
    OIDC_ADMIN_BASE_URL: values.OIDC_ADMIN_BASE_URL,
    OIDC_INTERACTION_BASE_URL: values.OIDC_INTERACTION_BASE_URL,
    OIDC_ADMIN_CLIENT_ID: "admin-web",
    OIDC_ADMIN_CLIENT_SECRET: "admin-secret-change-in-development",
    OIDC_STORYBOOK_BASE_URL: values.OIDC_STORYBOOK_BASE_URL,
    OIDC_STORYBOOK_CLIENT_ID: "storybook-web",
    OIDC_STORYBOOK_CLIENT_SECRET: "storybook-secret-change-in-development",
    AUTH_JWT_TOKEN_EXPIRES_IN: "10d",
    AUTH_JWT_TOKEN_REFRESH_IN: "7d",
    ENABLE_NEST_DEVTOOLS: "false",
    CORE_API_NEST_DEVTOOLS_PORT: "8000"
  });

  writeEnvValuesFile(path.join(worktreePath, "apps/admin/web/.env.local"), {
    ADMIN_WEB_PORT: envValue(values, "ADMIN_WEB_PORT", "3000"),
    NODE_ENV: values.NODE_ENV,
    NODE_OPTIONS: values.NODE_OPTIONS,
    CORE_API_INTERNAL_URL: values.CORE_API_INTERNAL_URL,
    NEXT_PUBLIC_WS_URL: values.NEXT_PUBLIC_WS_URL
  });
}

function writeEnvValuesFile(filePath, values) {
  ensureDir(path.dirname(filePath));
  const lines = ["# Generated by scripts/wt.js"];
  for (const [key, value] of Object.entries(values)) {
    lines.push(`${key}=${formatEnvValue(value)}`);
  }
  lines.push("");
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function buildPostgresUrl({ host, port, user, password, database }) {
  const username = user ? encodeURIComponent(user) : "";
  const credentials = username
    ? `${username}${password ? `:${encodeURIComponent(password)}` : ""}@`
    : "";
  return `postgresql://${credentials}${host}:${port}/${database}?schema=public`;
}

function envValue(values, key, fallback) {
  const value = values[key];
  if (value === undefined || value === null || String(value).trim() === "") {
    return fallback;
  }
  return String(value);
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

function ensureTmuxWindow({ sessionName, windowName, worktreePath }) {
  const query = runAllowFailure("tmux", ["list-windows", "-t", sessionName, "-F", "#{window_name}"]);
  if (query.status !== 0) {
    const stderr = (query.stderr || "").trim();
    const stdout = (query.stdout || "").trim();
    throw new Error(stderr || stdout || `Failed to query tmux windows for ${sessionName}.`);
  }

  const windows = splitLines(query.stdout || "");
  if (windows.includes(windowName)) {
    return;
  }

  run("tmux", ["new-window", "-t", sessionName, "-n", windowName, "-c", worktreePath]);
}

function buildTmuxSessionName(prefix, branch) {
  const prefixSafe = String(prefix || "wt").replace(/[^A-Za-z0-9_-]/g, "-");
  const branchSafe = String(branch).replace(/[^A-Za-z0-9_-]/g, "-");
  const branchHash = shortHash(branch);
  const branchLabel = branchSafe.replace(/-+/g, "-").replace(/^-+|-+$/g, "") || "branch";
  const base = `${prefixSafe}-${branchLabel}-${branchHash}`.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return base.slice(0, 50) || `wt-${Date.now()}`;
}

function shortHash(value) {
  const text = String(value || "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).slice(0, 8);
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
  const name = String(command || "").trim();
  if (!name) {
    return false;
  }

  if (name.includes(path.sep)) {
    return isExecutableFile(name);
  }

  const pathValue = String(process.env.PATH || "");
  const segments = pathValue.split(path.delimiter);
  for (const segment of segments) {
    if (!segment) {
      continue;
    }
    const candidate = path.join(segment, name);
    if (isExecutableFile(candidate)) {
      return true;
    }
  }

  return false;
}

function isExecutableFile(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.X_OK);
    const stat = fs.statSync(filePath);
    return stat.isFile();
  } catch (_error) {
    return false;
  }
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
