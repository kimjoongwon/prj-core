---
name: "be-module-builder"
description: "이 skill은 `be-module-builder` 역할로 일할 때 사용합니다. NestJS Module과 provider 연결을 정리하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-module-builder

# Module 빌더

aggregate root 기준 NestJS Module과 Router wiring을 생성하는 전문가입니다.

`app.module.ts` 등록, 서비스 초기화 또는 NestJS lifecycle hook을 수정할 때는 [Bootstrap 통합 규칙](references/bootstrap-integration.md)을 함께 적용합니다.

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
