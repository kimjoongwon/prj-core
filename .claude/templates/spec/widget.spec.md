# {{name}} Widget 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/{{componentName}}/

## 역할

{{description}}

## Props

```typescript
interface {{componentName}}Props {
{{#each props}}
  {{name}}: {{type}}; {{#if description}}// {{description}}{{/if}}
{{/each}}
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
{{#each childComponents}}
| {{name}} | `{{specPath}}` | {{role}} |
{{/each}}

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
{{#each slots}}
| {{name}} | {{description}} |
{{/each}}

## 디자인 토큰

| 항목 | 값 |
|------|-----|
{{#each designTokens}}
| {{item}} | {{value}} |
{{/each}}

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts (필요시)
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|

### [TC-001] 테스트명

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 사전 조건 (props, store 상태 등) |
| **When** | 실행 동작 (render, click, input 등) |
| **Then** | 기대 결과 (화면 상태, 이벤트 발생 등) |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
