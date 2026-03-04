# {{name}} Store 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: store
> 위치: packages/fe-store/src/stores/{{storeName}}.ts

## 역할

{{description}}

## 재사용성 판정 (Critical)

| 항목 | 내용 |
|------|------|
| 재사용 범위 | {{reusabilityScope}} |
| 공용 Store 필요성 | {{whySharedStore}} |
| 페이지 로컬 state 대체 불가 사유 | {{whyNotPageLocalState}} |

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
{{#each state}}
| {{name}} | {{type}} | {{initialValue}} | {{description}} |
{{/each}}

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
{{#each computed}}
| {{name}} | {{type}} | {{logic}} |
{{/each}}

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
{{#each actions}}
| {{name}} | {{params}} | {{description}} |
{{/each}}

## 비동기 액션 (Flow)

| 메서드 | 파라미터 | API 호출 | 성공 시 동작 |
|--------|----------|----------|--------------|
{{#each flows}}
| {{name}} | {{params}} | {{apiCall}} | {{onSuccess}} |
{{/each}}

## 의존 Store

| Store | 사용 방식 |
|-------|----------|
{{#each storeDependencies}}
| {{store}} | {{usage}} |
{{/each}}

## RootStore 연결

| 속성명 | 타입 |
|--------|------|
| {{camelCase storeName}} | {{storeName}} |

## 구현 체크리스트

- [ ] 공용 Store 재사용성 근거 확인 (2개 이상 페이지/도메인)
- [ ] {{storeName}}.ts
- [ ] RootStore에 등록
- [ ] 타입 정의
- [ ] 단위 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest

### 테스트 커버리지

| Action / Computed | Happy Path | Error Path | Edge Case | 합계 |
|-------------------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 초기 상태 설정 |
| **When** | Action 실행 |
| **Then** | 상태 변화 / Computed 값 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
