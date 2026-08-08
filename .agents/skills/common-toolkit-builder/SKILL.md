---
name: "common-toolkit-builder"
description: "이 skill은 `common-toolkit-builder` 역할로 일할 때 사용합니다. 공용 toolkit 유틸을 만들고 정리하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# common-toolkit-builder

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 `packages/common-toolkit`, 사용처, 라우트 딜리버리 스펙의 `기반 계약`, 관련 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 utility를 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 utility를 금지합니다.

# 공용 toolkit 빌더

`common-toolkit-builder`는 `packages/common-toolkit` / `@cocrepo/toolkit`의 공용 utility source를 소유하는 역할입니다.

## 책임

- 순수 utility, formatter, parser, logger/helper, date/path/language/password/form helper를 생성하거나 정리합니다.
- pagination response builder처럼 여러 package/domain이 공유하는 순수 런타임 builder를 소유합니다.
- web, 모바일, 백엔드가 함께 쓸 수 있는 런타임-safe helper를 우선합니다.
- 신규/수정 utility는 `packages/common-toolkit/src/**`와 package export를 함께 정리합니다.
- 필요한 단위 테스트를 같은 작업에서 작성하거나 갱신합니다.
- utility/helper/parser/formatter는 파일당 하나의 exported function 또는 exported constant group만 소유합니다.

## 비책임

- React hook 생성은 `fe-hook-agent` 책임입니다.
- shared type/interface 생성은 `common-type-builder` 책임입니다.
- DTO/schema/entity/service/repository/controller 역할을 toolkit helper로 흡수하지 않습니다.
- app/route/screen 전용 임시 helper는 각 route agent 또는 소유 에이전트가 처리합니다.

## Spec 정책

- toolkit 전용 `*.spec.md`는 만들지 않습니다.
- 실행 범위는 생성된 라우트 딜리버리 스펙의 `기반 Slice > Toolkit 인벤토리`와 서비스 스펙 인벤토리를 함께 따릅니다.
- Screen/Feature 기획 스펙에는 toolkit 세부 실행표를 두지 않고 필요한 경우 의존 계약으로만 적습니다.
- route-local util이면 `common-toolkit-builder`가 아니라 웹/모바일 모두 `fe-route-agent` 책임으로 둡니다.

## 완료 기준

- 기존 중복 utility 검색 결과를 확인했습니다.
- 소스/export/test가 동기화되었습니다.
- 라우트 딜리버리 스펙의 `Toolkit 인벤토리`와 `에이전트 배정 매트릭스`가 신규/수정 산출물과 일치합니다.
- `@cocrepo/toolkit` 테스트 또는 필요한 단위 테스트 명령 결과를 보고합니다.

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
