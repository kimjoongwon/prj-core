# {{name}} Controller 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: controller
> 위치: apps/core/api/src/module/{{module}}/{{controllerName}}.ts

## 역할

{{description}}

## 계층 연결

- Controller는 기본적으로 `@cocrepo/app`의 ApplicationService를 호출합니다.
- `Controller -> ApplicationService -> Service -> Repository` 흐름을 유지합니다.
- 예외: 단일 aggregate-root 전달형 유즈케이스만 동일 `Service` 직접 호출 예외를 허용합니다.

## 베이스 경로

`{{basePath}}`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
{{#each endpoints}}
| {{method}} | {{path}} | {{dto}} | {{returnType}} | {{description}} |
{{/each}}

## Create/Update Form Bootstrap 계약 (해당 시)

> 등록/수정 화면을 제공하는 도메인은 아래 응답 계약을 포함합니다.

| 필드 | 설명 |
|------|------|
| `defaultObject` | submit DTO와 동일 shape의 기본값 |
| `options` | state path 기준 옵션 맵 |
| `ui.readOnlyPaths` | 읽기 전용 경로 |
| `ui.hiddenPaths` | 숨김 경로 |
| `ui.disabledPaths` | 비활성 경로 |
| `fieldMeta[path].ai.fillable` | AI 채움 가능 여부 |
| `aiSchemas` | 프론트가 선택할 AI 스키마 묶음 |

권장 엔드포인트:
- `GET /form/create`
- `GET /:id/form/update`
- `POST /form/ai-fill` (선택)

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
{{#each authRequirements}}
| {{endpoint}} | {{authRequired}} | {{permission}} |
{{/each}}

## 요청 예시

{{#each requestExamples}}
### {{title}}

```http
{{method}} {{path}}
Content-Type: application/json

{{requestBody}}
```

{{/each}}

## 응답 예시

{{#each responseExamples}}
### {{title}}

```json
{{responseBody}}
```

{{/each}}

## 구현 체크리스트

- [ ] {{controllerName}}.ts
- [ ] DTO 검증
- [ ] Swagger 데코레이터
- [ ] E2E 테스트 (Jest + Supertest)

## 테스트 케이스

> 구현 도구: Jest + Supertest

### 테스트 커버리지

| 엔드포인트 | Happy Path | Error Path | Edge Case | 합계 |
|-----------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더, 요청 Body |
| **When** | HTTP 요청 실행 |
| **Then** | 응답 상태코드, 응답 Body 구조 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}
- `apps/core/api/src/module/{{module}}/{{module}}.module.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
