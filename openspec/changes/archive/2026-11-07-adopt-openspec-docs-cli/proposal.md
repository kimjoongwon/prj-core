# Proposal

## Why

여러 owner가 함께 변경하는 작업에서 요구사항·설계·검증 조건을 한 변경 단위로 남길 수 있는 공통 문서 경로가 필요하다. 사용자의 문서·CLI 방식 도입 결정에 따라 기존 에이전트 계약을 유지하면서 OpenSpec을 선택적으로 사용할 수 있게 한다.

## What Changes

- OpenSpec `1.16.1`을 정확한 버전의 로컬 devDependency로 추가하고 `pnpm openspec`, `pnpm openspec:check`를 제공한다.
- 도구 연동을 생략하고 한글 작성 설정과 기존 canonical owner 참조를 담은 `openspec/config.yaml`을 추가한다.
- `openspec/README.md`에 변경 생성·작성·검증·기존 owner 구현·보관·PR 리뷰 흐름을 안내하고 루트 개발 가이드에서 연결한다.
- 이번 CLI·문서 사용 기능의 요구사항을 첫 change로 기록하고 검증 후 현재 명세와 보관 기록을 함께 남긴다.

## Capabilities

### New Capabilities

- `openspec-cli-workflow`: 기존 owner 계약을 보존하는 로컬 OpenSpec CLI 실행, 변경 명세 작성·검증·보관과 사용 안내.

### Modified Capabilities

없음. 기존 제품과 과거 설계 문서의 일괄 명세화는 이번 범위에 포함하지 않는다.

## Impact

- 변경 경로: 루트 `package.json`, `pnpm-lock.yaml`, `README.md`, 신규 `openspec/**`.
- 요구사항 근거: 사용자의 문서·CLI 도입 및 기존 에이전트 계약 유지 결정. 별도 승인 설계 문서는 없다.
- 관련 canonical owner: `AGENTS.md`, `.codex/agents/*.toml`, 관련 package owner 문서. 이 문서에 역할 지시문을 복제하지 않는다.
- 기존 agent 정의·생성본·생성기·검사·Hook과 앱 코드의 동작은 그대로 유지한다. PR 생성·병합·운영 배포는 이번 도입의 완료 범위 밖이다.
