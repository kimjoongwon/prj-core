# 📦 패키지 배포 스크립트 가이드

이 디렉토리에는 monorepo 내 패키지 버전 관리 및 배포를 위한 스크립트들이 포함되어 있습니다.

## 🎯 주요 스크립트

### 1. `release-pkg.js` - 패키지 릴리즈 자동화

단일 패키지의 버전 업데이트, 빌드, 배포를 한 번에 수행합니다.

**사용법:**

```bash
# 기본 사용 (patch 버전 업데이트)
pnpm release:pkg @cocrepo/db

# 버전 타입 지정
pnpm release:pkg @cocrepo/db patch
pnpm release:pkg @cocrepo/db minor
pnpm release:pkg @cocrepo/db major

# 드라이런 모드 (실제 배포 없이 테스트)
pnpm release:pkg @cocrepo/db patch --dry-run
```

**실행 단계:**

1. 버전 업데이트 (`version-pkg.js` 호출)
2. 패키지 빌드 (`turbo build`)
3. 번들 사이즈 분석 (`analyze-bundle-size.js` 호출)
4. npm 배포 (`pnpm publish`)
5. **Apps 의존성 업데이트 (대화형 모드)** ⭐

### 2. `update-app-deps.js` - Apps 의존성 업데이트

패키지 배포 후 앱들의 의존성을 `workspace:^` 프로토콜로 업데이트합니다.

**사용법:**

```bash
# 대화형 모드 (앱 선택)
pnpm update:app-deps
# 또는
node scripts/update-app-deps.js

# 특정 앱만 업데이트
node scripts/update-app-deps.js server admin
```

**대화형 모드 예시:**

```
📱 업데이트할 앱을 선택해주세요:
============================================================
  admin 업데이트? (y/n) [y]: y
  ✅ admin 선택됨
  server 업데이트? (y/n) [y]: n
  ⏭️  server 건너뜀
  storybook 업데이트? (y/n) [y]: y
  ✅ storybook 선택됨
============================================================

📦 패키지 버전 수집 중...
  ✓ @cocrepo/db@0.3.7
  ✓ @cocrepo/toolkit@1.3.5

📱 앱 의존성 업데이트 중...
  ✅ admin: @cocrepo/db workspace:^0.3.0 → workspace:^0.3.0
  ℹ️  admin: @cocrepo/db 이미 최신 버전 (workspace:^0.3.0)
  💾 admin package.json 업데이트 완료
```

**동작 방식:**

- 패키지 버전 `0.3.7` → 앱 의존성 `workspace:^0.3.0`
- 패키지 버전 `1.4.2` → 앱 의존성 `workspace:^1.4.0`
- 마이너 버전 변경 시에만 업데이트 필요
- 패치 버전은 자동으로 최신 반영

### 3. `version-pkg.js` - 패키지 버전 업데이트

특정 패키지의 버전을 업데이트합니다.

**사용법:**

```bash
node scripts/version-pkg.js @cocrepo/db patch
node scripts/version-pkg.js @cocrepo/toolkit minor
```

### 4. `analyze-bundle-size.js` - 번들 사이즈 분석

패키지의 빌드 결과물 크기를 분석합니다.

**사용법:**

```bash
node scripts/analyze-bundle-size.js @cocrepo/db
```

### 5. `rancher-build.sh` - Rancher Desktop 이미지 파이프라인 (선택형)

빌드할 대상을 선택해 Rancher Desktop 이미지 파이프라인을 수행합니다.
기본 컨테이너 CLI는 `docker`이고, 없으면 `nerdctl`을 사용합니다. 둘 다 PATH에 없으면 Rancher Desktop 번들 CLI를 자동 탐색합니다.
기본 흐름은 `빌드 → 실행 검증 → 정리`입니다.

**사용법:**

