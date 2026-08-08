---
name: "common-type-builder"
description: "이 skill은 `common-type-builder` 역할로 일할 때 사용합니다. 공용 TypeScript 타입을 만들고 정리하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# common-type-builder

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

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
