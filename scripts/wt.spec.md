# wt.js Sidecar Spec

## 목적

- git worktree 생명주기를 관리하는 재사용 가능한 core CLI를 제공합니다.
- 선택형 `scripts/wt.ts` 진입점 뒤에서 실제 실행 엔진 역할을 맡습니다.
- 선택형 메뉴를 거치지 않는 직접 호출(`pnpm wt:new`, `pnpm wt:finish`)도 안정적으로 처리합니다.
- 런타임 상태는 repo 작업 디렉터리 바깥 git common dir에 유지합니다.

## 명령 계약

- `init`: 설정 파일이 없으면 생성합니다.
- `new <ticket>`: slot 할당, 브랜치/worktree 생성, env 파일 작성, tmux 세션/윈도우 생성을 수행합니다.
- `new-run <ticket> [--prompt <text>]`: `new`를 실행한 뒤 tmux에 Codex 작업을 큐잉하고 필요하면 자동 attach 합니다.
  - `--prompt`가 없고 TTY이면 사용자에게 입력을 받습니다.
  - 기본값으로 Codex 성공 후 `wt:pr <ticket>`를 이어서 실행합니다. (`--no-pr`로 비활성화)
- `go <ticket-or-branch>`: tmux 사용 가능 시 attach하고, 아니면 `cd` 경로를 출력합니다.
- `list`: registry 항목과 worktree/tmux 상태를 출력합니다. (`--json` 지원)
- `plan-merge <ticket|branch>`: 브랜치 작업 결과를 분석해 `merge|squash|rebase`를 추천합니다.
- `pr <ticket|branch>`: 브랜치를 push하고 PR을 생성하거나 재사용합니다.
- `merge <ticket|branch>`: review gate를 먼저 실행하고, 통과 시 명시한 전략 또는 추천 전략으로 PR을 병합합니다.
- `finish <ticket|branch>`: rebase, push, PR, review, merge, cleanup을 한 흐름으로 실행합니다.
- `rm <ticket-or-branch>`: tmux를 멈추고 worktree를 제거하며 기본적으로 로컬 브랜치도 삭제합니다.
  - 안전 기본값: `git worktree remove`와 `git branch -d`
  - 강제 옵션: `--force`는 `git worktree remove --force`와 `git branch -D`
  - `-d`가 실패해도 브랜치는 유지하고 cleanup은 계속합니다.
- `help`: 명령 사용법을 출력합니다.

## 설정 계약

- 외부 JSON 설정 파일을 사용합니다. 기본 경로는 `.wt/config.json`이고 `--config`로 덮어쓸 수 있습니다.
- 필수 동작 키:
  - `worktreeRoot`, `directoryNameTemplate`, `branchPrefix`, `baseRef`, `envFileName`
  - `reviewGate.enabled`, `reviewGate.role`, `reviewGate.reviewMapFile`
  - `port.offsetStep`, `port.map`
  - `tmux.enabled`, `tmux.sessionPrefix`, `tmux.windows`

## Review Gate

- `merge`와 `finish`는 기본적으로 `reviewGate`를 실행합니다.
- review gate는 tracked worktree를 기준으로 `git diff <baseRef>...HEAD`를 검토합니다.
- reviewer는 `.codex/review-map.toml`로 changed file을 role 규칙에 매핑하고, 각 role 문서를 근거로 findings를 보고합니다.
- finding이 하나라도 있으면 merge를 중단합니다.
- `--dry-run`에서는 reviewer 실행 대신 planned command만 출력합니다.

## 런타임 데이터

- registry 경로: `<git-common-dir>/wt-tool/registry.json`
- registry 저장 항목:
  - `ticket`, `branch`, `slot`
  - `worktreePath`, `envFilePath`, `sessionName`
  - `createdAt`

## 오류 및 출력

- 명령 실행 전에 config 형식과 값을 검증합니다.
- 정상 흐름의 콘솔 출력은 짧게 유지합니다.
- top-level 도움말과 오류 접두어는 한국어 중심으로 출력합니다.
- AI orchestration 흐름에서는 `--json`으로 기계 판독용 payload를 제공합니다.

## 변경 이력

| Date       | Change                                                                                                             | Author |
| ---------- | ------------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-04-23 | `merge`/`finish`에 `qa-pr-reviewer` 기반 review gate와 `reviewGate` 설정 계약을 추가                             | codex  |
| 2026-04-22 | core help와 top-level 오류 문구를 한국어 중심 UX로 정리함                                                         | codex  |
| 2026-04-22 | Update core help text to present `pnpm wt` and `wt:*` as the primary invocation style                             | codex  |
| 2026-04-22 | Clarify `wt.js` as the core executor behind the interactive `wt.ts` entrypoint                                     | codex  |
| 2026-02-28 | Initial spec for reusable git worktree + tmux automation                                                           | codex  |
| 2026-02-28 | Align defaults to project workflow (`../wt`, `feat/*`, `origin/main`) and add safe `rm` behavior                   | codex  |
| 2026-02-28 | Add AI-controlled PR/merge lifecycle commands (`plan-merge`, `pr`, `merge`, `finish`) and JSON output mode         | codex  |
| 2026-02-28 | Add `new-run` command for one-shot worktree creation and Codex task bootstrapping in tmux                          | codex  |
| 2026-02-28 | Replace `which`-based command detection with PATH executable lookup for pnpm compatibility                         | codex  |
| 2026-02-28 | Make `go` non-interactive-safe by printing attach hints when TTY is unavailable                                    | codex  |
| 2026-02-28 | Simplify `new-run` to core flow (Codex exec + default auto-PR) and remove interactive mode option                  | codex  |
| 2026-02-28 | Improve ticket sanitization/branch normalization to support Korean tickets and avoid bare `feat` branch collisions | codex  |
| 2026-02-28 | Add hash suffix to tmux session naming to avoid collisions for non-ASCII branch names                              | codex  |
