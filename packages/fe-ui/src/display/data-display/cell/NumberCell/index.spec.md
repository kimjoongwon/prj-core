# NumberCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/display/data-display/cell/NumberCell/

## 역할

숫자를 천 단위 구분자(toLocaleString)와 함께 표시하는 Cell 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시:

┌──────────────────┐
│ 수량              │
├──────────────────┤
│ 1,234,567        │
├──────────────────┤
│ 1,000            │
├──────────────────┤
│ 42               │
├──────────────────┤
│ -                │  ← null/undefined/빈값
└──────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 정수 | `1,234,567` (천 단위 쉼표) |
| 소수 | `3,141.59` (소수점 유지) |
| 문자열 숫자 | `1,000` (Number 변환 후 포맷) |
| null / undefined | `-` (회색 placeholder) |

## Props

```typescript
interface NumberCellProps {
  /** 숫자 값 */
  value: number | string | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| `1234567` | 1,234,567 |
| `"1000"` (문자열) | 1,000 |
| `null` / `undefined` / `""` | - |
| NaN 변환 불가 | - |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
