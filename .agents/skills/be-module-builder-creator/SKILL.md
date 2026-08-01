---
name: "be-module-builder-creator"
description: "이 skill은 `be-module-builder` 역할로 일할 때 사용합니다. NestJS Module과 provider 연결을 정리하는 방법을 쉽게 안내합니다."
---

# be-module-builder-creator

`be-module-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/21-be-module-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

# Module 빌더

aggregate root 기준 NestJS Module과 Router wiring을 생성하는 전문가입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| 신규 aggregate root module 생성 | ✅ 사용 | `apps/core/api/src/module/{root}` 생성 |
| 기존 module을 plural root 기준으로 재편 | ✅ 사용 | 폴더/배럴/RouterModule 정렬 |
| Controller provider wiring 정리 | ✅ 사용 | `@cocrepo/controller` import, `CqrsModule`, UseCase handler, Service, Repository, Client provider 정렬 |
| Controller 구현 자체 생성 | ❌ 보조 역할 | `be-controller-builder`와 협업 |
| Service/Repository 구현 | ❌ 미사용 | 각각 전용 builder 사용 |

## 출력

| 항목 | 경로 |
|------|------|
| Module 파일 | `apps/core/api/src/module/{aggregate-root}/{aggregate-root}.module.ts` |
| Module 배럴 | `apps/core/api/src/module/{aggregate-root}/index.ts` |
| Module 계약 | 담당 스펙 또는 route `page.spec.md`의 Module/Wiring 계약 |
| Module 계약 summary | module wiring / provider export 요약 |
| AppModule wiring | `apps/core/api/src/module/app.module.ts` |

## 핵심 규칙

- module 폴더명은 aggregate root plural 기준 (`spaces`, `tasks`, `inquiries`)
- Controller 구현은 `packages/be-controller`가 소유한다. module 파일은 Controller class를 `@cocrepo/controller`에서 import한다.
- module 폴더의 `index.ts`는 module/provider 같은 app wiring 산출물만 export하고 Controller를 re-export하지 않는다.
- child resource 전용 top-level module 금지 (`fitness-centers`, `exercises` 금지)
- CQRS endpoint가 있는 module은 `CqrsModule`을 import한다.
- Controller는 `CommandBus`/`QueryBus`만 사용하도록 provider wiring을 정렬한다.
- `@cocrepo/usecase`의 UseCase handler arrays를 providers에 등록한다.
- `@cocrepo/usecase`의 EventHandler/Saga arrays도 providers에 등록한다.
- `@cocrepo/command`는 message 계약 package이므로 module provider에 등록하지 않는다.
- `@cocrepo/event`는 message 계약 package이므로 module provider에 등록하지 않는다.
- Service, Repository, Client provider는 handler/service dependency 기준으로 등록한다.
- import 이름 충돌이 실제로 없으면 `ServiceXxx`, `RepositoryXxx`, `ClientXxx`, `UseCaseXxx`, `AggregateXxx`처럼 package 역할 prefix를 붙인 alias를 만들지 않는다.
- Module providers, exports, `useExisting`, constructor 타입은 owner package가 export한 class 이름을 그대로 사용한다. alias가 꼭 필요하면 같은 파일 안의 동일 이름 충돌과 그 충돌 대상이 코드에서 확인되어야 한다.
- 이전 방식 app/boundary/external provider를 신규로 등록하지 않는다.
- top-level route는 aggregate root plural만 허용
- 1:1 detail child는 singular nested route 사용
  - 예: `/spaces/:spaceId/fitness-center`
  - 예: `/tasks/:taskId/exercise`
- collection child는 plural nested route 사용
  - 예: `/inquiries/:inquiryId/messages`
- `app.module.ts`의 `RouterModule.register()`와 import 목록까지 함께 갱신
- module 변경 시 route `page.spec.md` 또는 담당 스펙의 Module/Wiring 계약을 함께 갱신

## 체크리스트

- [ ] module 폴더가 aggregate root plural 기준인지 확인
- [ ] Controller import가 `@cocrepo/controller` 기준인지 확인
- [ ] module 배럴이 Controller를 re-export하지 않는지 확인
- [ ] module imports에 `CqrsModule`이 필요한지 확인
- [ ] module providers가 UseCase handler와 필요한 Aggregate/Service/Client/Repository provider를 연결하는지 확인
- [ ] provider/import 이름에 불필요한 package prefix alias가 없는지 확인
- [ ] Command/Query message를 provider로 등록하지 않았는지 확인
- [ ] Event message를 provider로 등록하지 않았는지 확인
- [ ] 외부 연동이 있으면 `Client → Service/UseCase` provider가 등록됐는지 확인
- [ ] Controller에 Service/Repository/Client/UseCase handler 직접 주입 구조가 아닌지 확인
- [ ] exports가 필요한 경우 UseCase/Service provider 기준인지 확인
- [ ] `app.module.ts` import/라우팅 등록 동기화
- [ ] child-only top-level module 삭제 여부 확인
- [ ] route `page.spec.md` 또는 담당 스펙의 Module/Wiring 계약 동기화
