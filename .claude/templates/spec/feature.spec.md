# {{name}} Feature 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/{{componentName}}/

## 역할

{{description}}

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
{{#each dependencies}}
| {{type}} | {{target}} | {{purpose}} |
{{/each}}

## Props

```typescript
interface {{componentName}}Props {
{{#each props}}
  {{name}}: {{type}}; {{#if description}}// {{description}}{{/if}}
{{/each}}
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
{{#each storeConnections}}
| {{store}} | {{property}} | {{usage}} |
{{/each}}

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
{{#each events}}
| {{event}} | {{condition}} | {{propagate}} |
{{/each}}

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
{{#each childComponents}}
| {{name}} | {{type}} | `{{specPath}}` |
{{/each}}

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] Store 주입
- [ ] Props 타입 정의
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
