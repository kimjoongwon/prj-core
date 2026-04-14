# Codex Agent Index

이 문서는 `.codex/agents/**/*.toml`의 역할군 인덱스입니다.

원문 우선순위:

1. [.codex/config.toml](../config.toml)
2. 각 `**/*.toml`
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
- [req-page-planner.toml](./req-page-planner.toml): route layout contract를 소비하는 `page.spec.md`와 `@slot` 콘텐츠 spec을 상세 기획하는 전문가
- [req-layout-planner.toml](./req-layout-planner.toml): `packages/fe-ui/src/display/layout` flat Layout sidecar spec을 기획하는 전문가
- [req-route-layout-planner.toml](./req-route-layout-planner.toml): route `layout.tsx`의 서버 skeleton, named slot topology, `layout.spec.md`를 기획하는 전문가
- [req-surface-planner.toml](./req-surface-planner.toml): route layout/page/feature의 Surface ownership과 elevation 배치를 기획하는 전문가
- [req-feature-planner.toml](./req-feature-planner.toml): 화면별 Feature 컴포넌트를 기획하는 전문가
- [req-widget-planner.toml](./req-widget-planner.toml): 화면별 Widget 컴포넌트를 기획하는 전문가
- [req-primitive-planner.toml](./req-primitive-planner.toml): 화면별 Pure UI 컴포넌트를 기획하는 전문가
- [req-cell-planner.toml](./req-cell-planner.toml): DataGrid/Table Cell sidecar spec을 기획하는 전문가
- [req-columns-planner.toml](./req-columns-planner.toml): `packages/fe-ui/src/columns` 레이어 계약과 `MetaDataGrid`/`cell` 경계를 기획하는 전문가
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

- [fe-ui-page-builder.toml](./fe-ui-page-builder.toml): `packages/fe-ui/src/page/[PageName]/[PageName].tsx` 기준의 pure page component와 sidecar를 생성하는 전문가
- [fe-page-builder.toml](./fe-page-builder.toml): `apps/*/src/app/**/page.tsx`와 `@slot/**/page.tsx` thin container를 구현하고 folder-based pure page를 연결하는 전문가
- [fe-layout-builder.toml](./fe-layout-builder.toml): `packages/fe-ui/src/display/layout`의 flat Layout primitive를 설계하고 생성하는 전문가
- [fe-route-layout-builder.toml](./fe-route-layout-builder.toml): Next.js App Router의 `app/**/layout.tsx`와 named slot topology를 설계하고 생성하는 전문가
- [fe-feature-builder.toml](./fe-feature-builder.toml): 비즈니스 기능을 담당하는 Feature 컴포넌트를 생성하는 전문가
- [fe-master-builder.toml](./fe-master-builder.toml): 목록/테이블/그리드 계열 재사용 master 계층을 생성하고 정리하는 전문가
- [fe-detail-builder.toml](./fe-detail-builder.toml): 상세 조회/읽기 전용 재사용 detail 계층을 생성하고 정리하는 전문가
- [fe-form-builder.toml](./fe-form-builder.toml): 생성/수정 입력 화면용 재사용 form 계층을 생성하고 정리하는 전문가
- [fe-widget-builder.toml](./fe-widget-builder.toml): 재사용 가능한 작은 UI 조각 Widget 컴포넌트를 생성하는 전문가
- [fe-display-component-builder.toml](./fe-display-component-builder.toml): Display UI 컴포넌트를 `packages/fe-ui/src/display`에 생성하는 전문가
- [fe-control-component-builder.toml](./fe-control-component-builder.toml): 사용자 조작/입력 컴포넌트를 `packages/fe-ui/src/control`에 생성하는 전문가
- [fe-cell-builder.toml](./fe-cell-builder.toml): DataGrid/Table용 Cell 컴포넌트를 계층별로 생성하는 전문가
- [fe-columns-builder.toml](./fe-columns-builder.toml): `packages/fe-ui/src/columns` 레이어와 `MetaDataGrid`/`cell` 경계를 정리하는 전문가
- [fe-menu-builder.toml](./fe-menu-builder.toml): 메뉴 시스템 컴포넌트를 생성하는 전문가
- [fe-store-builder.toml](./fe-store-builder.toml): MobX 기반 Store를 생성하는 전문가
- [fe-api-integrator.toml](./fe-api-integrator.toml): Orval 생성 React Query 훅을 사용하여 더미 데이터를 실제 API 호출로 교체하는 전문가
- [fe-e2e-builder.toml](./fe-e2e-builder.toml): 프론트엔드 E2E 테스트 전략을 설계하는 전문가
- [fe-unit-test-builder.toml](./fe-unit-test-builder.toml): 프론트엔드 단위 테스트 전략을 설계하는 전문가

## 모바일

