# Worktree + tmux + AI Merge 운영 가이드

## 1. 목적

`prj-core`에서 병렬 작업을 안전하게 운영하고, PR 생성/병합/정리까지 AI가 일관되게 제어하기 위한 표준 흐름입니다.

- `worktree`: 브랜치/작업 디렉토리 격리
- `tmux`: 세션 유지(터미널 종료/SSH 단절 대비)
- `wt.js`: 생성/접속/조회/PR/병합/정리 자동화

## 2. 빠른 시작

```bash
pnpm wt:init
pnpm wt:new AUTH-21
pnpm wt:go AUTH-21
```

위 3개 명령으로 아래가 자동 처리됩니다.

1. 브랜치 생성: `feat/AUTH-21`
2. worktree 생성: `../wt/prj-core-AUTH-21`
3. env 파일 생성: `.env.worktree`
4. tmux 세션 생성: `wt-feat-AUTH-21`

Codex 작업까지 한 번에 시작하려면:

```bash
pnpm wt:new-run AUTH-21
```

- 기본: tmux `code` 윈도우에 `codex exec` 실행 후 `pnpm wt:pr <ticket>`까지 자동 큐잉합니다.
- `--no-go`: attach 없이 백그라운드 실행만 합니다.
- `--no-pr`: Codex 실행만 하고 PR 자동 생성은 생략합니다.

## 3. AI 통합 마무리 플로우

### 3.1 추천 전략 확인

```bash
pnpm wt:plan-merge AUTH-21
```

브랜치 작업물을 분석해서 `merge | squash | rebase` 권장 전략을 제시합니다.

### 3.2 PR 생성/재사용

```bash
pnpm wt:pr AUTH-21
```

- 기본 동작: `git push -u origin <branch>` 후 PR이 없으면 생성, 있으면 재사용
- 기본 PR 생성 옵션: `--fill`

### 3.3 병합 실행

```bash
pnpm wt:merge AUTH-21 --strategy auto --auto
```

- `--strategy auto`면 `plan-merge` 추천 전략을 자동 적용
- `--auto`면 GitHub auto-merge 설정

### 3.4 원샷 종료(권장)

```bash
pnpm wt:finish AUTH-21 --strategy auto
```

`finish`는 아래를 한 번에 수행합니다.

1. base 최신화(fetch)
2. rebase (기본 on)
3. push (기본 on)
4. PR 생성/재사용
5. 추천 전략으로 merge 실행
6. 병합 완료 시 remote/local/worktree 정리

## 4. 명령어 상세

### `pnpm wt:init`

- `.wt/config.json`이 없을 때 기본 설정 파일을 생성합니다.
- 이미 있으면 생성하지 않고 경로만 출력합니다.

### `pnpm wt:new <ticket>`

- 예: `pnpm wt:new AUTH-21`
- 수행 내용:
  - `baseRef`(기본 `origin/main`)에서 새 브랜치 생성
  - `worktreeRoot`(기본 `../wt`) 아래 worktree 생성
  - slot 할당 후 `.env.worktree` 생성
  - tmux가 있으면 세션과 윈도우 생성

### `pnpm wt:new-run <ticket> [--prompt "<text>"] [옵션]`

- 예:
  - `pnpm wt:new-run AUTH-21`
  - `pnpm wt:new-run AUTH-22 --no-go`
  - `pnpm wt:new-run AUTH-23 --no-pr`
  - `pnpm wt:new-run AUTH-24 --prompt "A 기획 보강 후 추가 개발"`
- 수행 내용:
  - `wt:new` 실행 (브랜치/worktree/env/tmux 세션 생성)
  - 지정 윈도우(기본 `code`)에 Codex 명령 주입
  - Codex 성공 종료 시 `pnpm wt:pr <ticket>` 자동 실행 (기본 on)
  - 기본적으로 `wt:go`까지 실행해서 즉시 세션 attach
- 옵션:
  - `--prompt "<text>"`: Codex 초기 작업 지시문 직접 지정 (미지정 시 CLI가 입력 질문)
  - `--window <name>`: 실행할 tmux 윈도우명 (기본 `code`)
  - `--no-go`: 세션 attach 생략
  - `--no-pr`: PR 자동 생성 생략
  - `--pr`: PR 자동 생성 강제 (기본값)
  - `--json`: JSON 출력 (`attach`는 자동 생략)

