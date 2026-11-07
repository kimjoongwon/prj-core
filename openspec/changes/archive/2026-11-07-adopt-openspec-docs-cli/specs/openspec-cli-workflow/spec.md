# Spec Delta

## Purpose

개발자가 기존 owner 계약을 유지하면서 변경별 요구사항·설계·작업·검증 조건을 문서로 남기고, 저장소에 고정된 로컬 CLI로 그 명세를 조회·검증·보관할 수 있게 한다.

## ADDED Requirements

### Requirement: 재현 가능한 로컬 CLI 실행

저장소는 의존성 설치 후 `pnpm openspec <args>`로 잠금 파일의 로컬 CLI를 실행할 수 있어야 하며(SHALL), 이 진입점의 자동 telemetry·completion 설정 쓰기로 사용자 전역 설정을 변경하지 않아야 한다(MUST).

#### Scenario: 새 worktree에서 CLI 실행

- **WHEN** 개발자가 저장소 루트에서 frozen 의존성 설치 후 `pnpm openspec --version`을 실행한다.
- **THEN** 잠금 파일에 고정한 OpenSpec 버전이 출력된다.

#### Scenario: 도구 연동을 생략한 초기화

- **WHEN** 개발자가 새 OpenSpec 구조에 `pnpm openspec init --tools none --language '한국어 (ko-KR)' --no-animation`을 실행한다.
- **THEN** `openspec/` 구조와 설정이 생성되며 도구별 skills·commands·prompts와 기존 agent 계약 변경은 생성되지 않는다.

### Requirement: 한글 작성 지침과 기존 owner 안내 조회

저장소는 루트 개발 가이드에서 OpenSpec 사용 안내로 이동할 수 있어야 하며(SHALL), CLI의 artifact 지침에 한글 설명문 작성과 고정 구조 유지 및 기존 canonical owner 문서 참조를 제공해야 한다(SHALL).

#### Scenario: 변경 작성 지침 조회

- **WHEN** 개발자가 새 change의 `instructions proposal` 또는 `instructions specs`를 조회한다.
- **THEN** 한글 작성 설정과 해당 artifact 규칙이 표시되고 `AGENTS.md`, `.codex/agents/*.toml`, package owner 문서의 계약을 참조하도록 안내된다.

#### Scenario: 사용 흐름 확인

- **WHEN** 개발자가 루트 README의 OpenSpec 링크를 연다.
- **THEN** 변경 생성·지침 조회·문서 작성·검증·기존 owner 구현·보관·동일 PR 리뷰 흐름과 CLI 및 AI slash command의 차이를 확인할 수 있다.

### Requirement: 전체 명세 strict 검증

저장소는 `pnpm openspec:check`로 현재 명세와 활성 change 전체를 strict 모드에서 대화형 입력 없이 검사해야 하며(SHALL), 명세 구조 오류를 종료 코드로 알릴 수 있어야 한다(MUST).

#### Scenario: 유효한 명세 검증

- **WHEN** 현재 명세와 활성 change가 유효한 상태에서 `pnpm openspec:check`를 실행한다.
- **THEN** 입력 프롬프트 없이 검사하고 종료 코드 0을 반환한다.

#### Scenario: 시나리오가 없는 요구사항 검증

- **WHEN** 활성 change에 시나리오가 없는 ADDED requirement가 있고 `pnpm openspec:check`를 실행한다.
- **THEN** 해당 구조 오류를 보고하고 0이 아닌 종료 코드를 반환한다.

### Requirement: 완료한 변경의 명세 병합과 보관

개발자는 완료한 change를 로컬 CLI로 보관하면서 delta를 현재 명세에 반영하고 변경 기록을 유지할 수 있어야 한다(SHALL). 보관 상태는 운영 배포 상태와 별도로 안내되어야 한다(MUST).

#### Scenario: 검증한 첫 변경 보관

- **WHEN** 개발자가 구현·테스트·명세 검증을 완료한 change에 `pnpm openspec archive <change-name> --yes`를 실행한다.
- **THEN** delta가 `openspec/specs/`의 현재 명세에 반영되고 change는 `openspec/changes/archive/` 아래 날짜가 붙은 디렉터리로 이동하며 이후 `pnpm openspec:check`가 통과한다.
