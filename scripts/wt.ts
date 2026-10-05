#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

type GitContext = {
  currentRepoRoot: string;
  sharedRepoRoot: string;
  commonDir: string;
  configPath: string;
};

type TrackedEntry = {
  ticket: string;
  branch: string;
  slot: number;
  worktree: string;
  tmux: string;
  path: string;
};

type MenuAction = {
  id:
    | "init"
    | "new"
    | "new-run"
    | "go"
    | "list"
    | "pr"
    | "plan-merge"
    | "finish"
    | "rm"
    | "help"
    | "exit";
  label: string;
  detail: string;
};

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const CORE_SCRIPT_PATH = path.join(SCRIPT_DIR, "wt.js");

void main();

async function main() {
  try {
    const forwardedArgs = process.argv.slice(2);
    const gitContext = resolveGitContext();

    if (forwardedArgs.length > 0) {
      process.exit(runCore(forwardedArgs, gitContext));
    }

    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      process.exit(runCore(["help"], gitContext));
    }

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    try {
      const interactiveArgs = await buildInteractiveArgs(rl, gitContext);
      if (!interactiveArgs) {
        return;
      }

      rl.close();
      process.exit(runCore(interactiveArgs, gitContext));
    } finally {
      rl.close();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`오류: ${message}`);
    process.exit(1);
  }
}

function resolveGitContext(): GitContext {
  const currentRepoRoot = runCapture("git", ["rev-parse", "--show-toplevel"], process.cwd());
  const commonDirRaw = runCapture(
    "git",
    ["rev-parse", "--git-common-dir"],
    currentRepoRoot,
  );
  const commonDir = path.resolve(currentRepoRoot, commonDirRaw);
  const sharedRepoRoot =
    path.basename(commonDir) === ".git" ? path.dirname(commonDir) : currentRepoRoot;

  return {
    currentRepoRoot,
    sharedRepoRoot,
    commonDir,
    configPath: path.join(sharedRepoRoot, ".wt", "config.json"),
  };
}

function runCapture(command: string, args: string[], cwd: string): string {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(detail || `${command} ${args.join(" ")} failed.`);
  }

  return (result.stdout || "").trim();
}

function runCore(args: string[], gitContext: GitContext): number {
  const finalArgs = [CORE_SCRIPT_PATH, ...withConfigOverride(args, gitContext.configPath)];
  const result = spawnSync(process.execPath, finalArgs, {
    cwd: gitContext.sharedRepoRoot,
    stdio: "inherit",
  });

  return result.status ?? 1;
}

