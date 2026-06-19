# be-controller-builder 상세 지시

원본 에이전트 파일: `.codex/agents/20-be-controller-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# 컨트롤러-빌더

NestJS REST Controller를 생성하는 전문가

## 사용 시점

- 상황: 사용 여부: 설명
- REST API 엔드포인트 생성: ✅ 사용: Controller 생성
- DTO 검증 및 변환: ✅ 사용: Request DTO 처리
- CQRS Command/Query 실행: ✅ 사용: `CommandBus` / `QueryBus` 호출
- 비즈니스 로직 구현: ❌ 미사용: service-builder, be-usecase-builder 사용
- 데이터 접근 로직: ❌ 미사용: repository-builder 사용
---

## 필요한 입력

| 항목 | 설명 |
|------|------|
| 엔드포인트 인벤토리 | 담당 스펙의 `백엔드 / API 계약` 아래 endpoint 행 |
| CommandBus / QueryBus | `@nestjs/cqrs`의 UseCase 실행 진입점 |
| Command / Query | `@cocrepo/command`의 request intent 객체 |
| DTO 클래스 | `@cocrepo/dto` |
| API 요구사항 | 엔드포인트 정의 |
| Module 경계 | aggregate root 기준 module 이름 |

## 만드는 산출물

| Controller 클래스 | `apps/core/api/src/module/{aggregate-root}/{resource}.controller.ts` |
| | API 계약 | route `page.spec.md`의 API 계약 섹션 |
| | Module 파일 | `apps/core/api/src/module/{aggregate-root}/{aggregate-root}.module.ts` |
| | Module 계약 | 담당 스펙 또는 route `page.spec.md`의 Module/Wiring 계약 |
| | app.module.ts 업데이트 | 라우팅 등록 |

## 사용 방법

### 핵심 규칙

- 기본 원칙: Controller는 `CommandBus` 또는 `QueryBus`만 진입점으로 사용한다.
- 각 endpoint는 write면 Command, read면 Query를 생성해서 bus로 실행한다.
- Command/Query는 `@cocrepo/command`에서 import한다.
- 담당 스펙의 `엔드포인트 인벤토리`에 명시된 endpoint만 생성/수정하고, 행의 `재사용/신규`, `소스/대상`, 소스 담당 `agent_type`, 소비/Wiring `agent_type`, `codegen` 계약을 벗어나지 않는다.
- endpoint가 실행할 Command/Query와 UseCase handler는 담당 스펙의 각 인벤토리 행과 일치해야 한다. 누락되면 구현하지 말고 `계약-gap`으로 보고한다.
- Controller가 Service, Repository, Client, UseCase handler를 직접 주입하지 않는다.
- 유즈케이스 작업 흐름 조율(다수 service 조합, 조건 분기, 외부 연동 포함)은 UseCase handler로 이동한다.
- 응답 조립/read model shaping은 Query UseCase로 이동한다.
- 단일 body DTO가 Command input과 구조적으로 호환되면 Controller에서 필드를 하나씩 다시 옮기지 않고 `new XxxCommand(dto)`로 전달한다.
- route param, user context, header처럼 여러 출처를 합칠 때만 `{ ...body, id: params.id, actorId: user.id }` 같은 얇은 조합 객체를 만들고, 값의 원천이 보이도록 `body.xxx`, `params.xxx`, `user.id`, `spaceId` 같은 소스 경로 또는 출처명 alias를 유지한다.
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
5. Swagger와 route `page.spec.md`의 API 계약 섹션에 응답 구조를 명시합니다.

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
- [ ] Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] **Entity 직접 반환** (plainToInstance 사용 금지, DtoTransformInterceptor가 자동 변환)
- [ ] **private 헬퍼 메서드 없음** (메서드 내 직접 작성)
- [ ] 페이지 단위 controller는 query/bootstrap/BFF 용도일 때만 허용하고 write 진입점의 기본 단위로 사용하지 않음
- [ ] 작업 흐름 경로에서는 Controller → CommandBus/QueryBus → UseCase → Service → Repository 흐름 유지
- [ ] 한 controller 클래스에서 bus 외 dependency를 주입하지 않는지 확인
- [ ] module 폴더는 aggregate root 기준으로 유지 (`spaces`, `tasks`)
- [ ] `ground`, `exercise` 같은 child resource는 top-level module 예시로 만들지 않음
- [ ] Create/Update용 Form Bootstrap 응답 계약 (`defaultObject/options/ui/fieldMeta/aiSchemas`) 적용
- [ ] `state path` 기반 옵션/경로 규칙 검증
- [ ] `POST /form/ai-fill` 시 fillable/권한 서버 검증
- [ ] Module 파일 생성
- [ ] route `page.spec.md` 또는 담당 스펙의 API/Module 계약 동시 갱신
- [ ] `app.module.ts`에 Module import
- [ ] RouterModule에 경로 등록

---
