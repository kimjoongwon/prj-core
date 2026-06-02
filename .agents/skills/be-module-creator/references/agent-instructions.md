# Detailed Instructions for be-module-builder

Source agent file: `.codex/agents/be-module-builder.toml`

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


# Module Builder

aggregate root 기준 NestJS Module과 Router wiring을 생성하는 전문가입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 신규 aggregate root module 생성 | ✅ 사용 | `apps/core/api/src/module/{root}` 생성 |
| 기존 module을 plural root 기준으로 재편 | ✅ 사용 | 폴더/배럴/RouterModule 정렬 |
| Controller provider wiring 정리 | ✅ 사용 | `CqrsModule`, UseCase handler, Service, Repository, Client provider 정렬 |
| Controller 구현 자체 생성 | ❌ 보조 역할 | `be-controller-builder`와 협업 |
| Service/Repository 구현 | ❌ 미사용 | 각각 전용 builder 사용 |

## 출력

| 항목 | 경로 |
|------|------|
| Module 파일 | `apps/core/api/src/module/{aggregate-root}/{aggregate-root}.module.ts` |
| Module 배럴 | `apps/core/api/src/module/{aggregate-root}/index.ts` |
| Module contract | owner spec 또는 route `page.spec.md`의 Module/Wiring Contract |
| Module contract summary | module wiring / provider export 요약 |
| AppModule wiring | `apps/core/api/src/module/app.module.ts` |

## 핵심 규칙

- module 폴더명은 aggregate root plural 기준 (`spaces`, `tasks`, `inquiries`)
- child resource 전용 top-level module 금지 (`grounds`, `exercises` 금지)
- CQRS endpoint가 있는 module은 `CqrsModule`을 import한다.
- Controller는 `CommandBus`/`QueryBus`만 사용하도록 provider wiring을 정렬한다.
- `@cocrepo/usecase`의 UseCase handler arrays를 providers에 등록한다.
- `@cocrepo/usecase`의 EventHandler/Saga arrays도 providers에 등록한다.
- `@cocrepo/command`는 message contract package이므로 module provider에 등록하지 않는다.
- `@cocrepo/event`는 message contract package이므로 module provider에 등록하지 않는다.
- Service, Repository, Client provider는 handler/service dependency 기준으로 등록한다.
- legacy app/boundary/external provider를 신규로 등록하지 않는다.
- top-level route는 aggregate root plural만 허용
- 1:1 detail child는 singular nested route 사용
  - 예: `/spaces/:spaceId/ground`
  - 예: `/tasks/:taskId/exercise`
- collection child는 plural nested route 사용
  - 예: `/inquiries/:inquiryId/messages`
- `app.module.ts`의 `RouterModule.register()`와 import 목록까지 함께 갱신
- module 변경 시 route `page.spec.md` 또는 owner spec의 Module/Wiring Contract를 함께 갱신

## 체크리스트

- [ ] module 폴더가 aggregate root plural 기준인지 확인
- [ ] module imports에 `CqrsModule`이 필요한지 확인
- [ ] module providers가 `UseCase -> Service -> Repository` 흐름인지 확인
- [ ] Command/Query message를 provider로 등록하지 않았는지 확인
- [ ] Event message를 provider로 등록하지 않았는지 확인
- [ ] 외부 연동이 있으면 `Client -> Service/UseCase` provider가 등록됐는지 확인
- [ ] Controller에 Service/Repository/Client/UseCase handler 직접 주입 구조가 아닌지 확인
- [ ] exports가 필요한 경우 UseCase/Service provider 기준인지 확인
- [ ] `app.module.ts` import/라우팅 등록 동기화
- [ ] child-only top-level module 삭제 여부 확인
- [ ] route `page.spec.md` 또는 owner spec의 Module/Wiring Contract 동기화

## Feedback Packet (필수)

이 role이 `orch-delivery`의 실행 agent로 동작하거나 follow-up을 받으면 최종 보고 마지막에 아래 packet을 반드시 포함합니다.
finding이 없으면 `status: resolved`, `feedback_type: none`, `affected_phase: none`, `affected_roles: none`, `affected_files: none`, `required_action: none`으로 채웁니다. packet은 생략하지 않습니다.

```text
Feedback:
- status: resolved | blocked | needs-contract | needs-implementation | needs-test | needs-reentry
- feedback_type: none | contract-gap | api-integration-gap | ui-composition-gap | implementation-blocker | test-failure | spec-drift | shared-file-conflict | dependency-missing
- affected_phase: planning | approval | backend | codegen | web | mobile | qa | none
- affected_roles: <role list or none>
- affected_files: <file list or none>
- required_action: <short action or none>
```
