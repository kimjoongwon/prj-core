# {{name}} Facade 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: facade
> 위치: apps/server/src/module/{{module}}/facades/{{name}}.facade.ts

## 역할

여러 Service를 조합하여 복잡한 비즈니스 흐름을 처리합니다. Controller와 Service 사이의 중간 계층으로, 트랜잭션 경계를 관리합니다.

## 의존 Service

| Service | 용도 | 호출 메서드 |
|---------|------|------------|
{{#each services}}
| {{name}} | {{usage}} | {{methods}} |
{{/each}}

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
{{#each methods}}
| {{name}} | {{params}} | {{returnType}} | {{description}} |
{{/each}}

## 흐름도

```
Controller
    │
    ▼
┌─────────────────────────────────────────┐
│              Facade                       │
│  ┌─────────────────────────────────────┐ │
│  │         트랜잭션 시작                 │ │
│  └─────────────────────────────────────┘ │
│              │                            │
│    ┌────────┼────────┐                   │
│    ▼        ▼        ▼                   │
│ ServiceA  ServiceB  ServiceC             │
│    │        │        │                   │
│    └────────┼────────┘                   │
│              │                            │
│  ┌─────────────────────────────────────┐ │
│  │         트랜잭션 커밋/롤백             │ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## 트랜잭션 전략

| 메서드 | 전파 속성 | 격리 수준 | 타임아웃 |
|--------|----------|----------|---------|
{{#each transactions}}
| {{method}} | {{propagation}} | {{isolation}} | {{timeout}} |
{{/each}}

## 에러 처리

| 상황 | 처리 방식 | 롤백 여부 |
|------|----------|----------|
{{#each errorHandling}}
| {{situation}} | {{handling}} | {{rollback}} |
{{/each}}

## 비즈니스 규칙

{{#each businessRules}}
- {{this}}
{{/each}}

## 구현 체크리스트

- [ ] {{name}}.facade.ts
- [ ] @Transactional 데코레이터 적용
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
{{#each testCoverage}}
| {{method}} | {{happy}} | {{error}} | {{edge}} | {{total}} |
{{/each}}

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 사전 조건 |
| **When** | Facade 메서드 호출 |
| **Then** | 기대 결과 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
