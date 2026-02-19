# List UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/List/

## 역할

데이터 배열을 리스트로 렌더링하는 유틸리티 컴포넌트. 세로/가로 배치, 빈 상태 플레이스홀더를 지원한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[ 세로 목록 (horizontal=false, 기본) ]

┌──────────────────────┐
│  아이템 1             │
├──────────────────────┤
│  아이템 2             │
├──────────────────────┤
│  아이템 3             │
└──────────────────────┘


[ 가로 목록 (horizontal=true) ]

┌────────┬────────┬────────┬────────┐
│ 아이템1 │ 아이템2 │ 아이템3 │ 아이템4 │  → 가로 스크롤 (overflowX: auto)
└────────┴────────┴────────┴────────┘


[ 빈 상태 (data=[], placeholder 있음) ]

┌──────────────────────────────────┐
│                                  │
│     [ 데이터가 없습니다. ]         │  ← placeholder 렌더링
│                                  │
└──────────────────────────────────┘


[ 빈 상태 (data=[], placeholder 없음) ]

  (아무것도 렌더링되지 않음 - null 반환)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 세로 목록 | flex-direction: column 배치 |
| 가로 목록 | flex-direction: row + 가로 스크롤 |
| 빈 상태 (placeholder) | placeholder 컴포넌트 표시 |
| 빈 상태 (no placeholder) | null (렌더링 없음) |

## Props

```typescript
interface ListProps<T> {
  /** 렌더링할 데이터 배열 */
  data: T[];
  /** 각 아이템 렌더링 함수 */
  renderItem: (item: T, index: number) => ReactNode;
  /** 가로 배치 여부 @default false */
  horizontal?: boolean;
  /** 컨테이너 CSS 클래스 */
  className?: string;
  /** 빈 상태일 때 표시할 콘텐츠 */
  placeholder?: ReactNode;
  /** 아이템 간 간격 @default "0.5rem" */
  gap?: number | string;
  /** 각 아이템 래퍼 CSS 클래스 */
  itemClassName?: string;
}
```

## 상태

| 상태 | 동작 |
|------|------|
| data.length === 0 + placeholder 있음 | placeholder 렌더링 |
| data.length === 0 + placeholder 없음 | null 반환 |
| horizontal=true | flex-direction: row, overflowX: auto |
| horizontal=false | flex-direction: column |

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
