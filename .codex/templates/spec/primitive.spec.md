# {{name}} UI 컴포넌트 기획서

> 생성일: {{createdDate}}
> 수정일: {{modifiedDate}}
> 타입: ui
> 위치: packages/fe-ui/src/primitive/{{componentName}}/

## 역할

{{description}}

## 디자인 목업

> 컴포넌트의 변형(variant), 크기(size), 상태(state)별 시각적 모습을 ASCII로 표현합니다.

<!-- 버튼 변형 예시:
```
variant:
  [  Primary 버튼  ]   [  Secondary 버튼  ]   [  Danger 버튼  ]

size:
  [ sm ] [ md ] [   lg   ]

상태:
  [  기본  ]   [ hover → 밝아짐 ]   [ disabled → 회색 ]   [ loading → ⟳ ]
```
-->

<!-- 뱃지/태그 예시:
```
상태 뱃지:
  ● 활성   ○ 비활성   ⊘ 삭제됨   ⏳ 대기중

색상 변형:
  [primary]  [success]  [warning]  [danger]  [default]

크기:
  [·sm] [· md] [·  lg  ]
```
-->

<!-- 입력 필드 예시:
```
기본:
  ┌────────────────────────────────┐
  │ placeholder 텍스트             │
  └────────────────────────────────┘

포커스:
  ┌────────────────────────────────┐  ← 테두리 강조
  │ 입력 중인 텍스트               │
  └────────────────────────────────┘

에러:
  ┌────────────────────────────────┐  ← 빨간 테두리
  │ 잘못된 입력값                  │
  └────────────────────────────────┘
  ⚠ 필수 입력 항목입니다.

비활성:
  ┌────────────────────────────────┐  ← 회색 배경
  │ 비활성 상태                    │
  └────────────────────────────────┘
```
-->

<!-- 카드/모달 예시:
```
┌────────────────────────────────────┐
│ 카드 제목                      [×] │
├────────────────────────────────────┤
│                                    │
│  [슬롯: children]                  │
│                                    │
├────────────────────────────────────┤
│              [취소]  [확인]         │
└────────────────────────────────────┘
```
-->

```
{{mockup}}
```

## Props

```typescript
interface {{componentName}}Props {
{{#each props}}
  {{name}}: {{type}}; {{#if description}}// {{description}}{{/if}}
{{/each}}
}
```

## 상태

| 상태 | 스타일 |
|------|--------|
{{#each states}}
| {{state}} | {{style}} |
{{/each}}

## 변형 (Variants)

| 변형 | 설명 | 사용 예시 |
|------|------|----------|
{{#each variants}}
| {{variant}} | {{description}} | {{example}} |
{{/each}}

## 크기 (Sizes)

| 크기 | 값 |
|------|-----|
{{#each sizes}}
| {{size}} | {{value}} |
{{/each}}

## 접근성

{{#each accessibility}}
- [ ] {{this}}
{{/each}}

## HeroUI 매핑

{{#if herouiBase}}
기반: `import { {{herouiBase}} } from '@heroui/react'`
{{else}}
순수 구현 (HeroUI 기반 없음)
{{/if}}

## 구현 체크리스트

- [ ] index.tsx
- [ ] types.ts
- [ ] Storybook 스토리
- [ ] 접근성 테스트
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
| **Given** | 사전 조건 (props, 상태 등) |
| **When** | 실행 동작 (render, click, input 등) |
| **Then** | 기대 결과 (화면 상태, 스타일 적용 등) |

## 상위 기획서

{{#if parentSpec}}
- `{{parentSpec}}`
{{/if}}

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| {{createdDate}} | 초기 생성 | {{author}} |
