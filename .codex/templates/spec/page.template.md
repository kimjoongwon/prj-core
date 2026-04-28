# {{name}} 페이지 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: {{type}}
> 경로: {{route}}
> 위치: {{sourcePath}}

## 화면 목적

{{description}}

## 사용자 시나리오

{{#each scenarios}}
{{@index + 1}}. {{this}}
{{/each}}

## Route / Page Mapping

| 항목 | 값 |
|------|----|
| route path | `{{route}}` |
| route page | `{{routePagePath}}` |
| pure page component | `{{pageComponentPath}}` |
| page role | `{{pageRole}}` |
| reusable target | `{{reusableTarget}}` |
| SSR/prefetch 예외 | `{{ssrPrefetchException}}` |

## 화면 구성

| 영역 | owner | 설명 |
|------|-------|------|
{{#each layoutComponents}}
| {{area}} | {{component}} | {{description}} |
{{/each}}

## 데이터 / API

| 시점 | 소유자 | API 또는 데이터 | 전달 대상 |
|------|--------|----------------|-----------|
{{#each apiCalls}}
| {{timing}} | {{owner}} | {{api}} | {{target}} |
{{/each}}

## 상태와 이벤트

| 항목 | 소유자 | 설명 |
|------|--------|------|
{{#each pageStates}}
| {{state}} | {{owner}} | {{description}} |
{{/each}}

| 이벤트 | 핸들러 | 결과 |
|--------|--------|------|
{{#each eventHandlers}}
| {{event}} | {{handler}} | {{action}} |
{{/each}}

## Surface / UX 상태

| 항목 | 결정 |
|------|------|
| Surface owner | {{surfaceOwner}} |
| loading | {{loadingState}} |
| error | {{errorState}} |
| empty | {{emptyState}} |
| disabled/readOnly | {{disabledState}} |

## Create/Update 폼 계약 (해당 시)

| 항목 | 설명 |
|------|------|
| `defaultObject` | Controller가 제공하는 submit DTO shape 초기값 |
| `options` | state path 기준 선택 옵션 |
| `ui.readOnlyPaths` | 읽기 전용 경로 |
| `ui.hiddenPaths` | 숨김 경로 |
| `ui.disabledPaths` | 비활성 경로 |
| `fieldMeta[path].ai.fillable` | AI 채움 가능 여부 |
| `aiSchemas` | AI 채움 스키마 목록 |

## 테스트 관점

| ID | 분류 | Given | When | Then |
|----|------|-------|------|------|
{{#each testCases}}
| {{id}} | {{type}} | {{given}} | {{when}} | {{then}} |
{{/each}}

## 구현 체크리스트

- [ ] route `page.tsx`는 데이터 조회, 라우팅, 이벤트 wiring만 소유
- [ ] pure page component는 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`에 위치
- [ ] route page handler는 `on[Event][UI]` 이름 사용
- [ ] Page/Feature/Widget 조합 책임이 화면 목적과 일치
- [ ] 신규 `layout.spec.md`, story/test/e2e spec을 만들지 않음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