```bash
# 대화형 선택 모드
pnpm rancher:build

# CLI 인자 모드 (이름)
bash scripts/rancher-build.sh core-api admin-web

# CLI 인자 모드 (번호)
bash scripts/rancher-build.sh 1 2
```

**기본값/환경 변수:**

- `ENV_NAME`: 기본 `stg`
- `TAG` 또는 `IMAGE_TAG`: 기본 `local-<timestamp>`
- `REGISTRY` 또는 `IMAGE_REGISTRY` 또는 `HARBOR_REGISTRY`: 기본 `harbor.cocdev.co.kr`
- `CACHE_TAG`: 기본 `buildcache`
- `CONTAINER_CLI`: 기본 `docker`, 미설치 시 `nerdctl`, 둘 다 없으면 Rancher Desktop 번들 CLI 자동 선택
- `RUN_CHECK`: 기본 `true` (실행 검증)
- `PUSH`: 기본 `false` (푸시 안 함)
- `PUSH_CACHE_TAG`: 기본 `true` (`PUSH=true`일 때만 `CACHE_TAG`까지 푸시)
- `PULL_CACHE`: 기본 `true` (빌드 전 `CACHE_TAG` pull 시도)
- `CLEANUP`: 기본 `true` (임시 산출물/오래된 로그 정리)
- `PRUNE_DANGLING_IMAGES`: 기본 `true` (dangling 정리 + `latest/buildcache` 유지)

## 🔄 워크플로우

### 전체 패키지 릴리즈 워크플로우

```bash
# 1. 패키지 버전 업데이트 및 빌드
pnpm version:patch  # 또는 minor, major

# 2. 빌드
pnpm build:packages

# 3. 배포
pnpm publish:packages

# 4. Apps 의존성 업데이트 (대화형)
pnpm update:app-deps
```

### 단일 패키지 릴리즈 워크플로우 (권장 ⭐)

```bash
# 한 줄로 모든 과정 수행 (대화형 모드 포함)
pnpm release:pkg @cocrepo/db patch
```

## 📋 Workspace 프로토콜 이해

### `workspace:^` 프로토콜의 장점

1. **버전 범위 관리**
   - `workspace:^0.3.0` - 0.3.x 버전 자동 업데이트
   - 0.4.0 이상은 수동 업데이트 필요 (breaking change 방지)

2. **Turbo 호환성**
   - Turbo prune이 workspace 의존성으로 인식
   - Docker 빌드 시 필요한 패키지 자동 포함

3. **유연한 배포**
   - 각 앱이 필요한 버전 범위 독립 관리
   - 불필요한 앱 업데이트 방지

### 버전 업데이트 예시

**시나리오 1: 패치 버전 업데이트 (0.3.6 → 0.3.7)**

```bash
pnpm release:pkg @cocrepo/db patch
```

- Apps: `workspace:^0.3.0` 유지 (업데이트 불필요)
- 자동으로 0.3.7 사용

**시나리오 2: 마이너 버전 업데이트 (0.3.7 → 0.4.0)**

```bash
pnpm release:pkg @cocrepo/db minor
```

- Apps 대화형 선택:
  - `admin`: 업데이트 (y) → `workspace:^0.4.0`
  - `server`: 건너뜀 (n) → `workspace:^0.3.0` 유지
  - `storybook`: 업데이트 (y) → `workspace:^0.4.0`

**시나리오 3: 메이저 버전 업데이트 (0.4.2 → 1.0.0)**

```bash
pnpm release:pkg @cocrepo/db major
```

- Apps 대화형 선택 (각각 개별 판단)
- Breaking changes 있으므로 신중한 업데이트

## 🚀 배포 체크리스트

### 배포 전

- [ ] 모든 테스트 통과 (`pnpm test`)
- [ ] 린트 통과 (`pnpm lint`)
- [ ] 타입 체크 통과 (`pnpm type-check`)
- [ ] 변경사항 문서화 (CHANGELOG.md)

### 배포 중

