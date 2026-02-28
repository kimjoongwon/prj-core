---
name: be-controller-builder
description: NestJS REST Controller를 생성하는 전문가
tools: Read, Write, Grep, Bash
---


# 컨트롤러-빌더

NestJS REST Controller를 생성하는 전문가

## When to use

- 상황: 사용 여부: 설명
- REST API 엔드포인트 생성: ✅ 사용: Controller 생성
- DTO 검증 및 변환: ✅ 사용: Request DTO 처리
- 비즈니스 로직 구현: ❌ 미사용: service-builder 또는 facade-builder 사용
- 데이터 접근 로직: ❌ 미사용: repository-builder 사용
---

## What you need

| Service 또는 Facade | 비즈니스 로직 레이어 |
| | DTO 클래스 | `@cocrepo/dto` |
| | API 요구사항 | 엔드포인트 정의 |
|

## What you produce

| Controller 클래스 | `apps/core/api/src/shared/controller/resources/{entity}.controller.ts` |
| | Module 파일 | `apps/core/api/src/module/{entity}.module.ts` |
| | app.module.ts 업데이트 | 라우팅 등록 |

## How to use

### Core Rules

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

### Process

1. 도메인의 Create/Update 화면을 식별합니다.
2. 초기 렌더링에 필요한 폼 메타(`defaultObject`, `options`, `ui`, `fieldMeta`, `aiSchemas`)를 정의합니다.
3. `GET /form/create`, `GET /:id/form/update` 엔드포인트를 설계/구현합니다.
4. 필요 시 `POST /form/ai-fill` endpoint를 추가하고 patch 응답 계약을 맞춥니다.
5. Swagger와 sidecar spec에 응답 구조를 명시합니다.

## Guidelines

- [ ] `@ApiTags()` 데코레이터 추가
- [ ] **`@Controller()` 빈 값으로 사용 (경로 지정 금지! RouterModule에서 관리)**
- [ ] **각 메서드에 `@ApiOperation({ operationId: "..." })` 추가 (필수!)**
- [ ] **operationId와 메서드명 일치 확인 (예: operationId: "getUsers" → async getUsers())**
- [ ] **URL 파라미터명이 `:{entity}Id` 형식인지 확인 (예: `:userId`, `:orderId`)**
- [ ] Service 또는 Facade 주입 (하나만)
- [ ] Logger 초기화
- [ ] 각 메서드에 `@HttpCode(HttpStatus.OK)` 추가
- [ ] 각 메서드에 `@ApiResponseEntity()` 추가
- [ ] **Entity 직접 반환** (plainToInstance 사용 금지, DtoTransformInterceptor가 자동 변환)
- [ ] **private 헬퍼 메서드 없음** (메서드 내 직접 작성)
- [ ] Create/Update용 Form Bootstrap 응답 계약 (`defaultObject/options/ui/fieldMeta/aiSchemas`) 적용
- [ ] `state path` 기반 옵션/경로 규칙 검증
- [ ] `POST /form/ai-fill` 시 fillable/권한 서버 검증
- [ ] Module 파일 생성
- [ ] `app.module.ts`에 Module import
- [ ] RouterModule에 경로 등록

---
