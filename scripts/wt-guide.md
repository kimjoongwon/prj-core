# Worktree + tmux 운영 가이드

## 1. 목적

이 가이드는 `prj-core`에서 병렬 작업을 안전하게 운영하기 위한 표준 흐름을 설명합니다.

- `worktree`: 브랜치/작업 디렉토리 격리
- `tmux`: 세션 유지(터미널 종료/SSH 단절 대비)
- `wt.js`: 생성/접속/조회/정리 자동화

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

## 3. 명령어 상세

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

### `pnpm wt:go <ticket-or-branch>`

- 예: `pnpm wt:go AUTH-21`, `pnpm wt:go feat/AUTH-21`
- tmux 사용 가능 시:
  - 세션이 있으면 attach/switch
  - 세션이 없으면 자동 재생성 후 attach/switch
- tmux 비활성/미설치 시:
  - `cd <worktreePath>`를 출력

### `pnpm wt:list`

- registry 기준으로 현재 항목을 표 형태로 출력합니다.
- 주요 컬럼:
  - `ticket`, `branch`, `slot`
  - `worktree` (`yes`/`missing`)
  - `tmux` (`up`/`down`/`none`/`na`/`off`)

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

## 4. 일상 작업 루틴 (권장)

### 4.1 신규 작업 시작

```bash
pnpm wt:new AUTH-21
pnpm wt:go AUTH-21
```

tmux 세션 내부에서 worktree 경로로 이동 후 작업합니다.

### 4.2 개발 서버 실행

필요 시 환경 파일을 먼저 로드합니다.

```bash
cd /Users/wallykim/dev/wt/prj-core-AUTH-21
source .env.worktree
pnpm start
```

주의:
- `.env.worktree`는 포트 값을 생성해 주지만, 각 앱이 해당 env를 실제로 읽도록 실행 명령/스크립트가 연결되어 있어야 포트가 적용됩니다.

### 4.3 PR 생성

```bash
git add -A
git commit -m "feat(auth): add ..."
git fetch origin
git rebase origin/main
git push -u origin feat/AUTH-21
gh pr create --base main --head feat/AUTH-21 --fill
```

### 4.4 작업 종료 정리

```bash
pnpm wt:rm AUTH-21
```

필요하면 remote 브랜치까지 삭제합니다.

```bash
git push origin --delete feat/AUTH-21
```

## 5. 설정 파일 (`.wt/config.json`)

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
      "PROPOSAL_WEB_PORT": 3001,
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

## 6. 신규 프로젝트로 이식

1. `scripts/wt.js` 복사
2. `.wt/config.json` 생성/수정
3. `package.json`에 스크립트 추가

```json
{
  "scripts": {
    "wt": "node scripts/wt.js",
    "wt:init": "node scripts/wt.js init",
    "wt:new": "node scripts/wt.js new",
    "wt:go": "node scripts/wt.js go",
    "wt:list": "node scripts/wt.js list",
    "wt:rm": "node scripts/wt.js rm"
  }
}
```

4. `pnpm wt:init` 후 `pnpm wt:new <ticket>`로 검증

## 7. 트러블슈팅

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
