# {{name}} Entity 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: entity
> 위치: packages/be-entity/src/{{entityName}}.entity.ts

## 역할

{{description}}

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
{{#each fields}}
| {{name}} | {{type}} | {{constraints}} | {{default}} | {{description}} |
{{/each}}

## Enum

| Enum명 | 값 | 설명 |
|--------|-----|------|
{{#each enums}}
| {{name}} | {{values}} | {{description}} |
{{/each}}

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
{{#each relations}}
| {{relation}} | {{target}} | {{type}} | {{description}} |
{{/each}}

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
{{#each methods}}
| {{name}}() | {{returnType}} | {{description}} |
{{/each}}

## 비즈니스 규칙

{{#each businessRules}}
- {{this}}
{{/each}}

## 구현 체크리스트

- [ ] {{entityName}}.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Entity 인스턴스 생성 |
| **When** | 메서드 호출 |
| **Then** | 반환값 / 상태 확인 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
