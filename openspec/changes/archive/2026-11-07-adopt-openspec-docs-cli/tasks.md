# Tasks

## 1. CLI·설정·사용 안내

- [x] 1.1 로컬 OpenSpec 의존성과 루트 명령을 추가하고 `pnpm openspec --version`, 전체 workspace frozen 정합성 및 루트 frozen 설치로 확인한다.
- [x] 1.2 `init --tools none`으로 초기화하고 한글 설정과 owner 참조를 `instructions proposal/specs` 및 `status --json`으로 확인한다.
- [x] 1.3 `openspec/README.md`와 루트 개발 가이드 링크를 작성하고 파일 링크·명령·도구 연동 생략 경로를 확인한다.

## 2. 첫 변경과 기존 계약 검증

- [x] 2.1 실제 CLI로 첫 change를 생성하고 proposal·specs·design·tasks를 작성한 뒤 `list`, `show`, `status`, `instructions`로 조회를 확인한다.
- [x] 2.2 `pnpm openspec:check`와 개별 strict 검증의 성공을 확인하고 시나리오를 잠시 제거한 명세에서 같은 명령이 실패하는지 확인한 후 원본을 복원한다.
- [x] 2.3 `agents:sync:check`, `agents:contracts:check`, 변경 파일 형식과 `git diff --check`를 확인하고 기존 agent 계약·도구 연동 경로가 무변경인지 검증한다.

## 검증 기록

- 실행 환경: Node.js `v24.22.1`, pnpm `10.34.5`, OpenSpec `1.16.1`.
- 설치: `pnpm install --frozen-lockfile --lockfile-only --ignore-scripts`로 전체 42개 workspace 정합성을 확인하고 `pnpm install --filter . --frozen-lockfile --ignore-scripts`로 로컬 CLI 설치를 확인했다. 기존 잠금 graph와 importer는 보존했다.
- CLI: 실제 `init --tools none`, `new change`, `list`, `show`, `templates`, artifact별 `instructions`, `instructions archive`, `status` 조회를 확인했다. 초기 명세가 없는 상태의 전체 strict 검증도 종료 코드 0이었다.
- 명세: 개별 strict 검증과 `pnpm openspec:check`가 통과했다. 실제 delta의 scenario block을 잠시 제거하자 종료 코드 1과 누락 오류가 나왔고 원본 복원 뒤 통과했다.
- 기존 계약: `pnpm agents:sync:check`, `pnpm agents:contracts:check`가 35개 정의에 대해 통과했다. 기존 script·agent 계약 파일은 무변경이며 `.agents`는 생성되지 않았다.
- 형식: `package.json` Biome 포맷, YAML 파싱, 새 Markdown의 코드 블록·상대 링크·줄 끝 형식과 `git diff --check`를 확인했다.

## Workflow follow-up

- 완료: `pnpm openspec archive adopt-openspec-docs-cli --yes`가 현재 명세의 요구사항 4개를 생성하고 `2026-11-07-adopt-openspec-docs-cli`에 완료 기록을 보관했다.
- 완료: 보관 뒤 `pnpm openspec:check`와 `pnpm openspec validate --archived --strict --no-interactive`가 각각 1개 항목에 대해 통과했다. 현재 명세와 보관 기록을 같은 PR 리뷰 대상으로 전달한다. PR 생성·병합·운영 배포는 수행하지 않았다.
