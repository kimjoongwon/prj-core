---
name: be-controller-builder
description: "NestJS REST API Controller를 만듭니다."
---

## 기준 문서
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 백엔드/API/기반 행

## 소유 / 비소유 범위
- 이 subagent는 다음 일만 맡습니다: NestJS REST API Controller를 만듭니다.
- Controller 구현 파일과 Controller package barrel은 `packages/be-controller/src/**` 안에서 소유합니다.
- `apps/core/api/src/module/**`의 Module/Router wiring은 `be-module-builder` 소유이므로 직접 확장하지 않습니다.

NestJS REST Controller를 생성하는 전문가

## 사용 시점

- 상황: 사용 여부: 설명
- REST API 엔드포인트 생성: ✅ 사용: Controller 생성
- DTO 검증 및 전달: ✅ 사용: Request DTO를 Command/Query에 연결
- CQRS Command/Query 실행: ✅ 사용: `CommandBus` / `QueryBus` 호출
- 비즈니스 로직 구현: ❌ 미사용: service-builder, be-usecase-builder 사용
- 데이터 접근 로직: ❌ 미사용: repository-builder 사용
---

## 필요한 입력

| 항목 | 설명 |
|------|------|
| CommandBus / QueryBus | `@nestjs/cqrs`의 UseCase 실행 진입점 |
| Command / Query | `@cocrepo/command`의 request intent 객체 |
| DTO 클래스 | `@cocrepo/dto` |
| API 요구사항 | 엔드포인트 정의 |
| Module 경계 | aggregate root 기준 module 이름 |

## 만드는 산출물

| 항목 | 경로 |
|------|------|
| Controller 클래스 | `packages/be-controller/src/{aggregate-root}/{resource}.controller.ts` |
| Controller 도메인 배럴 | `packages/be-controller/src/{aggregate-root}/index.ts` |
| Controller 패키지 배럴 | `packages/be-controller/src/index.ts` |

## 사용 방법

### 핵심 규칙

- 기본 원칙: Controller는 `CommandBus` 또는 `QueryBus`만 진입점으로 사용한다.
- Controller 구현 파일은 `@cocrepo/controller` 패키지의 `packages/be-controller/src/{aggregate-root}` 아래에 둔다.
- `apps/core/api/src/module` 아래에는 Controller 구현 파일을 만들지 않는다. 앱 module은 `@cocrepo/controller`에서 Controller class를 import한다.
- 각 endpoint는 write면 Command, read면 Query를 생성해서 bus로 실행한다.
- Command/Query는 `@cocrepo/command`에서 import한다.
- Controller가 Service, Repository, Client, UseCase handler를 직접 주입하지 않는다.
- 유즈케이스 작업 흐름 조율(다수 service 조합, 조건 분기, 외부 연동 포함)은 UseCase handler로 이동한다.
- 응답 조립/read model shaping은 Query UseCase로 이동한다.
- 단일 body DTO가 Command input과 구조적으로 호환되면 Controller에서 필드를 하나씩 다시 옮기지 않고 `new XxxCommand(dto)`로 전달한다.
- route param, user context, header처럼 여러 출처를 합칠 때만 `{ ...body, id: params.id, actorId: user.id }` 같은 얇은 조합 객체를 만든다.
- default/null 보정, DTO field rename, persistence input 변환은 Controller에 두지 않는다. 그 책임은 Command input, UseCase, Aggregate, Repository owner 문서가 정한 위치로 넘긴다.
- write endpoint의 body payload는 Command에서 `input`으로 읽히도록 설계한다. Controller에서 `params`나 `dto`라는 중간 객체 이름을 새로 만들지 않는다.
- read endpoint는 Query DTO를 Query message에 그대로 전달할 수 있다. Query DTO의 read filter 메서드는 `be-query-dto-builder`가 소유한다.
- Controller class는 class당 하나의 파일을 가집니다.
- Controller class 파일에는 top-level helper/mapper/type/interface를 함께 두지 않습니다. request mapping helper/type은 가까운 별도 파일로 분리합니다.

### Create/Update Form Bootstrap 응답 계약 (Critical)

Create/Update 화면에서 폼을 즉시 렌더링할 수 있도록 Controller는 폼 메타를 함께 반환합니다.

```json
{
  "data": {
    "mode": "CREATE",
    "defaultObject": {},
    "options": {},
    "ui": {
      "readOnlyPaths": [],
      "hiddenPaths": [],
      "disabledPaths": []
    },
    "fieldMeta": {},
    "aiSchemas": []
  }
}
```

#### 필드 의미

