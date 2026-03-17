# Codex Agent Index

이 문서는 `.codex/agents/*.toml`의 역할군 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../config.toml)
2. 각 `*.toml`
3. 각 `*.toml.spec.md`가 있으면 그 보조 문서
4. 이 인덱스

설명 문구는 기본적으로 `.codex/config.toml`의 agent description을 기준으로 정리합니다.

## 오케스트레이션

- [orch-requirement.toml](./orch-requirement.toml): 도메인 기획(L0-L4) + BE/Store 기획을 총괄 조율하는 오케스트레이터
- [orch-screen-planner.toml](./orch-screen-planner.toml): 단일 화면 기획(L5-L12)을 조율하는 오케스트레이터
- [orch-stage.toml](./orch-stage.toml): 7단계 분할 개발 플로우를 조율하는 메타 에이전트

## 요구사항 / 기획

- [req-context-planner.toml](./req-context-planner.toml): 시스템 컨텍스트, 사용자(Actor), 사용자 목표(Goal) 레이어를 기획하는 전문가
- [req-screen-planner.toml](./req-screen-planner.toml): 기능(Feature)과 화면(Screen) 레이어를 기획하는 전문가
- [req-page-planner.toml](./req-page-planner.toml): 페이지 통합 관점에서 `page.spec.md`를 상세 기획하는 전문가
- [req-layout-planner.toml](./req-layout-planner.toml): 페이지/섹션 Layout sidecar spec을 기획하는 전문가
- [req-surface-planner.toml](./req-surface-planner.toml): 페이지/feature/layout의 Surface ownership과 elevation 배치를 기획하는 전문가
- [req-feature-planner.toml](./req-feature-planner.toml): 화면별 Feature 컴포넌트를 기획하는 전문가
- [req-widget-planner.toml](./req-widget-planner.toml): 화면별 Widget 컴포넌트를 기획하는 전문가
- [req-primitive-planner.toml](./req-primitive-planner.toml): 화면별 Pure UI 컴포넌트를 기획하는 전문가
- [req-cell-planner.toml](./req-cell-planner.toml): DataGrid/Table Cell sidecar spec을 기획하는 전문가
- [req-input-planner.toml](./req-input-planner.toml): 입력 컴포넌트(Inputs) sidecar spec을 기획하는 전문가
- [req-menu-planner.toml](./req-menu-planner.toml): 메뉴 경로/권한 sidecar spec을 기획하는 전문가
- [req-store-planner.toml](./req-store-planner.toml): 도메인별 MobX Store를 기획하는 전문가
- [req-entity-planner.toml](./req-entity-planner.toml): 도메인별 Entity를 기획하는 전문가
- [req-api-planner.toml](./req-api-planner.toml): aggregate root 기준 API와 Action 계약을 기획하는 전문가
- [req-api-integration-planner.toml](./req-api-integration-planner.toml): Orval 기반 API 연동 sidecar spec을 기획하는 전문가
- [req-app-planner.toml](./req-app-planner.toml): Controller workflow가 호출할 ApplicationService 유즈케이스를 기획하는 전문가
- [req-logic-planner.toml](./req-logic-planner.toml): 비즈니스 로직과 테스트 레이어를 기획하는 전문가
- [req-be-test-planner.toml](./req-be-test-planner.toml): 백엔드 테스트 케이스를 기획하는 전문가
- [req-fe-test-planner.toml](./req-fe-test-planner.toml): 프론트엔드 테스트 케이스를 기획하는 전문가
- [req-spec-tracker.toml](./req-spec-tracker.toml): 도메인별 spec-checklist를 생성/갱신하여 기획-구현-검증 상태를 추적하는 전문가
- [req-reverse-engineer.toml](./req-reverse-engineer.toml): 기존 코드를 분석하여 코드 옆 `.spec.md` 기획서를 역으로 생성하는 전문가

## 백엔드 / Prisma

- [be-database-expert.toml](./be-database-expert.toml): PostgreSQL/Prisma 데이터베이스 설계 및 최적화 전문가
- [be-prisma-builder.toml](./be-prisma-builder.toml): Prisma 스키마를 생성하고 유형을 분류하는 전문가
- [be-prisma-annotator.toml](./be-prisma-annotator.toml): Prisma 스키마에 `@displayName` 한글 주석을 추가하는 전문가
- [be-dmmf-parser-builder.toml](./be-dmmf-parser-builder.toml): Prisma DMMF 파싱 유틸리티를 생성하는 전문가
- [be-repository-builder.toml](./be-repository-builder.toml): Prisma 기반 Repository 레이어를 생성하는 전문가
- [be-service-builder.toml](./be-service-builder.toml): NestJS Service 레이어를 생성하는 전문가
- [be-app-builder.toml](./be-app-builder.toml): workflow orchestration용 NestJS ApplicationService 레이어를 생성하는 전문가
- [be-facade-builder.toml](./be-facade-builder.toml): Controller boundary composition과 read model shaping을 위한 NestJS Facade 레이어를 생성하는 전문가
- [be-integration-builder.toml](./be-integration-builder.toml): 외부 시스템 Integration Facade 레이어를 생성하는 전문가
- [be-controller-builder.toml](./be-controller-builder.toml): aggregate root Module과 `@cocrepo/facade`/`@cocrepo/app` 기준 NestJS REST Controller를 생성하는 전문가
- [be-module-builder.toml](./be-module-builder.toml): aggregate root 기준 NestJS Module과 Router wiring을 생성하는 전문가
- [be-dto-builder.toml](./be-dto-builder.toml): Request/Response DTO 클래스를 생성하는 전문가
- [be-query-dto-builder.toml](./be-query-dto-builder.toml): PrismaQueryDto 기반 목록 조회용 Query DTO를 생성하는 전문가
- [be-entity-builder.toml](./be-entity-builder.toml): 도메인 Entity 클래스를 생성하는 전문가
- [be-vo-builder.toml](./be-vo-builder.toml): Value Object 클래스를 생성하는 전문가
- [be-seed-maker.toml](./be-seed-maker.toml): 현실 세계와 연결된 시드 데이터를 생성하는 전문가
- [be-bootstrap-integrator.toml](./be-bootstrap-integrator.toml): AppModule 부트스트랩에 서비스를 통합하는 전문가
- [be-e2e-builder.toml](./be-e2e-builder.toml): 백엔드 E2E 테스트 전략을 설계하는 전문가
- [be-unit-test-builder.toml](./be-unit-test-builder.toml): 백엔드 단위 테스트 전략을 설계하는 전문가

