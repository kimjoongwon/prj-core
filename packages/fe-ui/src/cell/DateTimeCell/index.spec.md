# DateTimeCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/DateTimeCell/

## 역할

날짜와 시간을 초 단위 제외 형식(YYYY-MM-DD HH:mm)으로 표시하는 Cell 컴포넌트. `@cocrepo/toolkit`의 `formatDateTime`을 사용한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌───────────────┬──────────────────┬─────────────┐
│ 항목명        │ 등록일           │ 상태        │
├───────────────┼──────────────────┼─────────────┤
│ 설정 A        │ 2024-01-15 10:30 │ 활성        │
├───────────────┼──────────────────┼─────────────┤
│ 설정 B        │ 2024-03-22 08:05 │ 비활성      │
├───────────────┼──────────────────┼─────────────┤
│ 설정 C        │        -         │ 비활성      │
└───────────────┴──────────────────┴─────────────┘

셀 내부 구조:

  2024-01-15 10:30   ← formatDateTime() 결과 (초 제외, 일반 텍스트)
  -                  ← null / undefined 인 경우
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 유효한 날짜 | `2024-01-15 10:30` - 분 단위까지 포함한 텍스트 |
| 없음 (`null` / `undefined`) | `-` - 일반 텍스트 |

## Props

```typescript
interface DateTimeCellProps {
  /** 날짜/시간 값 (ISO 문자열 또는 Date 객체) */
  value: string | Date | null | undefined;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| ISO 문자열 | `formatDateTime()` 결과 (예: 2024-01-15 10:30) |
| `null` / `undefined` | - |

## 의존성

- `@cocrepo/toolkit` - `formatDateTime`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
