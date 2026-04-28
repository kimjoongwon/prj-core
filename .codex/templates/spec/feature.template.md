# {{name}} Feature 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: feature
> 위치: packages/fe-ui/src/feature/{{componentName}}/{{componentName}}.tsx

## 역할

{{description}}

## 사용 화면

| Page | 경로 | 사용 목적 |
|------|------|-----------|
{{#each pages}}
| {{pageName}} | `{{pagePath}}` | {{purpose}} |
{{/each}}

## 책임 경계

| 구분 | 이 Feature가 소유 | 소유하지 않음 |
|------|-------------------|---------------|
| 상태 | {{ownedState}} | {{externalState}} |
| 데이터 | {{ownedData}} | {{externalData}} |
| 라우팅 | {{ownedRouting}} | {{externalRouting}} |
| 시각 조합 | {{ownedComposition}} | {{externalComposition}} |

## Props

```typescript
interface {{componentName}}Props {
{{#each props}}
  {{name}}: {{type}};{{#if description}} // {{description}}{{/if}}
{{/each}}
}
```

## Store / API / Router 연결

| 타입 | 대상 | 사용 방식 |
|------|------|-----------|
{{#each dependencies}}
| {{type}} | {{target}} | {{purpose}} |
{{/each}}

## 상태와 이벤트

| 상태 | 출처 | UI 반영 |
|------|------|---------|
{{#each states}}
| {{name}} | {{source}} | {{ui}} |
{{/each}}

| 이벤트 | 핸들러 | 결과 |
|--------|--------|------|
{{#each events}}
| {{event}} | {{handler}} | {{result}} |
{{/each}}

## 하위 UI 계약

| 컴포넌트 | 타입 | 주입 값 |
|----------|------|---------|
{{#each childComponents}}
| {{name}} | {{type}} | {{props}} |
{{/each}}

## UX 상태

| 상태 | 표시/동작 |
|------|-----------|
| loading | {{loadingState}} |
| error | {{errorState}} |
| empty | {{emptyState}} |
| disabled/readOnly | {{disabledState}} |
| permission denied | {{permissionState}} |

## AiForm 계약 (해당 시)

| 항목 | 설명 |
|------|------|
| `fieldMeta[path].ai.fillable` | AI 채움 가능 경로 |
| `aiSchemas` | 스키마 선택 목록 |
| `uiPaths` | hidden/readOnly/disabled 경로 |
| `onFill` | 선택 경로 기반 AI 채우기 실행 |
| `applyPatch` | 허용 path에 한해 patch 적용 |

## 테스트 관점

| ID | 분류 | Given | When | Then |
|----|------|-------|------|------|
{{#each testCases}}
| {{id}} | {{type}} | {{given}} | {{when}} | {{then}} |
{{/each}}

## 구현 체크리스트

- [ ] Feature component source와 같은 이름의 `.spec.md` 사용
- [ ] barrel `index.ts`, `type.ts`, hook에는 별도 spec을 만들지 않음
- [ ] Store/API/router 연결 책임이 명확함
- [ ] Widget/UI에는 props로만 값과 이벤트를 주입함
- [ ] loading/error/empty/permission 상태가 정의됨

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
