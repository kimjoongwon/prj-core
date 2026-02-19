# {{name}} 페이지 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: page
> 경로: {{route}}

## 사용자 시나리오

{{#each scenarios}}
{{@index + 1}}. {{this}}
{{/each}}

## 레이아웃 구성

| 영역 | 컴포넌트 | 기획서 |
|------|----------|--------|
{{#each layoutComponents}}
| {{area}} | {{component}} | `{{specPath}}` |
{{/each}}

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
{{#each pageStates}}
| {{state}} | {{description}} | {{ui}} |
{{/each}}

## API 호출

| 시점 | API | 캐싱 |
|------|-----|------|
{{#each apiCalls}}
| {{timing}} | {{api}} | {{caching}} |
{{/each}}

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
{{#each eventHandlers}}
| {{event}} | {{action}} |
{{/each}}

## 구현 체크리스트

- [ ] page.tsx (서버 컴포넌트)
- [ ] _client.tsx (클라이언트 컴포넌트)
- [ ] _prefetch.ts (데이터 프리페치)
- [ ] hooks/useHandlers.ts (필요시)
- [ ] E2E 테스트 (Playwright)

## 테스트 케이스

> 구현 도구: Playwright (E2E)

### 테스트 커버리지

| 시나리오 | Happy Path | Error Path | Edge Case | 합계 |
|---------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 사전 조건 |
| **When** | 실행 동작 |
| **Then** | 기대 결과 |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
