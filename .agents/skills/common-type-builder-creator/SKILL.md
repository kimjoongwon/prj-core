---
name: "common-type-builder-creator"
description: "이 skill은 `common-type-builder` 역할로 일할 때 사용합니다. 공용 TypeScript 타입을 만들고 정리하는 방법을 쉽게 안내합니다."
---

# common-type-builder-creator

`common-type-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/07-common-type-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 `packages/common-type`, 사용처, 라우트 딜리버리 스펙의 `기반 계약`, 관련 타입 export를 먼저 검색합니다.
- 신규 생성 전에 기존 type/interface를 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 type과 재export 우회를 금지합니다.

# 공용 type 빌더

`common-type-builder`는 `packages/common-type` / `@cocrepo/type`의 공용 타입 계약을 소유하는 역할입니다.

## 책임

- 웹/모바일/백엔드가 공유하는 순수 TypeScript type, interface, union, 계약 type을 생성하거나 정리합니다.
- pagination meta/response처럼 여러 백엔드/프론트엔드 패키지가 공유하는 response shape 타입을 소유합니다.
- `packages/common-type/src/**`에 원본 타입을 두고 `src/index.ts`와 package export를 동기화합니다.
- 여러 패키지가 쓰는 타입은 `@cocrepo/type`에서 직접 import하도록 정리합니다.
- 타입 변경으로 downstream이 깨질 수 있으면 라우트 딜리버리 스펙의 `Type 인벤토리`에 소비 패키지와 검증을 명시합니다.

## 비책임

- 런타임 utility는 `common-toolkit-builder` 책임입니다.
- React hook은 `fe-hook-agent` 책임입니다.
- DTO/schema/entity/VO를 type alias로 대체하지 않습니다.
- 단일 컴포넌트/클래스 내부에서만 쓰는 props/helper type도 해당 소스 담당의 가까운 타입 파일에 둡니다. class/component 파일 내부에 top-level type/interface를 함께 두지 않습니다.

## Spec 정책

- type 전용 `*.spec.md`는 만들지 않습니다.
- 실행 범위는 생성된 라우트 딜리버리 스펙의 `기반 Slice > Type 인벤토리`와 서비스 스펙 인벤토리를 함께 따릅니다.
- Screen/Feature 기획 스펙에는 type 세부 실행표를 두지 않고 필요한 경우 의존 계약으로만 적습니다.

## 완료 기준

- 기존 타입과 import 사용처를 확인했습니다.
- 원본 타입 위치, export, 소비 import 방향이 정리되었습니다.
- 라우트 딜리버리 스펙의 `Type 인벤토리`와 `에이전트 배정 매트릭스`가 신규/수정 산출물과 일치합니다.
- 필요한 type-check 또는 downstream 검증 결과를 보고합니다.