function runCoreJson(args: string[], gitContext: GitContext): unknown {
  const finalArgs = [CORE_SCRIPT_PATH, ...withConfigOverride(args, gitContext.configPath)];
  const result = spawnSync(process.execPath, finalArgs, {
    cwd: gitContext.sharedRepoRoot,
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    throw new Error(detail || `wt core failed: ${args.join(" ")}`);
  }

  try {
    return JSON.parse(result.stdout || "null");
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to parse wt JSON output: ${detail}`);
  }
}

function withConfigOverride(args: string[], configPath: string): string[] {
  if (args.includes("--config")) {
    return args;
  }

  return [...args, "--config", configPath];
}

async function buildInteractiveArgs(
  rl: ReturnType<typeof createInterface>,
  gitContext: GitContext,
): Promise<string[] | null> {
  const configExists = fs.existsSync(gitContext.configPath);
  const entries = configExists ? loadTrackedEntries(gitContext) : [];
  const actions = buildMenuActions(configExists, entries.length);

  printMenuHeader(gitContext, configExists, entries);
  const action = await chooseMenuAction(rl, actions);

  switch (action.id) {
    case "exit":
      return null;
    case "init":
      return ["init"];
    case "new": {
      const ticket = await promptRequired(rl, "티켓 또는 작업 키");
      return ["new", ticket];
    }
    case "new-run": {
      const ticket = await promptRequired(rl, "티켓 또는 작업 키");
      const prompt = await promptRequired(rl, "Codex 작업 지시문");
      const go = await promptYesNo(rl, "작업 큐 등록 후 tmux 세션에 바로 붙을까요?", true);
      const autoPr = await promptYesNo(
        rl,
        "Codex 작업이 끝나면 `pnpm wt:pr`까지 이어서 실행할까요?",
        true,
      );
      const args = ["new-run", ticket, "--prompt", prompt];
      if (!go) {
        args.push("--no-go");
      }
      if (!autoPr) {
        args.push("--no-pr");
      }
      return args;
    }
    case "go": {
      const target = await chooseTrackedTarget(rl, entries, "이동할 worktree를 고르세요");
      return target ? ["go", target] : null;
    }
    case "list":
      return ["list"];
    case "pr": {
      const target = await chooseTrackedTarget(rl, entries, "PR을 만들 worktree를 고르세요");
      return target ? ["pr", target] : null;
    }
    case "plan-merge": {
      const target = await chooseTrackedTarget(
        rl,
        entries,
        "병합 전략을 확인할 worktree를 고르세요",
      );
      return target ? ["plan-merge", target] : null;
    }
    case "finish": {
      const target = await chooseTrackedTarget(
        rl,
        entries,
        "마무리할 worktree를 고르세요",
      );
      return target ? ["finish", target, "--strategy", "auto"] : null;
    }
    case "rm": {
      const target = await chooseTrackedTarget(rl, entries, "정리할 worktree를 고르세요");
      if (!target) {
        return null;
      }
      const deleteBranch = await promptYesNo(rl, "로컬 브랜치도 같이 삭제할까요?", false);
      const force = await promptYesNo(rl, "worktree가 더러워도 강제로 삭제할까요?", false);
      const args = ["rm", target];
      if (!deleteBranch) {
        args.push("--keep-branch");
      }
      if (force) {
        args.push("--force");
      }
      return args;
    }
    case "help":
      return ["help"];
    default:
      return null;
  }
}

function loadTrackedEntries(gitContext: GitContext): TrackedEntry[] {
  const payload = runCoreJson(["list", "--json"], gitContext);

  if (!payload || typeof payload !== "object" || !("entries" in payload)) {
    throw new Error("wt 목록 결과 형식이 올바르지 않습니다.");
  }

  const entries = Array.isArray(payload.entries) ? payload.entries : [];

  return entries.map((entry) => ({
    ticket: String(entry.ticket || ""),
    branch: String(entry.branch || ""),
    slot: Number(entry.slot ?? 0),
    worktree: String(entry.worktree || ""),
    tmux: String(entry.tmux || ""),
    path: String(entry.path || ""),
  }));
}

function buildMenuActions(configExists: boolean, entryCount: number): MenuAction[] {
  if (!configExists) {
    return [
      {
        id: "init",
        label: "worktree 설정 초기화",
        detail: "공용 worktree 흐름을 쓰기 전에 `.wt/config.json`을 만듭니다.",
      },
      {
        id: "help",
        label: "원시 명령 도움말 보기",
        detail: "직접 CLI로 쓸 때 필요한 하위 명령을 출력합니다.",
      },
      {
        id: "exit",
        label: "종료",
        detail: "아무 명령도 실행하지 않고 메뉴를 닫습니다.",
      },
    ];
  }

  const actions: MenuAction[] = [
    {
      id: "new",
      label: "새 worktree 시작",
      detail: "브랜치, worktree, env 파일, tmux 세션을 한 번에 만듭니다.",
    },
    {
      id: "new-run",
      label: "새 worktree 시작 후 Codex 작업 연결",
      detail: "worktree를 만들고 `codex exec`와 PR 생성 흐름까지 이어서 준비합니다.",
    },
    {
      id: "list",
      label: "등록된 worktree 보기",
      detail: "현재 registry와 worktree/tmux 상태를 확인합니다.",
    },
  ];

  if (entryCount > 0) {
    actions.push(
      {
        id: "go",
        label: "기존 worktree로 이동",
        detail: "tmux 세션에 붙거나 worktree 경로를 확인합니다.",
      },
      {
        id: "pr",
        label: "PR 만들기 또는 재사용",
        detail: "필요하면 브랜치를 push하고 연결된 PR을 엽니다.",
      },
      {
        id: "plan-merge",
        label: "병합 전략 추천 받기",
        detail: "브랜치 이력을 보고 merge, squash, rebase 중 하나를 추천합니다.",
      },
      {
        id: "finish",
        label: "worktree 마무리 및 병합",
        detail: "기본 rebase/push/PR/merge/cleanup 흐름을 자동 전략으로 실행합니다.",
      },
      {
        id: "rm",
        label: "등록된 worktree 정리",
        detail: "worktree와 registry를 정리하고 필요하면 로컬 브랜치도 삭제합니다.",
      },
    );
  }

  actions.push(
    {
      id: "help",
      label: "원시 명령 도움말 보기",
      detail: "직접 CLI로 쓸 때 필요한 하위 명령을 출력합니다.",
    },
    {
      id: "exit",
      label: "종료",
      detail: "아무 명령도 실행하지 않고 메뉴를 닫습니다.",
    },
  );

  return actions;
}

function printMenuHeader(
  gitContext: GitContext,
  configExists: boolean,
  entries: TrackedEntry[],
) {
  console.log("wt 작업 메뉴");
  console.log(`저장소 : ${gitContext.sharedRepoRoot}`);
  if (gitContext.currentRepoRoot !== gitContext.sharedRepoRoot) {
    console.log(`현재 위치 : ${gitContext.currentRepoRoot}`);
  }
  console.log(
    `설정 : ${configExists ? "준비됨" : `없음 (${gitContext.configPath})`}`,
  );
  console.log(`상태 : 등록된 worktree ${entries.length}개`);
  console.log("");
}

async function chooseMenuAction(
  rl: ReturnType<typeof createInterface>,
  actions: MenuAction[],
): Promise<MenuAction> {
  return chooseFromList(rl, "실행할 작업을 고르세요", actions, (action) => ({
    label: action.label,
    detail: action.detail,
  }));
}

async function chooseTrackedTarget(
  rl: ReturnType<typeof createInterface>,
  entries: TrackedEntry[],
  label: string,
): Promise<string | null> {
  if (entries.length === 0) {
    console.log("아직 등록된 worktree가 없습니다.");
    return null;
  }

  const manualEntry = {
    ticket: "",
    branch: "__manual__",
    slot: -1,
    worktree: "",
    tmux: "",
    path: "",
  };
  const cancelEntry = {
    ticket: "",
    branch: "__cancel__",
    slot: -1,
    worktree: "",
    tmux: "",
    path: "",
  };

  const choice = await chooseFromList(
    rl,
    label,
    [...entries, manualEntry, cancelEntry],
    (entry) => {
      if (entry.branch === "__manual__") {
        return {
          label: "티켓 또는 브랜치를 직접 입력",
          detail: "registry에 없는 대상을 직접 지정할 때 사용합니다.",
        };
      }
      if (entry.branch === "__cancel__") {
        return {
          label: "취소",
          detail: "명령을 실행하지 않고 이전 단계로 돌아갑니다.",
        };
      }
      const title = entry.ticket
        ? `${entry.ticket} | ${entry.branch}`
        : entry.branch;
      return {
        label: title,
        detail: `슬롯 ${entry.slot} | worktree ${entry.worktree} | tmux ${entry.tmux} | ${entry.path}`,
      };
    },
  );

  if (choice.branch === "__cancel__") {
    return null;
  }
  if (choice.branch === "__manual__") {
    return promptRequired(rl, "티켓 또는 브랜치");
  }
  return choice.ticket || choice.branch;
}

async function chooseFromList<T>(
  rl: ReturnType<typeof createInterface>,
  label: string,
  items: T[],
  render: (item: T) => { label: string; detail: string },
): Promise<T> {
  console.log(label);
  items.forEach((item, index) => {
    const view = render(item);
    console.log(`  ${index + 1}. ${view.label}`);
    console.log(`     ${view.detail}`);
  });
  console.log("");

  while (true) {
    const answer = (await rl.question(`번호 선택 [1-${items.length}]: `)).trim();
    const numeric = Number(answer);

    if (Number.isInteger(numeric) && numeric >= 1 && numeric <= items.length) {
      console.log("");
      return items[numeric - 1];
    }

    console.log("목록에 있는 번호만 입력하세요.");
  }
}

async function promptRequired(
  rl: ReturnType<typeof createInterface>,
  label: string,
): Promise<string> {
  while (true) {
    const answer = (await rl.question(`${label}: `)).trim();
    if (answer) {
      console.log("");
      return answer;
    }
    console.log("값을 비워둘 수 없습니다.");
  }
}

async function promptYesNo(
  rl: ReturnType<typeof createInterface>,
  label: string,
  defaultValue: boolean,
): Promise<boolean> {
  const defaultLabel = defaultValue ? "기본: 예" : "기본: 아니오";

  while (true) {
    const answer = (
      await rl.question(`${label} (${defaultLabel}, 예/아니오): `)
    )
      .trim()
      .toLowerCase();
    if (!answer) {
      console.log("");
      return defaultValue;
    }
    if (["y", "yes", "예", "ㅇ", "네"].includes(answer)) {
      console.log("");
      return true;
    }
    if (["n", "no", "아니오", "ㄴ", "아니요"].includes(answer)) {
      console.log("");
      return false;
    }
    console.log("`예` 또는 `아니오`로 입력하세요.");
  }
}
