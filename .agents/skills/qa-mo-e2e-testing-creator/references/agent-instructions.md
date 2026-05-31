# Detailed Instructions for qa-mo-e2e-testing

Source agent file: `.codex/agents/qa-mo-e2e-testing.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (Mandatory)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 실행 source of truth는 route delivery spec입니다: web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `Agent Assignment Matrix`, `Execution Graph`, `Backend / API Contract`, `Foundation Contract`, `Shared File Locks`, `Approval / Execution Log`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 route delivery spec의 inventory와 assignment row에 기록합니다.
- 승인된 route delivery spec이 있으면 그 spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 `Feedback:` packet으로 `orch-delivery`에 되돌립니다.


## 재사용 우선 점검 (Mandatory)

- 작업 시작 전에 반드시 기존 mobile spec/test/config 를 먼저 검색합니다.
- 대응 `app.context.md`, route `index.spec.md`의 E2E 시나리오를 먼저 읽습니다.
- owner spec 이 없거나 E2E 케이스가 비어 있으면 즉시 `BLOCKED: missing mobile e2e spec`으로 보고합니다.
- 동일 책임의 중복 구현을 금지합니다.


# Mobile E2E Tester (Detox)

Detox 기반으로 `apps/mobile`의 실제 앱 실행 시나리오를 검증하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| 앱 launch smoke test | ✅ | 첫 route 렌더링 확인 |
| 모바일 route 전환/상호작용 E2E | ✅ | Detox 기반 시나리오 |
| 브라우저 Playwright E2E / Expo Web E2E | ❌ | 웹 QA role 사용 |
| 컴포넌트 단위 테스트 | ❌ | `qa-mo-testing` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 대상 route/app | ✅ | mobile app scope |
| 테스트 시나리오 | ✅ | owner spec 의 E2E 시나리오 |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `apps/mobile/e2e/**/*.e2e.js` | Detox E2E 파일 |
| 설정 파일 | `apps/mobile/detox.config.js`, `apps/mobile/e2e/jest.config.js` | Detox 실행 설정 |

- 테스트 구현 후 대응 spec 의 구현 체크리스트와 `## 변경 이력`을 함께 갱신합니다.

---

## 3. 핵심 규칙

### ✅ Do

- 앱 launch 기준 smoke 시나리오부터 구현
- owner spec 의 시나리오 ID와 기대 결과를 그대로 사용
- 가능하면 text/testID 기반 selector 사용

### ❌ Don't

- 브라우저 URL / DOM selector 전제를 Detox 테스트에 섞지 않음
- 검증 타깃은 iOS/Android native runtime 으로 한정
- owner spec과 owner spec QA phase에 없는 신규 시나리오를 임의 추가하지 않음
- spec sync 없이 설정 파일만 추가하지 않음

## Feedback Packet (Mandatory)

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
