# {{name}} VO 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: vo
> 위치: packages/be-vo/src/{{domain}}/{{name}}.vo.ts

## 역할

{{description}}

## Props

| 필드 | 타입 | 설명 |
|------|------|------|
{{#each props}}
| {{name}} | {{type}} | {{description}} |
{{/each}}

## 유효성 규칙

| 규칙 | 에러 메시지 |
|------|------------|
{{#each validationRules}}
| {{condition}} | "{{errorMessage}}" |
{{/each}}

## 팩토리 메서드

| 메서드 | 파라미터 | 설명 |
|--------|----------|------|
{{#each factoryMethods}}
| {{name}}({{params}}) | {{paramTypes}} | {{description}} |
{{/each}}

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
{{#each domainMethods}}
| {{name}}() | {{returnType}} | {{description}} |
{{/each}}

## 구현 체크리스트

- [ ] {{name}}.vo.ts
- [ ] ValueObject 상속
- [ ] validate() 구현
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 규칙 / 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 입력값 |
| **When** | 팩토리 메서드 호출 또는 validate 실행 |
| **Then** | 성공 반환 또는 VoValidationError |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
