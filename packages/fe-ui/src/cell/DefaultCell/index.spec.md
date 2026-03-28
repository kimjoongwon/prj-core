# DefaultCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/DefaultCell/

## 역할

기본 텍스트/숫자 값을 표시하는 Cell 컴포넌트. 빈 값은 placeholder로 대체하고, mono/tone/truncate/lineClamp 같은 공통 표시 옵션을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
테이블 컬럼 내 표시 형태:

┌───────────────┬───────────────────┬──────────────┐
│ ID            │ 이름              │ 점수         │
├───────────────┼───────────────────┼──────────────┤
│ uuid-001      │ 홍길동            │ 95           │
├───────────────┼───────────────────┼──────────────┤
│ uuid-002      │ -                 │ 0            │
│               │ (빈 문자열)       │ (0은 표시됨) │
├───────────────┼───────────────────┼──────────────┤
│ uuid-003      │ 김철수            │ -            │
│               │                   │ (null)       │
└───────────────┴───────────────────┴──────────────┘

셀 내부 구조:

  홍길동       ← 유효한 문자열 (String(value) 결과)
  95           ← 유효한 숫자
  0            ← 숫자 0 (falsy지만 정상 표시)
  -            ← 빈 문자열 / null / undefined 등 falsy
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 유효한 문자열 | `홍길동` - 일반 텍스트 |
| 유효한 숫자 | `95` - 일반 텍스트 |
| 숫자 0 | `0` - 일반 텍스트 (예외적으로 표시) |
| 빈 값 | `-` - 일반 텍스트 |

## Props

```typescript
interface DefaultCellProps {
  /** 표시할 값 */
  value?: string | number | null;
  /** 빈 값일 때 대체 텍스트 */
  placeholder?: string;
  /** 모노스페이스 렌더링 여부 */
  mono?: boolean;
  /** 텍스트 크기 */
  size?: "sm" | "xs";
  /** 텍스트 톤 */
  tone?: "default" | "muted";
  /** 텍스트 굵기 */
  weight?: "normal" | "medium" | "semibold";
  /** 한 줄 말줄임 여부 */
  truncate?: boolean;
  /** line clamp 줄 수 */
  lineClamp?: 1 | 2;
  /** 숫자 정렬용 tabular-nums 적용 여부 */
  tabular?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** title 속성 */
  title?: string;
}
```

## 표시 규칙

| 값 | 표시 |
|---|---|
| 유효한 문자열/숫자 | `String(value)` |
| `0` | "0" (정상 표시) |
| 빈 문자열, null, undefined | placeholder (기본 `-`) |
| `mono=true` | `font-mono text-sm` 적용 |
| `truncate=true` | 한 줄 말줄임 |
| `lineClamp=1/2` | 줄 수 제한 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | 공통 텍스트 셀로 재사용할 수 있도록 placeholder/표시 옵션 계약을 확장 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