- [mobile/README.md](./mobile/README.md): RN/Expo 전용 mobile role 인덱스
- [mobile/orch-mobile-stage.toml](./mobile/orch-mobile-stage.toml): 모바일 route flow 와 common backend spec planning 을 함께 조율하는 메타 role
- [mobile/orch-mobile-screen-planner.toml](./mobile/orch-mobile-screen-planner.toml): 단일 Expo route 의 모바일 화면 기획을 조율하는 오케스트레이터
- [mobile/req-mo-route-layout-planner.toml](./mobile/req-mo-route-layout-planner.toml): Expo Router 의 `_layout.spec.md` shell 계약을 기획하는 전문가
- [mobile/req-mo-page-planner.toml](./mobile/req-mo-page-planner.toml): Expo route screen 의 `index.spec.md`를 상세 기획하는 전문가
- [mobile/req-mo-primitive-planner.toml](./mobile/req-mo-primitive-planner.toml): 모바일 display/surface/provider primitive sidecar spec 을 기획하는 전문가
- [mobile/req-mo-input-planner.toml](./mobile/req-mo-input-planner.toml): 모바일 입력 컴포넌트 sidecar spec 을 기획하는 전문가
- [mobile/req-mo-menu-planner.toml](./mobile/req-mo-menu-planner.toml): 모바일 navigation/menu contract 를 기획하는 전문가
- [mobile/req-mo-store-planner.toml](./mobile/req-mo-store-planner.toml): 모바일 공용/로컬 상태 경계를 기획하는 전문가
- [mobile/req-mo-fe-test-planner.toml](./mobile/req-mo-fe-test-planner.toml): 모바일 route 와 app spec 의 unit/E2E 테스트 케이스를 기획하는 전문가
- [mobile/fe-mo-control-component-builder.toml](./mobile/fe-mo-control-component-builder.toml): `packages/fe-mo-ui/src/control/**`의 RN 입력/상호작용 contract를 생성하거나 정리하는 전문가
- [mobile/fe-mo-display-component-builder.toml](./mobile/fe-mo-display-component-builder.toml): `packages/fe-mo-ui/src/display/**`, `surface`, `design-system`, 비메뉴 `layout` thin wrapper contract를 생성하거나 정리하는 전문가
- [mobile/fe-mo-menu-builder.toml](./mobile/fe-mo-menu-builder.toml): `packages/fe-mo-ui/src/layout/Menu|SubMenu/**`의 RN 메뉴 contract를 생성하거나 정리하는 전문가
- [mobile/fe-mo-route-layout-builder.toml](./mobile/fe-mo-route-layout-builder.toml): `apps/mobile/src/app/**/_layout.tsx`를 구현하는 전문가
- [mobile/fe-mo-page-builder.toml](./mobile/fe-mo-page-builder.toml): `apps/mobile/src/app/**/index.tsx` route screen 을 구현하는 전문가
- [mobile/fe-mo-api-integrator.toml](./mobile/fe-mo-api-integrator.toml): 모바일 데이터 조회/변경 연동 기준을 구현하는 전문가
- [mobile/fe-mo-store-builder.toml](./mobile/fe-mo-store-builder.toml): 모바일 공용/로컬 상태 경계를 정리하고 MobX store 를 구현하는 전문가
- [mobile/fe-mo-cell-builder.toml](./mobile/fe-mo-cell-builder.toml): 모바일 Cell 재사용 계층을 설계하고 구현하는 전문가
- [mobile/fe-mo-columns-builder.toml](./mobile/fe-mo-columns-builder.toml): 모바일 columns 계약과 collection 표현 경계를 정리하는 전문가
- [mobile/fe-mo-detail-builder.toml](./mobile/fe-mo-detail-builder.toml): 모바일 detail 재사용 계층을 생성하고 정리하는 전문가
- [mobile/fe-mo-e2e-builder.toml](./mobile/fe-mo-e2e-builder.toml): 모바일 Detox E2E 테스트 전략을 설계하는 전문가
- [mobile/fe-mo-feature-builder.toml](./mobile/fe-mo-feature-builder.toml): 모바일 비즈니스 feature 계층을 생성하고 정리하는 전문가
- [mobile/fe-mo-form-builder.toml](./mobile/fe-mo-form-builder.toml): 모바일 form 재사용 계층을 생성하고 정리하는 전문가
- [mobile/fe-mo-layout-builder.toml](./mobile/fe-mo-layout-builder.toml): Expo/RN에서 재사용할 모바일 layout shell 컴포넌트를 설계하는 전문가
- [mobile/fe-mo-master-builder.toml](./mobile/fe-mo-master-builder.toml): 모바일 목록/그리드 계열 재사용 master 계층을 생성하고 정리하는 전문가
- [mobile/fe-mo-ui-page-builder.toml](./mobile/fe-mo-ui-page-builder.toml): `packages/fe-mo-ui/src/page/**` 기준의 pure mobile page component를 생성하는 전문가
- [mobile/fe-mo-unit-test-builder.toml](./mobile/fe-mo-unit-test-builder.toml): 모바일 Jest unit test 전략을 설계하는 전문가
- [mobile/fe-mo-widget-builder.toml](./mobile/fe-mo-widget-builder.toml): 모바일 재사용 widget 계층을 생성하고 정리하는 전문가

## QA / 검증

