# prj-core Agent Index

이 문서는 `목차` 역할만 합니다. 상세 규칙을 여기 복붙하지 않습니다.

우선순위:

1. `.codex/config.toml`
2. `.codex/agents/*.toml`
3. 패키지별 `docs/*.md`
4. 이 `AGENTS.md`

이미 `.codex/config.toml` 또는 `.codex/agents/`에 있는 내용은 그 파일이 원문이며, 여기에는 링크만 둡니다.

## 기본 참조

- 전역 규칙 / agent registry: [.codex/config.toml](.codex/config.toml)
- config 설명: [.codex/config.toml.spec.md](.codex/config.toml.spec.md)
- agent 역할군 인덱스: [.codex/agents/README.md](.codex/agents/README.md)
- agent 정의 모음: [.codex/agents/](.codex/agents)
- agent spec / template: [.codex/templates/](.codex/templates)

## 저장소 개요

### 기술 스택

- 프론트엔드: Next.js App Router, MobX, HeroUI, Tailwind CSS, Orval, React Query
- 백엔드: NestJS, Prisma, PostgreSQL, Redis
- 공통: pnpm workspace, Turborepo, Node.js

### 주요 경로

- 앱: `apps/`
- 공용 패키지: `packages/`
- Prisma 스키마/클라이언트: `packages/be-prisma/`
- Codex 설정: `.codex/`

## 작업 분류별 참조

### 기획 / 오케스트레이션

- 요구사항 총괄: [.codex/agents/orch-requirement.toml](.codex/agents/orch-requirement.toml)
- 화면 기획 총괄: [.codex/agents/orch-screen-planner.toml](.codex/agents/orch-screen-planner.toml)
- 단계형 진행 플로우: [.codex/agents/orch-stage.toml](.codex/agents/orch-stage.toml)

### 프론트엔드

- 페이지 구현: [.codex/agents/fe-page-builder.toml](.codex/agents/fe-page-builder.toml)
- 레이아웃 구현: [.codex/agents/fe-layout-builder.toml](.codex/agents/fe-layout-builder.toml)
- 기능/위젯/UI 구현: [.codex/agents/fe-feature-builder.toml](.codex/agents/fe-feature-builder.toml), [.codex/agents/fe-widget-builder.toml](.codex/agents/fe-widget-builder.toml), [.codex/agents/fe-primitive-component-builder.toml](.codex/agents/fe-primitive-component-builder.toml)
- 입력 컴포넌트: [.codex/agents/fe-input-component-builder.toml](.codex/agents/fe-input-component-builder.toml)
- 스토어: [.codex/agents/fe-store-builder.toml](.codex/agents/fe-store-builder.toml)
- Surface ownership: [.codex/agents/req-surface-planner.toml](.codex/agents/req-surface-planner.toml)
- 프론트엔드 테스트: [.codex/agents/qa-fe-testing.toml](.codex/agents/qa-fe-testing.toml), [.codex/agents/qa-fe-e2e-testing.toml](.codex/agents/qa-fe-e2e-testing.toml)

### 백엔드

- Prisma / DB 설계: [.codex/agents/be-prisma-builder.toml](.codex/agents/be-prisma-builder.toml), [.codex/agents/be-database-expert.toml](.codex/agents/be-database-expert.toml)
- Prisma 주석 / 스키마 보조: [.codex/agents/be-prisma-annotator.toml](.codex/agents/be-prisma-annotator.toml)
- Repository / Service / App / Facade: [.codex/agents/be-repository-builder.toml](.codex/agents/be-repository-builder.toml), [.codex/agents/be-service-builder.toml](.codex/agents/be-service-builder.toml), [.codex/agents/be-app-builder.toml](.codex/agents/be-app-builder.toml), [.codex/agents/be-facade-builder.toml](.codex/agents/be-facade-builder.toml)
- Controller / Module / DTO: [.codex/agents/be-controller-builder.toml](.codex/agents/be-controller-builder.toml), [.codex/agents/be-module-builder.toml](.codex/agents/be-module-builder.toml), [.codex/agents/be-dto-builder.toml](.codex/agents/be-dto-builder.toml)
- 백엔드 테스트: [.codex/agents/qa-be-testing.toml](.codex/agents/qa-be-testing.toml), [.codex/agents/qa-be-e2e-testing.toml](.codex/agents/qa-be-e2e-testing.toml)

### 개발 / 운영 보조

- 서비스 시작: [.codex/agents/dev-service-starter.toml](.codex/agents/dev-service-starter.toml)
- Jenkinsfile: [.codex/agents/etc-jenkinsfile-builder.toml](.codex/agents/etc-jenkinsfile-builder.toml)
- bootstrap 통합: [.codex/agents/be-bootstrap-integrator.toml](.codex/agents/be-bootstrap-integrator.toml)

## Prisma / DB 문서 인덱스

- 스키마 파일 배치: [packages/be-prisma/docs/schema-file-conventions.md](packages/be-prisma/docs/schema-file-conventions.md)
- seed / reference / bootstrap 운영 원칙: [packages/be-prisma/docs/seed-data-governance.md](packages/be-prisma/docs/seed-data-governance.md)
- 필드 추가 / backfill / reference-data 변경 플레이북: [packages/be-prisma/docs/schema-change-playbook.md](packages/be-prisma/docs/schema-change-playbook.md)

Prisma 변경 작업 전 최소 확인:

1. 일반 운영 데이터 필드인가
2. reference data 필드인가
3. bootstrap 전용 데이터 필드인가

운영 반영 기본 순서:

1. `prisma migrate deploy`
2. 필요 시 `db:data:migrate`
3. app rollout

## 관리 원칙

- 새 규칙이 `.codex/config.toml`에 들어갈 수 있으면 먼저 거기에 둡니다.
- 특정 역할 전용 규칙이면 `.codex/agents/*.toml`에 둡니다.
- agent 목록과 역할군 요약은 `.codex/agents/README.md`에 둡니다.
- 패키지/도메인 전용 절차면 해당 패키지 `docs/*.md`에 둡니다.
- `AGENTS.md`에는 요약, 링크, 진입점만 둡니다.
