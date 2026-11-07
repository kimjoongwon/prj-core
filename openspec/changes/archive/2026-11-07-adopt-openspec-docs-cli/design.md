# Design

## Context

도입 목적과 범위는 [proposal.md](./proposal.md)를 따른다. 이 모노레포는 pnpm 루트 script와 잠금 파일을 사용하며 기존 agent 정의·생성본·검사 계약을 유지해야 한다. 새 기능의 외부 계약은 [openspec-cli-workflow 명세](./specs/openspec-cli-workflow/spec.md)에 둔다.

## Goals / Non-Goals

**Goals:** 로컬 CLI 실행을 재현하고 기존 owner의 구현 절차에 변경 문서를 연결한다. 기본 `spec-driven` schema를 사용해 별도 renderer·wrapper·조율 도구 없이 동작하게 한다.

**Non-Goals:** 에이전트 지시문·Hook·자동 DAG 변경, 전역 도구 설정, 기존 제품 전체의 역명세화와 운영 배포는 수행하지 않는다.

## Decisions

1. **루트의 정확한 버전 의존성**: `@fission-ai/openspec@1.16.1`을 devDependency에 고정한다. 전역 설치나 `latest` 호출 대신 저장소의 Node.js 요구와 잠금 파일로 재현한다. 기존 잠금 graph는 보존하고 OpenSpec 시작 snapshot에서 필요한 새 의존성만 추가한다.
2. **문서·CLI 경로**: 공식 `init --tools none --language '한국어 (ko-KR)'`로 초기화한다. 기본 Codex 연동은 `.agents/skills`를 만들며 현재 agent 계약 검사가 `.agents`를 금지하므로 도구 연동을 켜지 않는다. `init`의 일반적인 slash command 안내는 사용 안내에서 CLI와 구분한다.
3. **단일 CLI 진입점**: `openspec` script에서 telemetry와 completion 알림을 환경변수로 끄고 `openspec:check`가 이를 소비한다. CLI의 기본 telemetry·첫 실행 알림이 사용자 전역 설정에 상태를 기록할 수 있으므로 전역 설정 파일을 편집하지 않고 실행별로 억제한다. 기존 계약 검사가 `spec:*` script를 제거 대상으로 지정하므로 검증 이름도 `openspec:*`를 사용한다. 기존 `lint`, `test`, `type-check`와 자동 생성·검사 흐름은 바꾸지 않는다.
4. **기존 canonical owner 참조**: 설정에는 한글 작성과 기존 문서 경로만 간결히 담는다. 이 사용법의 owner는 `openspec/README.md`이며 역할 지시문과 패키지 계약을 복제하지 않는다. schema를 fork하거나 새로운 에이전트 동작 계약을 추가하지 않는다.
5. **첫 change의 실제 수명주기**: 이번 CLI·문서 기능만 명세화하고 `instructions`, `status`, `show`, strict 검증을 수행한 뒤 `archive --yes`로 현재 명세를 생성한다. 별도 slash `sync` 없이 CLI archive의 병합을 사용하고, 보관 기록과 현재 명세를 같은 PR 리뷰 대상으로 남긴다.

## Risks / Trade-offs

- [구조 검증은 구현 정확성 전체를 증명하지 않음] → 기존 owner가 관련 테스트를 수행하고 실제 결과를 tasks에 기록한다.
- [명세 내용·단계가 존재한다는 사실을 배포 완료로 오인할 수 있음] → 사용 안내에 기존 PR 승인·배포 런북과 운영 확인의 별도 책임을 연결한다.
- [기본 tool 연동이나 전역 CLI 설정을 뒤에 추가하면 기존 계약과 충돌할 수 있음] → 버전 관리된 config를 재사용하고 CLI 갱신에서도 문서·CLI 경로의 검증을 반복한다.

## Migration Plan

의존성 설치 후 루트 명령으로 바로 사용한다. 이번 change의 검증을 완료하면 현재 명세와 완료 기록을 함께 보관한다. 되돌릴 때는 이번 도입의 루트 의존성·script·안내 링크와 `openspec/`를 함께 제거한다. 데이터베이스 마이그레이션이나 런타임 배포는 없다.