### `pnpm wt:go <ticket-or-branch>`

- 예: `pnpm wt:go AUTH-21`, `pnpm wt:go feat/AUTH-21`
- tmux 사용 가능 시:
  - 세션이 있으면 attach/switch
  - 세션이 없으면 자동 재생성 후 attach/switch
  - 비대화식 실행(TTY 없음)에서는 attach 대신 `tmux attach -t <session>`와 `cd` 경로를 출력
- tmux 비활성/미설치 시:
  - `cd <worktreePath>`를 출력

### `pnpm wt:list [--json]`

- registry 기준으로 현재 항목을 출력합니다.
- `--json` 옵션으로 AI 파싱 가능한 결과를 제공합니다.
- 주요 컬럼:
  - `ticket`, `branch`, `slot`
  - `worktree` (`yes`/`missing`)
  - `tmux` (`up`/`down`/`none`/`na`/`off`)

### `pnpm wt:plan-merge <ticket-or-branch> [--base <branch-or-ref>] [--json]`

- 작업물 지표를 수집합니다.
  - ahead/behind
  - commit 수/merge commit 수
  - changed file/line/domain
  - commit message 품질(fixup/wip 등)
- 추천 전략을 반환합니다.
  - `merge`: 기존 merge commit 존재, 혹은 스키마 포함 대규모 교차 도메인 변경
  - `squash`: 단일 커밋, WIP/fixup 포함, 매우 큰 변경
  - `rebase`: 정돈된 소~중규모 멀티 커밋

### `pnpm wt:pr <ticket-or-branch> [옵션]`

옵션:

- `--base <branch-or-ref>`: 기본 대상 브랜치 변경
- `--draft`: draft PR 생성
- `--no-push`: push 생략
- `--no-fill --title "<title>"`: 자동 설명 채우기 비활성
- `--body-file <path>`: 본문 파일 지정
- `--json`: JSON 출력

### `pnpm wt:merge <ticket-or-branch> [옵션]`

옵션:

- `--strategy <auto|merge|squash|rebase>` (기본 `auto`)
- `--auto` / `--no-auto`: GitHub auto-merge 사용 여부
- `--admin`: admin 권한으로 병합 시도
- `--delete-branch`: GitHub 병합 시 브랜치 삭제 요청
- `--dry-run`: 실행 커맨드만 출력
- `--json`: JSON 출력

### `pnpm wt:finish <ticket-or-branch> [옵션]`

옵션:

- `--strategy <auto|merge|squash|rebase>` (기본 `auto`)
- `--base <branch-or-ref>`
- `--no-rebase`
- `--no-push`
- `--draft`
- `--auto` / `--no-auto`
- `--admin`
- `--keep-worktree`: 병합 후 worktree 유지
- `--keep-branch`: 병합 후 local branch 유지
- `--keep-remote-branch`: 병합 후 remote branch 유지
- `--force`: dirty worktree 보호 해제
- `--dry-run`
- `--json`

### `pnpm wt:rm <ticket-or-branch>`

- 예:
  - `pnpm wt:rm AUTH-21`
  - `pnpm wt:rm AUTH-21 --keep-branch`
  - `pnpm wt:rm AUTH-21 --force`
- 기본 동작(안전 모드):
  - dirty worktree면 삭제 중단
  - 브랜치 삭제는 `git branch -d` (미병합이면 유지)
- 강제 모드(`--force`):
  - `git worktree remove --force`
  - `git branch -D`

## 5. 일상 작업 루틴 (권장)

### 5.1 신규 작업 시작

```bash
pnpm wt:new AUTH-21
pnpm wt:go AUTH-21
```

### 5.2 개발 서버 실행

```bash
cd /Users/wallykim/dev/wt/prj-core-AUTH-21
source .env.worktree
pnpm start
```

주의:

- `pnpm start`(`scripts/start.sh`)는 `.env.worktree`가 있으면 자동으로 로드합니다.
- 앱 `start:dev` 스크립트는 `*_PORT` env가 있으면 해당 값으로 실행되고, 없으면 기본 포트를 사용합니다.