## 프론트엔드

- [fe-page-builder.toml](./fe-page-builder.toml): Pure UI 페이지 컴포넌트를 생성하는 전문가
- [fe-layout-builder.toml](./fe-layout-builder.toml): Layout 컴포넌트를 설계하고 생성하는 전문가
- [fe-feature-builder.toml](./fe-feature-builder.toml): 비즈니스 기능을 담당하는 Feature 컴포넌트를 생성하는 전문가
- [fe-widget-builder.toml](./fe-widget-builder.toml): 재사용 가능한 작은 UI 조각 Widget 컴포넌트를 생성하는 전문가
- [fe-primitive-component-builder.toml](./fe-primitive-component-builder.toml): Pure UI 컴포넌트를 `packages/fe-ui/src/primitive`에 생성하는 전문가
- [fe-input-component-builder.toml](./fe-input-component-builder.toml): 폼 입력 컴포넌트를 `packages/fe-ui/src/input`에 생성하는 전문가
- [fe-cell-builder.toml](./fe-cell-builder.toml): DataGrid/Table용 Cell 컴포넌트를 계층별로 생성하는 전문가
- [fe-menu-builder.toml](./fe-menu-builder.toml): 메뉴 시스템 컴포넌트를 생성하는 전문가
- [fe-store-builder.toml](./fe-store-builder.toml): MobX 기반 Store를 생성하는 전문가
- [fe-api-integrator.toml](./fe-api-integrator.toml): Orval 생성 React Query 훅을 사용하여 더미 데이터를 실제 API 호출로 교체하는 전문가
- [fe-e2e-builder.toml](./fe-e2e-builder.toml): 프론트엔드 E2E 테스트 전략을 설계하는 전문가
- [fe-unit-test-builder.toml](./fe-unit-test-builder.toml): 프론트엔드 단위 테스트 전략을 설계하는 전문가

## QA / 검증

- [qa-type-checker.toml](./qa-type-checker.toml): TypeScript 타입 에러를 근본 원인까지 추적하여 해결하는 전문가
- [qa-fe-testing.toml](./qa-fe-testing.toml): Vitest 기반 프론트엔드 패키지 테스트 코드를 작성하는 전문가
- [qa-fe-e2e-testing.toml](./qa-fe-e2e-testing.toml): Playwright 기반 프론트엔드 E2E 테스트 코드를 작성하는 전문가
- [qa-be-testing.toml](./qa-be-testing.toml): Jest 기반 백엔드 및 공용 패키지 테스트 코드를 작성하는 전문가
- [qa-be-e2e-testing.toml](./qa-be-e2e-testing.toml): Jest + Supertest 기반 백엔드 E2E 테스트 코드를 작성하는 전문가

## 공용 / 운영 보조

- [common-schema-builder.toml](./common-schema-builder.toml): 프론트엔드와 백엔드에서 공유하는 검증 스키마를 생성하는 전문가
- [dev-service-starter.toml](./dev-service-starter.toml): 개발 서비스를 시작하는 에이전트
- [etc-jenkinsfile-builder.toml](./etc-jenkinsfile-builder.toml): Jenkins CI/CD 파이프라인 파일을 생성하는 전문가

## 보조 문서가 있는 agent

아래 agent는 별도 `*.spec.md`가 있습니다.

- [be-prisma-builder.toml.spec.md](./be-prisma-builder.toml.spec.md)
- [be-repository-builder.toml.spec.md](./be-repository-builder.toml.spec.md)
- [fe-layout-builder.toml.spec.md](./fe-layout-builder.toml.spec.md)
- [fe-menu-builder.toml.spec.md](./fe-menu-builder.toml.spec.md)
- [fe-page-builder.toml.spec.md](./fe-page-builder.toml.spec.md)
- [fe-primitive-component-builder.toml.spec.md](./fe-primitive-component-builder.toml.spec.md)
- [orch-screen-planner.toml.spec.md](./orch-screen-planner.toml.spec.md)
- [orch-stage.toml.spec.md](./orch-stage.toml.spec.md)
- [req-layout-planner.toml.spec.md](./req-layout-planner.toml.spec.md)
- [req-page-planner.toml.spec.md](./req-page-planner.toml.spec.md)
- [req-primitive-planner.toml.spec.md](./req-primitive-planner.toml.spec.md)
- [req-surface-planner.toml.spec.md](./req-surface-planner.toml.spec.md)
