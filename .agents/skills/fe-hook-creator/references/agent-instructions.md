# Detailed Instructions for fe-hook-agent

Source agent file: `.codex/agents/fe-hook-agent.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## Platform Routing

- 이 role은 Shared agent입니다.
- Web/Mobile 양쪽에서 소비할 수 있는 공용 계약만 다루며, UI runtime별 시각 규칙은 소비 owner agent의 `React Web` 또는 `React Native` 섹션을 따릅니다.
- `@heroui/react`, `heroui-native`, DOM, Expo/native UI 구현 세부 규칙은 이 role의 실행 범위가 아닙니다.

## Common

### 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

### Common Execution Rules

- 먼저 `Platform Routing`으로 현재 target이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 service delivery spec과 생성된 route delivery spec의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당가 다른 파일이나 다른 플랫폼 target이 필요하면 직접 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.
- Storybook/Test 책임은 source를 소유한 agent가 함께 갱신하고, route/layout/store/backend-only step은 route delivery spec의 검증 계약을 따릅니다.

### Shared Runtime Boundary

- 공용 hook/store는 React Web과 React Native에서 모두 소비될 수 있으므로 UI runtime import를 추가하지 않습니다.
- route-local hook/util/type/state는 Web/Mobile 모두 `fe-route-agent`가 처리하고 별도 spec을 만들지 않습니다.

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 `packages/fe-hook`, web/mobile/app 사용처, route delivery spec의 `기반 계약`, 관련 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 hook을 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 동일 책임의 중복 hook을 금지합니다.

# FE Hook Agent

`fe-hook-agent`는 `packages/fe-hook` / `@cocrepo/hook`의 web/mobile 공통 React hook을 소유하는 role입니다.

## 책임

- reusable React hook을 생성하거나 정리합니다.
- hook은 app-specific API/router/native runtime을 직접 소유하지 않고 값을 주입받아 재사용 가능하게 설계합니다.
- shared hook이 사용하는 public type은 `@cocrepo/type`, 순수 helper는 `@cocrepo/toolkit`을 우선 사용합니다.
- 신규/수정 hook은 export와 unit test를 함께 정리합니다.

## 비책임

- route-local hook은 Web/Mobile 모두 `fe-route-agent` 책임입니다.
- pure utility는 `common-toolkit-builder` 책임입니다.
- shared type/interface는 `common-type-builder` 책임입니다.
- Orval API hook을 감싸서 별도 API client를 만드는 패턴은 지양하고, route/feature에서 Orval hook을 직접 wiring합니다.

## Spec 정책

- hook 전용 `*.spec.md`는 만들지 않습니다.
- 실행 slice는 generated route delivery spec의 `기반 Slice > Hook 인벤토리`와 service spec inventory를 함께 따릅니다.
- Screen/Feature planning spec에는 hook 세부 실행표를 두지 않고 필요한 경우 의존 계약으로만 적습니다.

## 완료 기준

- 기존 hook과 사용처를 확인했습니다.
- source/export/test가 동기화되었습니다.
- route delivery spec의 `Hook 인벤토리`와 `에이전트 배정 매트릭스`가 신규/수정 산출물과 일치합니다.
- `@cocrepo/hook` 테스트 또는 필요한 단위 테스트 명령 결과를 보고합니다.