### 5.3 AI 통제 마무리

```bash
pnpm wt:finish AUTH-21 --strategy auto
```

병합이 즉시 완료되지 않고 auto-merge 대기 상태면 worktree 정리는 건너뜁니다.

## 6. 설정 파일 (`.wt/config.json`)

기본 예시는 아래와 같습니다.

```json
{
  "worktreeRoot": "../wt",
  "directoryNameTemplate": "{{repo}}-{{ticket}}",
  "branchPrefix": "feat",
  "baseRef": "origin/main",
  "envFileName": ".env.worktree",
  "port": {
    "offsetStep": 20,
    "map": {
      "ADMIN_WEB_PORT": 3000,
      "CORE_API_PORT": 3006,
      "IDP_API_PORT": 3007,
      "IDP_WEB_PORT": 3008,
      "STORYBOOK_PORT": 6006
    }
  },
  "tmux": {
    "enabled": true,
    "sessionPrefix": "wt",
    "windows": [{ "name": "code" }, { "name": "web" }, { "name": "api" }, { "name": "test" }]
  }
}
```

설정 키 설명:

- `worktreeRoot`: worktree 저장 루트
- `directoryNameTemplate`: 폴더명 템플릿 (`{{repo}}`, `{{ticket}}`, `{{branch}}`, `{{slot}}`)
- `branchPrefix`: 브랜치 prefix (`feat`, `fix` 등)
- `baseRef`: 분기 기준 ref (`origin/main` 권장)
- `envFileName`: 생성 env 파일명
- `port.offsetStep`: slot 증가 시 포트 오프셋
- `port.map`: env 변수명과 base port 매핑
- `tmux.enabled`: tmux 사용 여부
- `tmux.sessionPrefix`: 세션명 prefix
- `tmux.windows`: 기본 윈도우 목록

## 7. 신규 프로젝트로 이식

1. `scripts/wt.js` 복사
2. `.wt/config.json` 생성/수정
3. `package.json`에 스크립트 추가

```json
{
  "scripts": {
    "wt": "node scripts/wt.js",
    "wt:init": "node scripts/wt.js init",
    "wt:new": "node scripts/wt.js new",
    "wt:new-run": "node scripts/wt.js new-run",
    "wt:go": "node scripts/wt.js go",
    "wt:list": "node scripts/wt.js list",
    "wt:plan-merge": "node scripts/wt.js plan-merge",
    "wt:pr": "node scripts/wt.js pr",
    "wt:merge": "node scripts/wt.js merge",
    "wt:finish": "node scripts/wt.js finish",
    "wt:rm": "node scripts/wt.js rm"
  }
}
```

4. `pnpm wt:init` 후 `pnpm wt:new <ticket>`로 검증

## 8. 트러블슈팅

### `tmux not found`

- tmux 미설치 상태입니다.
- 설치 전까지는 `wt:go`가 `cd <path>`만 출력합니다.

### `Worktree path already exists`

- 동일 경로의 기존 디렉토리가 남아 있습니다.
- 불필요하면 수동 정리 후 다시 `wt:new`를 실행합니다.

### `Branch already exists`

- 같은 브랜치가 이미 존재합니다.
- 기존 worktree를 `wt:list`로 확인 후 `wt:go` 또는 `wt:rm`을 사용합니다.

### `Worktree has uncommitted changes`

- 안전 모드 보호 동작입니다.
- 변경을 커밋하거나 의도적으로 삭제할 때만 `--force`를 사용합니다.

### `gh command not found`

- GitHub CLI 미설치 상태입니다.
- `wt:pr`, `wt:merge`, `wt:finish`는 `gh`가 필요합니다.

### `codex command not found`

- Codex CLI 미설치 상태입니다.
- `wt:new-run`은 `codex` 실행 파일이 필요합니다.

### `new-run 후 PR이 자동으로 안 만들어짐`

- `codex exec`가 실패 종료되면 `pnpm wt:pr`가 실행되지 않습니다.
- `--no-pr` 옵션을 사용한 경우 자동 PR은 의도적으로 생략됩니다.
