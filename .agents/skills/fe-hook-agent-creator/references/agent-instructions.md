# fe-hook-agent 상세 지시

원본 에이전트 파일: `.codex/agents/24-fe-hook-agent.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---

## 플랫폼 라우팅

- 이 역할은 공용 agent입니다.
- 웹/모바일 양쪽에서 소비할 수 있는 공용 계약만 다루며, UI 런타임별 시각 규칙은 소비 소유 에이전트의 `웹 규칙` 또는 `모바일 규칙` 섹션을 따릅니다.
- `@heroui/react`, `heroui-native`, DOM, Expo/native UI 구현 세부 규칙은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`가 맡습니다. 소스 담당 에이전트는 단위 테스트와 소스 계약만 맡고, Storybook 필요 시 spec 또는 최종 보고로 인계합니다.

### Hook 런타임 Boundary

- `packages/fe-hook`은 app route와 package feature/screen이 소비하는 reusable hook을 소유합니다.
- app route 아래 `hooks/` 폴더를 만들지 않습니다. route에서 반복되거나 테스트 대상이 되는 hook/helper는 `packages/fe-hook/src`로 올립니다.
- hook은 UI 런타임 컴포넌트를 import하지 않습니다. router, native bridge, window/document 같은 런타임 값은 가능한 한 adapter/value로 주입받습니다.
- route page 안의 단순 일회성 상태/wiring은 `fe-route-agent`가 page 파일 안에서 직접 처리할 수 있지만, 별도 hook 파일로 분리하는 순간 `fe-hook-agent` 소유입니다.

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 `packages/fe-hook`, 웹/모바일/app 사용처, 라우트 딜리버리 스펙의 `기반 계약`, 관련 테스트를 먼저 검색합니다.
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

- hook 전용 `*.spec.md`는 만들지 않습니다.
- 실행 범위는 생성된 라우트 딜리버리 스펙의 `기반 Slice > Hook 인벤토리`와 서비스 스펙 인벤토리를 함께 따릅니다.
- Screen/Feature 기획 스펙에는 hook 세부 실행표를 두지 않고 필요한 경우 의존 계약으로만 적습니다.

## 완료 기준

- 기존 hook과 사용처를 확인했습니다.
- 소스/export/test가 동기화되었습니다.
- 라우트 딜리버리 스펙의 `Hook 인벤토리`와 `에이전트 배정 매트릭스`가 신규/수정 산출물과 일치합니다.
- `@cocrepo/hook` 테스트 또는 필요한 단위 테스트 명령 결과를 보고합니다.
