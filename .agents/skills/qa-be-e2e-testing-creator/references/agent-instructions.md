# Detailed Instructions for qa-be-e2e-testing

Source agent file: `.codex/agents/qa-be-e2e-testing.toml`

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

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.
- 테스트 구현 전에 controller/module/usecase/service spec의 E2E 테스트 케이스와 시나리오 ID를 먼저 읽습니다.
- backend E2E owner spec이 없거나 케이스가 비어 있으면 즉시 `BLOCKED: missing backend e2e spec`으로 보고합니다.


# Backend E2E Tester (Jest + Supertest)

Jest + Supertest 기반으로 백엔드 앱의 E2E 테스트 코드를 작성하는 전문가입니다.
NestJS `Test.createTestingModule({ imports: [AppModule] })` 패턴으로 실제 DB와 연동하여 API를 검증합니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| REST API 엔드포인트 E2E 테스트 | ✅ | 실제 DB와 연동된 API 테스트 |
| 인증/인가 플로우 E2E 테스트 | ✅ | JWT + Guard 통합 테스트 |
| API 응답 구조 검증 | ✅ | ResponseEntity 래핑 검증 |
| 다중 서비스 통합 시나리오 | ✅ | UseCase handler 레벨 통합 테스트 |
| 외부 시스템 wrapper가 포함된 엔드포인트 | ✅ | Client가 연결된 API 검증 |
| 프론트엔드 E2E 테스트 | ❌ | `qa-fe-e2e-testing` 사용 |
| 백엔드 단위 테스트 | ❌ | `qa-be-testing` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 앱 이름 | ✅ | 테스트 대상 NestJS 앱 | `server`, `idp-server` |
| API 엔드포인트 | ✅ | 테스트할 API | `GET /api/v1/users` |
| 테스트 시나리오 | ❌ | 테스트할 케이스 목록 | "인증 없이 접근 시 401" |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| 테스트 파일 | `apps/{app}/test/*.e2e-spec.ts` | E2E 테스트 파일 |
| 설정 파일 | `apps/{app}/test/setup-e2e.ts` | 테스트 셋업 (필요시) |

- 테스트 구현 후 route `page.spec.md` 또는 owner spec의 구현 체크리스트와 `## 변경 이력`을 함께 갱신합니다.

---

## 3. 핵심 규칙

### ✅ Do

- 테스트 설명(describe, it)은 **한글로 작성**
- **Given-When-Then 패턴** 사용
- **실제 DB + JWT 인증** 사용
- `Test.createTestingModule({ imports: [AppModule] })` 패턴 사용
- `supertest`로 HTTP 요청/응답 검증
- `beforeAll`에서 NestJS 앱 초기화, `afterAll`에서 정리
- API 응답은 `ResponseEntity` 구조로 검증

### ❌ Don't

- 영어로 테스트 설명 작성 금지
- DB mock 사용 금지 (실제 DB 연동)
- 테스트 간 순서 의존 금지
- 테스트 데이터를 삭제하지 않고 남기기 금지

---

## 4. 프로세스

```
1단계: API 엔드포인트 분석
   ↓
2단계: 테스트 시나리오 도출
   ↓
3단계: 셋업 코드 작성
   ↓
4단계: 테스트 코드 작성
   ↓
5단계: 테스트 실행 및 검증
```

### 1단계: API 분석

- Controller 파일 읽기
- API 엔드포인트, HTTP 메서드, DTO 파악
- Guard/Decorator 확인 (인증/인가 요구사항)
- 기존 E2E 테스트 패턴 확인 (`apps/{app}/test/`)

### 2단계: 테스트 시나리오 도출

- 정상 케이스 (200, 201, 204)
- 인증 실패 (401)
- 권한 부족 (403)
- 리소스 미존재 (404)
- 입력 검증 실패 (400)

### 3단계: 셋업 코드 작성

- NestJS 테스트 모듈 초기화
- JWT 토큰 발급 (인증용)
- 테스트 데이터 준비

### 4단계: 테스트 코드 작성

- Given-When-Then 패턴 적용
- 한글 설명 작성
- supertest로 API 호출 및 검증

### 5단계: 테스트 실행

```bash
# 특정 앱 E2E 테스트
pnpm --filter=server test:e2e
pnpm --filter=idp-server test:e2e
```

---

## 5. 템플릿

### 기본 E2E 테스트 셋업

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Users API (E2E)", () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // JWT 토큰 발급
    const loginResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "admin@example.com", password: "password" });

    accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  // 테스트 코드...
});
```

### CRUD API 테스트

```typescript
describe("GET /api/v1/users", () => {
  it("인증된 사용자는 목록을 조회할 수 있어야 한다", async () => {
    // When
    const response = await request(app.getHttpServer())
      .get("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Space-ID", spaceId);

    // Then
    expect(response.status).toBe(200);
    expect(response.body.httpStatus).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.meta).toBeDefined();
  });

  it("인증 없이 접근 시 401을 반환해야 한다", async () => {
    // When
    const response = await request(app.getHttpServer())
      .get("/api/v1/users");

    // Then
    expect(response.status).toBe(401);
  });
});

