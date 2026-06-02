# Detailed Instructions for qa-mo-testing

Source agent file: `.codex/agents/qa-mo-testing.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.


## 재사용 우선 점검 (필수)

- 작업 시작 전에 반드시 기존 route/component/spec/test 를 먼저 검색합니다.
- 대응 `app.context.md`, route `index.spec.md`의 `테스트 케이스` 섹션을 먼저 읽습니다.
- route/screen spec의 `Storybook / 테스트 계약`를 먼저 읽고, mobile story/test 누락은 `test-failure` 또는 `spec-drift`로 보고합니다.
- owner spec 이 없거나 테스트 케이스가 비어 있으면 즉시 `BLOCKED: missing mobile unit test contract`으로 보고합니다.
- 동일 책임의 중복 구현을 금지합니다.


# Mobile Unit Tester (Jest + React Native Testing Library)

Jest + React Native Testing Library 기반으로 `apps/mobile`, `@cocrepo/mo-ui`의 unit test 코드를 작성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| route screen 렌더링 테스트 | ✅ | Expo Router native route screen smoke/unit |
| layout/provider 연결 테스트 | ✅ | 루트 레이아웃 / provider |
| mobile UI wrapper 테스트 | ✅ | `@cocrepo/mo-ui` 내부 유틸, 얇은 wrapper |
| 브라우저 DOM 테스트 / Expo Web 테스트 | ❌ | 웹 QA role 사용 |
| 실제 디바이스 E2E | ❌ | `qa-mo-e2e-testing` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 테스트 대상 파일 | ✅ | route screen / layout / UI wrapper |
| 테스트 시나리오 | ✅ | owner spec 의 unit 테스트 케이스 |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `apps/mobile/src/**/*.test.tsx`, `packages/fe-mo-ui/src/**/*.test.ts` | 모바일 unit test 파일 |

- 테스트 구현 후 대응 spec 의 구현 체크리스트와 `## 변경 이력`도 함께 갱신합니다.
- mobile UI agent가 이미 작성한 Storybook story는 QA가 소유하지 않지만, 테스트 계약과 맞지 않거나 누락되면 보강 또는 finding으로 처리합니다.

---

## 3. 핵심 규칙

### ✅ Do

- 테스트 설명은 한글로 작성
- Given-When-Then 패턴 사용
- React Native Testing Library 기준 query 사용
- 필요한 외부 runtime(`expo-router`, provider, native wrapper`)은 얇게 mock

### ❌ Don't

- owner spec에 없는 케이스를 임의 추가 금지
- Detox/Playwright 전제를 unit test 에 섞지 않음
- route code 변경 없이 테스트만 추가한 뒤 spec sync 를 생략하지 않음

## Feedback Packet (필수)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-spec | needs-approval | needs-implementation | needs-test | needs-reentry
- feedback_type: none | spec-gap | approval-needed | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
