# FeeTable UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/FeeTable/

## 역할

요일/시간별 요금표를 표시하는 컴포넌트. 각 항목의 요일, 시간대, 요금을 표시하고, 선택적으로 총 합계를 표시한다.

## Props

```typescript
interface FeeItem {
  /** 요일 */
  day: string;
  /** 시간대 */
  time: string;
  /** 요금 */
  fee: number;
}

interface FeeTableProps {
  /** 요금 항목 목록 */
  items: FeeItem[];
  /** 총 요금 (표시하려면 제공) */
  total?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 내부 의존성

- `HStack` (수평 레이아웃)
- `VStack` (수직 레이아웃)
- `Text` (텍스트 표시)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). 내부 UI 컴포넌트만 사용.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
