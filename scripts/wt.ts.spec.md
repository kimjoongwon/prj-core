# wt.ts Sidecar Spec

## 목적

- worktree 흐름의 사용자 진입점을 TypeScript CLI로 제공합니다.
- `pnpm wt`를 TTY에서 실행하면 상황형 메뉴를 띄웁니다.
- 실제 git worktree 작업은 기존 `scripts/wt.js` core에 위임합니다.
- linked worktree 내부에서 실행해도 메인 저장소의 공용 `.wt/config.json`을 찾습니다.

## 인터랙션 계약

- `pnpm wt`를 TTY에서 실행하면 저장소/설정 요약과 함께 상황형 작업 메뉴를 보여줍니다.
- 메뉴와 프롬프트는 한국어를 기본으로 사용합니다.
- 주요 흐름은 아래 순서로 바로 고를 수 있어야 합니다.
  - worktree 설정 초기화
  - 새 worktree 시작
  - 새 worktree 시작 후 Codex 작업 연결
  - 기존 worktree로 이동
  - 등록된 worktree 보기
  - PR 만들기 또는 재사용
  - 병합 전략 추천 받기
  - worktree 마무리 및 병합
  - 등록된 worktree 정리
  - 원시 명령 도움말 보기
- 기존 worktree 대상 명령은 registry 항목 선택을 우선하고, 필요하면 수동 입력으로 fallback 합니다.
- 인터랙티브 프롬프트는 실행에 필요한 최소 인자만 수집한 뒤 core CLI로 넘깁니다.
- 예/아니오 질문은 빈 입력 시 기본값을 사용하고, `예/아니오`, `네/아니요`, `y/n`, `ㅇ/ㄴ` 입력을 모두 허용합니다.

## 위임 규칙

- `pnpm wt:new AUTH-21` 같은 명시적 하위 명령은 메뉴를 건너뛰고 바로 `wt.js`로 전달합니다.
- 호출자가 이미 `--config`를 넘기지 않았다면 wrapper가 `--config <shared-config-path>`를 자동 추가합니다.
- 비대화식 `pnpm wt` 실행은 프롬프트를 띄우지 않고 `help`로 fallback 합니다.

## 공용 저장소 해석

- 현재 cwd에서 `git rev-parse --show-toplevel`로 현재 저장소 루트를 구합니다.
- `git rev-parse --git-common-dir` 결과를 바탕으로 공용 git 디렉터리를 해석합니다.
- `<shared-repo-root>/.wt/config.json`을 기본 설정 경로로 사용합니다.

## 변경 이력

| Date       | Change                                                                                     | Author |
| ---------- | ------------------------------------------------------------------------------------------ | ------ |
| 2026-04-22 | `pnpm wt` 메뉴와 프롬프트를 한국어 중심 UX로 바꾸고 예/아니오 입력을 확장함              | codex  |
| 2026-04-22 | Add TypeScript wrapper entrypoint with contextual `pnpm wt` menu and shared config lookup | codex  |
