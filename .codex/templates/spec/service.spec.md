# {{name}} Service 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: service
> 위치: packages/be-service/src/{{serviceName}}.ts

## 역할

{{description}}

## 담당 도메인

{{domain}}

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
{{#each dependencies}}
| {{type}} | {{target}} | {{purpose}} |
{{/each}}

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
{{#each methods}}
| {{name}} | {{params}} | {{returnType}} | {{description}} |
{{/each}}

## 비즈니스 규칙

{{#each businessRules}}
### {{ruleName}}

{{description}}

{{#if conditions}}
**조건:**
{{#each conditions}}
- {{this}}
{{/each}}
{{/if}}

{{/each}}

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
{{#each errors}}
| {{situation}} | {{code}} | {{message}} |
{{/each}}

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
{{#each permissions}}
| {{method}} | {{permission}} | {{checkMethod}} |
{{/each}}

## 구현 체크리스트

- [ ] {{serviceName}}.ts
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Mock Repository, 도메인 입력값 |
| **When** | 메서드 호출 |
| **Then** | 반환 Entity/VO, Repository 호출 횟수 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
