---
name: "fe-hook-builder"
description: "이 skill은 `fe-hook-agent` 역할로 일할 때 사용합니다. 공용 React hook을 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# fe-hook-builder

## 플랫폼 라우팅

- 이 역할은 공용 agent입니다.
- 웹/모바일 양쪽에서 소비할 수 있는 공용 계약만 다루며, UI 런타임별 시각 규칙은 소비 소유 에이전트의 `웹 규칙` 또는 `모바일 규칙` 섹션을 따릅니다.
- `@heroui/react`, `heroui-native`, DOM, Expo/native UI 구현 세부 규칙은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.

### Hook 런타임 Boundary

- `packages/fe-hook`은 app route와 package feature/screen이 소비하는 reusable hook을 소유합니다.
- app route 아래 `hooks/` 폴더를 만들지 않습니다. route에서 반복되거나 테스트 대상이 되는 hook/helper는 `packages/fe-hook/src`로 올립니다.
- hook은 UI 런타임 컴포넌트를 import하지 않습니다. router, native bridge, window/document 같은 런타임 값은 가능한 한 adapter/value로 주입받습니다.
- hook은 순수해야 하며 `@heroui/react`, `heroui-native`, router, browser/native API, toast/overlay/provider, 특정 UI 라이브러리 같은 런타임 의존성을 직접 품지 않습니다.
- `packages/fe-hook/package.json`에 새 라이브러리 의존성을 추가하지 않습니다. 불가피한 외부 런타임 값은 hook option, callback, adapter, plain value로 주입받고 실제 라이브러리 호출은 route/feature/screen 소유 파일에 둡니다.
- route page 안의 단순 일회성 상태/wiring은 `fe-route-agent`가 page 파일 안에서 직접 처리할 수 있지만, 별도 hook 파일로 분리하는 순간 `fe-hook-agent` 소유입니다.

## 재사용 우선 점검 (필수)

- 신규 생성 전에 기존 hook을 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 hook을 금지합니다.

# FE hook 역할

`fe-hook-agent`는 `packages/fe-hook` / `@cocrepo/hook`의 React hook을 소유하는 역할입니다.

## 책임

- reusable React hook과 app route에서 추출된 hook/helper를 생성하거나 정리합니다.
- hook은 React component를 렌더링하지 않고, app-specific router/native 런타임은 가능한 adapter로 주입받아 재사용 가능하게 설계합니다.
- shared hook이 사용하는 public type은 `@cocrepo/type`, 순수 helper는 `@cocrepo/toolkit`을 우선 사용합니다.
- 신규/수정 hook은 export와 단위 테스트를 함께 정리합니다.

## 비책임

- route page 내부에 머무는 단순 inline 상태/wiring은 `fe-route-agent` 책임입니다.
- React 컴포넌트, screen, feature, widget 구현은 각 UI 소유 에이전트 책임입니다.
- pure utility는 `common-toolkit-builder` 책임입니다.
- shared type/interface는 `common-type-builder` 책임입니다.
- Orval API hook을 단순 재노출하는 별도 API client wrapper는 지양합니다. 여러 route가 같은 display 계약로 소비하거나 테스트 가능한 상태/helper 묶음이 필요할 때만 hook으로 추출합니다.

## Spec 정책

## 완료 기준

- 기존 hook과 사용처를 확인했습니다.
- 소스/export/test가 동기화되었습니다.
- hook source와 `packages/fe-hook/package.json`에 UI/플랫폼/서드파티 런타임 의존성이 새로 들어가지 않았음을 확인했습니다.
- `@cocrepo/hook` 테스트 또는 필요한 단위 테스트 명령 결과를 보고합니다.

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