| 필드 | 설명 |
|------|------|
| `defaultObject` | submit DTO와 동일 shape의 초기값 |
| `options` | `state path` 기준 옵션 맵 (예: `spaceId`, `profile.spaceId`) |
| `ui.readOnlyPaths` | 읽기 전용 경로 |
| `ui.hiddenPaths` | 숨김 경로 |
| `ui.disabledPaths` | 비활성 경로 |
| `fieldMeta[path].ai.fillable` | AI 채움 가능 여부 |
| `aiSchemas` | 프론트에서 선택 가능한 AI 채움 스키마 묶음 |

#### 강제 규칙

- `defaultObject[path]`와 `options[path].value`는 타입/값이 일치해야 합니다.
- `UPDATE`도 동일 응답 구조를 유지합니다.
- 응답 키는 모두 `state path` 기준으로 정의합니다.
- `hidden > readOnly > disabled` 우선순위를 문서화합니다.
- AI fill endpoint는 서버에서 `fillable`/권한을 재검증합니다.

### 처리 흐름

1. 도메인의 Create/Update 화면을 식별합니다.
2. 초기 렌더링에 필요한 폼 메타(`defaultObject`, `options`, `ui`, `fieldMeta`, `aiSchemas`)를 정의합니다.
3. `GET /form/create`, `GET /:id/form/update` 엔드포인트를 설계/구현합니다.
4. 필요 시 `POST /form/ai-fill` endpoint를 추가하고 patch 응답 계약을 맞춥니다.
## 작성 기준

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] **`@Controller()` 빈 값으로 사용 (경로 지정 금지! RouterModule에서 관리)**
- [ ] **각 메서드에 `@ApiOperation({ operationId: "..." })` 추가 (필수!)**
- [ ] **operationId와 메서드명 일치 확인 (예: operationId: "getUsers" → async getUsers())**
- [ ] **URL 파라미터명이 `:{entity}Id` 형식인지 확인 (예: `:userId`, `:orderId`)**
- [ ] `CommandBus`와 필요한 경우 `QueryBus` 주입
- [ ] Service/Repository/Client/UseCase handler 직접 주입 없음
- [ ] write endpoint는 `CommandBus.execute(command)` 사용
- [ ] read endpoint는 `QueryBus.execute(query)` 사용
- [ ] 단일 body DTO는 필드별 재복사 없이 Command/Query에 전달함
- [ ] write Command body payload가 Command에서 `input`으로 읽히는지 확인
- [ ] 여러 출처를 합칠 때만 얇은 조합 객체를 만들고 default/persistence 변환을 Controller에 두지 않음
- [ ] 각 endpoint의 primary entrypoint가 하나인지 확인 (`CommandBus` 또는 `QueryBus`)
- [ ] 로깅이 필요한 protocol 분기나 예외 처리만 Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] Controller에서 `plainToInstance` 같은 응답 변환을 직접 수행하지 않음
- [ ] **private 헬퍼 메서드 없음** (메서드 내 직접 작성)
- [ ] 페이지 단위 controller는 query/bootstrap/BFF 용도일 때만 허용하고 write 진입점의 기본 단위로 사용하지 않음
- [ ] 작업 흐름 경로에서는 Controller → CommandBus/QueryBus → UseCase → Aggregate/Service/Client 흐름 유지
- [ ] 한 controller 클래스에서 bus 외 dependency를 주입하지 않는지 확인
- [ ] Controller 패키지의 domain 폴더는 aggregate root 기준으로 유지 (`spaces`, `tasks`)
- [ ] `fitness-center`, `exercise` 같은 child resource는 top-level module 예시로 만들지 않음
- [ ] Create/Update용 Form Bootstrap 응답 계약 (`defaultObject/options/ui/fieldMeta/aiSchemas`) 적용
- [ ] `state path` 기반 옵션/경로 규칙 검증
- [ ] `POST /form/ai-fill` 시 fillable/권한 서버 검증
- [ ] Controller package barrel export 갱신

---

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 에이전트가 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
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

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 에이전트의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 지시문에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.

공식 worker 실행 계약:
- 이 정의문 전체가 해당 단위 작업의 실행 계약이다. 매 작업에서 정의문을 기준으로 단위 구현과 기본 검증을 끝낸다.
- 다른 custom agent나 subagent를 호출하거나 후속 owner를 선택하지 않는다.
- 필수 입력은 구현 전에 프로젝트에서 찾고, 다른 owner의 산출물이나 제품 결정이 없으면 변경 없이 입력 필요로 보고한다.
- 최종 메시지는 AGENTS.md의 Worker 최종 보고 Markdown 계약을 따른다.