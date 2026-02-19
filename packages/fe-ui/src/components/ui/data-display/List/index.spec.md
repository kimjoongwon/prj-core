# List UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/List/

## 역할

데이터 배열을 리스트로 렌더링하는 유틸리티 컴포넌트. 세로/가로 배치, 빈 상태 플레이스홀더를 지원한다.

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
