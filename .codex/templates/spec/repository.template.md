# {{name}} Repository 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: repository
> 위치: packages/be-repository/src/{{repositoryName}}.ts

## 역할

{{description}}

## 담당 aggregate root

{{entity}}

## Prisma 모델

```prisma
model {{entity}} {
  {{prismaSchema}}
}
```

## 공개 메서드

| 메서드 | Prisma 메서드 | 반환값 | 설명 |
|--------|--------------|--------|------|
{{#each methods}}
| {{name}} | {{prismaMethod}} | {{returnType}} | {{description}} |
{{/each}}

## 쿼리 최적화

{{#if queryOptimizations}}
| 메서드 | 최적화 방식 |
|--------|------------|
{{#each queryOptimizations}}
| {{method}} | {{optimization}} |
{{/each}}
{{else}}
특별한 최적화 없음
{{/if}}

## 트랜잭션

{{#if transactions}}
| 메서드 | 트랜잭션 필요 | 이유 |
|--------|--------------|------|
{{#each transactions}}
| {{method}} | {{required}} | {{reason}} |
{{/each}}
{{else}}
트랜잭션 필요 없음
{{/if}}

## 구현 체크리스트

- [ ] {{repositoryName}}.ts
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest (Prisma Mock)

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock Prisma 클라이언트 |
| **When** | Repository 메서드 호출 |
| **Then** | 반환값, Prisma 쿼리 파라미터 확인 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