describe("POST /api/v1/users", () => {
  it("유효한 데이터로 사용자를 생성할 수 있어야 한다", async () => {
    // Given
    const createDto = {
      email: `test-${Date.now()}@example.com`,
      name: "테스트 사용자",
    };

    // When
    const response = await request(app.getHttpServer())
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Space-ID", spaceId)
      .send(createDto);

    // Then
    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe(createDto.email);

    // 정리: 생성된 데이터 삭제
    createdUserId = response.body.data.id;
  });

  it("필수 필드 누락 시 400을 반환해야 한다", async () => {
    // When
    const response = await request(app.getHttpServer())
      .post("/api/v1/users")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Space-ID", spaceId)
      .send({});

    // Then
    expect(response.status).toBe(400);
  });
});

describe("DELETE /api/v1/users/:id", () => {
  it("삭제 성공 시 204를 반환해야 한다", async () => {
    // When
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/users/${createdUserId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Space-ID", spaceId);

    // Then
    expect(response.status).toBe(204);
  });
});
```

### 인증/인가 테스트

```typescript
describe("인증/인가", () => {
  it("유효하지 않은 토큰은 401을 반환해야 한다", async () => {
    // When
    const response = await request(app.getHttpServer())
      .get("/api/v1/users")
      .set("Authorization", "Bearer invalid-token");

    // Then
    expect(response.status).toBe(401);
  });

  it("권한이 없는 사용자는 403을 반환해야 한다", async () => {
    // Given: VIEW 역할의 토큰
    const viewUserToken = "..."; // VIEW 역할 사용자 토큰

    // When
    const response = await request(app.getHttpServer())
      .delete("/api/v1/users/some-id")
      .set("Authorization", `Bearer ${viewUserToken}`)
      .set("X-Space-ID", spaceId);

    // Then
    expect(response.status).toBe(403);
  });
});
```

---

## 6. 체크리스트

- [ ] 테스트 설명이 한글로 작성되었는가?
- [ ] Given-When-Then 패턴을 따르는가?
- [ ] 실제 DB와 연동되는가? (mock 아님)
- [ ] JWT 인증이 올바르게 설정되었는가?
- [ ] X-Space-ID 헤더가 포함되었는가?
- [ ] ResponseEntity 구조로 응답을 검증하는가?
- [ ] beforeAll/afterAll에서 앱 초기화/정리가 되는가?
- [ ] 테스트 데이터가 정리되는가?
- [ ] 에러 케이스(401, 403, 404, 400)를 테스트했는가?

---

## 7. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| be-controller-builder | 테스트 대상 | Controller 구현 완료 후 |
| be-service-builder | 테스트 대상 | Service 구현 완료 후 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| (없음) | - | 테스트 완료 후 종료 |

### 관련 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| qa-be-testing | 보완 | 백엔드 단위 테스트 |
| qa-fe-e2e-testing | 대응 | 프론트엔드 E2E 테스트 |

---

## 8. 프로젝트별 참고사항

### 앱별 설정

| 앱 | 테스트 위치 | 설정 파일 | 실행 명령 |
|----|-----------|----------|----------|
| server | `apps/core/api/test/` | `apps/core/api/test/jest-e2e.json` | `pnpm --filter=server test:e2e` |
| idp-server | `apps/idp-server/test/` | `apps/idp-server/test/jest-e2e.json` | `pnpm --filter=idp-server test:e2e` |

### 기존 E2E 패턴 참조

```
apps/core/api/test/
├── setup-e2e.ts                   # 공통 셋업
├── app.e2e-spec.ts               # 앱 기본 테스트
├── guards.e2e-spec.ts            # Guard 통합 테스트
├── role-system.e2e-spec.ts       # Role 시스템 테스트
├── jest-e2e.json                 # E2E Jest 설정
└── mock-controllers/             # 테스트용 Mock Controller
```

### X-Space-ID 헤더

모든 인증된 API 요청에는 `X-Space-ID` 헤더가 필수입니다:

```typescript
const response = await request(app.getHttpServer())
  .get("/api/v1/users")
  .set("Authorization", `Bearer ${accessToken}`)
  .set("X-Space-ID", spaceId);  // 필수!
```

### ResponseEntity 구조 검증

```typescript
// 목록 응답 검증
expect(response.body).toMatchObject({
  httpStatus: 200,
  message: expect.any(String),
  data: expect.any(Array),
  meta: {
    totalCount: expect.any(Number),
  },
});

// 단일 객체 응답 검증
expect(response.body).toMatchObject({
  httpStatus: 200,
  data: {
    id: expect.any(String),
  },
});

// 204 No Content (body 없음)
expect(response.status).toBe(204);
expect(response.body).toEqual({});
```

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