- [ ] 올바른 버전 타입 선택 (patch/minor/major)
- [ ] 번들 사이즈 확인
- [ ] 배포 성공 확인

### 배포 후

- [ ] Apps 의존성 업데이트 (대화형 선택)
- [ ] 업데이트된 앱 테스트
- [ ] Git 커밋 및 푸시
- [ ] 릴리즈 노트 작성

## 💡 팁

### 드라이런으로 먼저 테스트

```bash
pnpm release:pkg @cocrepo/db patch --dry-run
```

### 특정 앱만 업데이트

```bash
# release-pkg.js에서 자동 실행되지 않고 수동 실행
node scripts/update-app-deps.js server
```

### 버전 확인

```bash
pnpm bundle:sizes
```

## ⚠️ 주의사항

1. **Breaking Changes**
   - 메이저 버전 업데이트 시 모든 앱 테스트 필수
   - 의존하는 앱들과 호환성 확인

2. **Workspace 프로토콜**
   - 항상 `workspace:^` 형식 유지
   - 직접 버전 번호 입력 금지

3. **배포 순서**
   - 의존성이 있는 패키지는 순서대로 배포
   - 예: toolkit → schema 순서

4. **Git 커밋**
   - 배포 후 변경된 package.json 반드시 커밋
   - 버전 태그 생성 권장

## 🔧 문제 해결

### "Could not find package" 에러

- `workspace:^` 프로토콜 확인
- `pnpm install` 재실행

### 번들 사이즈 급증

- 불필요한 의존성 확인
- Tree-shaking 설정 확인

### 배포 실패

- npm 로그인 상태 확인
- 패키지 권한 확인
- 네트워크 연결 확인

## Git worktree + tmux automation (`wt.js`)

`wt.js`는 `git worktree + tmux` 병렬 작업을 표준화하는 스크립트입니다.

### Commands

```bash
pnpm wt:init                   # create .wt/config.json when missing
pnpm wt:new CORE-123           # create branch + worktree + env + tmux
pnpm wt:new-run CORE-123
                               # create worktree, run Codex, then auto-create PR
pnpm wt:go CORE-123            # attach tmux session or print cd path
pnpm wt:list                   # show worktree registry/status table
pnpm wt:plan-merge CORE-123    # analyze branch outputs and recommend merge strategy
pnpm wt:pr CORE-123            # push branch + create/reuse PR
pnpm wt:merge CORE-123         # merge PR with selected/recommended strategy
pnpm wt:finish CORE-123        # rebase/push/PR/merge/cleanup in one flow
pnpm wt:rm CORE-123            # remove worktree and delete local branch
pnpm wt:rm CORE-123 --keep-branch
pnpm wt:rm CORE-123 --force    # force remove dirty worktree / unmerged branch
```

### Notes

- Runtime registry is stored under the git common dir: `<git-common-dir>/wt-tool/registry.json`.
- Default config path is `.wt/config.json`. Override with `--config <path>`.
- `plan-merge`, `pr`, `merge`, `finish` commands require `gh` (GitHub CLI).
- `new` writes an env file with per-slot port offsets (`offsetStep * slot`).
- If tmux is enabled and available, `new` creates a session and configured windows.
- `new-run` requires both `tmux` and `codex` command availability.
- `new-run` asks for a prompt interactively if `--prompt` is omitted.
- `new-run` queues `pnpm wt:pr <ticket>` by default after Codex succeeds (`--no-pr` to skip).
- `scripts/start.sh` auto-loads `.env.worktree` when present, and app `start:dev` scripts consume the generated `*_PORT` values.
- `rm` is safe by default (`git worktree remove`, `git branch -d`). Use `--force` only when needed.
- `directoryNameTemplate` supports `{{repo}}`, `{{ticket}}`, `{{branch}}`, `{{slot}}`.

### Detailed guide

- Full usage and workflow: [`scripts/wt-guide.md`](./wt-guide.md)
