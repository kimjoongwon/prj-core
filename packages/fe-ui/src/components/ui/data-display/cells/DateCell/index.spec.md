# DateCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/DateCell/

## 역할

날짜를 초 단위까지 포함한 형식(YYYY-MM-DD HH:mm:ss)으로 표시하는 Cell 컴포넌트. `@cocrepo/toolkit`의 `formatDateTimeWithSeconds`를 사용한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌───────────────┬─────────────────────┬─────────────┐
│ 항목명        │ 등록일 (초 포함)    │ 상태        │
├───────────────┼─────────────────────┼─────────────┤
│ 설정 A        │ 2024-01-15 10:30:45 │ 활성        │
├───────────────┼─────────────────────┼─────────────┤
│ 설정 B        │ 2024-03-22 08:05:00 │ 비활성      │
├───────────────┼─────────────────────┼─────────────┤
│ 설정 C        │         -           │ 비활성      │
└───────────────┴─────────────────────┴─────────────┘

셀 내부 구조:

  2024-01-15 10:30:45   ← formatDateTimeWithSeconds() 결과 (일반 텍스트)
  -                     ← null / undefined 인 경우
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 유효한 날짜 | `2024-01-15 10:30:45` - 초 단위까지 포함한 텍스트 |
| 없음 (`null` / `undefined`) | `-` - 일반 텍스트 |

## Props

```typescript
interface DateCellProps {
  /** 날짜 값 (ISO 문자열 또는 Date 객체) */
  value: string | Date | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| ISO 문자열 | `formatDateTimeWithSeconds()` 결과 (예: 2024-01-15 10:30:45) |
| `null` / `undefined` | - |

## 의존성

- `@cocrepo/toolkit` - `formatDateTimeWithSeconds`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