- [qa-type-checker.toml](./qa-type-checker.toml): TypeScript 타입 에러를 근본 원인까지 추적하여 해결하는 전문가
- [qa-fe-testing.toml](./qa-fe-testing.toml): Vitest 기반 프론트엔드 패키지 테스트 코드를 작성하는 전문가
- [qa-fe-e2e-testing.toml](./qa-fe-e2e-testing.toml): Playwright 기반 프론트엔드 E2E 테스트 코드를 작성하는 전문가
- [qa-be-testing.toml](./qa-be-testing.toml): Jest 기반 백엔드 및 공용 패키지 테스트 코드를 작성하는 전문가
- [qa-be-e2e-testing.toml](./qa-be-e2e-testing.toml): Jest + Supertest 기반 백엔드 E2E 테스트 코드를 작성하는 전문가
- [mobile/qa-mo-testing.toml](./mobile/qa-mo-testing.toml): Jest + React Native Testing Library 기반 모바일 단위 테스트 코드를 작성하는 전문가
- [mobile/qa-mo-e2e-testing.toml](./mobile/qa-mo-e2e-testing.toml): Detox 기반 모바일 E2E 테스트 코드를 작성하는 전문가

## 공용 / 운영 보조

- [common-schema-builder.toml](./common-schema-builder.toml): 프론트엔드와 백엔드에서 공유하는 검증 스키마를 생성하는 전문가
- [dev-service-starter.toml](./dev-service-starter.toml): 개발 서비스를 시작하는 에이전트
- [etc-jenkinsfile-builder.toml](./etc-jenkinsfile-builder.toml): Jenkins CI/CD 파이프라인 파일을 생성하는 전문가

## 보조 문서가 있는 agent

아래 agent는 별도 `*.spec.md`가 있습니다.

- [be-prisma-builder.toml.spec.md](./be-prisma-builder.toml.spec.md)
- [be-repository-builder.toml.spec.md](./be-repository-builder.toml.spec.md)
- [fe-detail-builder.toml.spec.md](./fe-detail-builder.toml.spec.md)
- [fe-form-builder.toml.spec.md](./fe-form-builder.toml.spec.md)
- [fe-layout-builder.toml.spec.md](./fe-layout-builder.toml.spec.md)
- [fe-master-builder.toml.spec.md](./fe-master-builder.toml.spec.md)
- [fe-route-layout-builder.toml.spec.md](./fe-route-layout-builder.toml.spec.md)
- [fe-menu-builder.toml.spec.md](./fe-menu-builder.toml.spec.md)
- [fe-page-builder.toml.spec.md](./fe-page-builder.toml.spec.md)
- [fe-ui-page-builder.toml.spec.md](./fe-ui-page-builder.toml.spec.md)
- [fe-display-component-builder.toml.spec.md](./fe-display-component-builder.toml.spec.md)
- [mobile/fe-mo-api-integrator.toml.spec.md](./mobile/fe-mo-api-integrator.toml.spec.md)
- [mobile/fe-mo-page-builder.toml.spec.md](./mobile/fe-mo-page-builder.toml.spec.md)
- [mobile/fe-mo-route-layout-builder.toml.spec.md](./mobile/fe-mo-route-layout-builder.toml.spec.md)
- [mobile/fe-mo-store-builder.toml.spec.md](./mobile/fe-mo-store-builder.toml.spec.md)
- [mobile/orch-mobile-screen-planner.toml.spec.md](./mobile/orch-mobile-screen-planner.toml.spec.md)
- [mobile/orch-mobile-stage.toml.spec.md](./mobile/orch-mobile-stage.toml.spec.md)
- [mobile/req-mo-fe-test-planner.toml.spec.md](./mobile/req-mo-fe-test-planner.toml.spec.md)
- [mobile/req-mo-input-planner.toml.spec.md](./mobile/req-mo-input-planner.toml.spec.md)
- [mobile/req-mo-menu-planner.toml.spec.md](./mobile/req-mo-menu-planner.toml.spec.md)
- [mobile/req-mo-page-planner.toml.spec.md](./mobile/req-mo-page-planner.toml.spec.md)
- [mobile/req-mo-primitive-planner.toml.spec.md](./mobile/req-mo-primitive-planner.toml.spec.md)
- [mobile/req-mo-route-layout-planner.toml.spec.md](./mobile/req-mo-route-layout-planner.toml.spec.md)
- [mobile/req-mo-store-planner.toml.spec.md](./mobile/req-mo-store-planner.toml.spec.md)
- [orch-screen-planner.toml.spec.md](./orch-screen-planner.toml.spec.md)
- [orch-stage.toml.spec.md](./orch-stage.toml.spec.md)
- [req-layout-planner.toml.spec.md](./req-layout-planner.toml.spec.md)
- [req-route-layout-planner.toml.spec.md](./req-route-layout-planner.toml.spec.md)
- [req-page-planner.toml.spec.md](./req-page-planner.toml.spec.md)
- [req-columns-planner.toml.spec.md](./req-columns-planner.toml.spec.md)
- [req-primitive-planner.toml.spec.md](./req-primitive-planner.toml.spec.md)
- [req-surface-planner.toml.spec.md](./req-surface-planner.toml.spec.md)
