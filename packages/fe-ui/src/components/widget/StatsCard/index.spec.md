# StatsCard Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/StatsCard/

## 역할

통계 정보를 카드 형태로 표시합니다. 아이콘, 색상 테마, 증감 표시, 부가 설명을 지원합니다.

## Props

```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: ReactNode;
  color?: "default" | "primary" | "success" | "warning" | "danger";  // 기본값: "default"
  description?: string;
  change?: { value: number; type: "increase" | "decrease" };
  onPress?: () => void;
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Card/CardBody | 카드 컨테이너 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| icon | 통계 아이콘 (ReactNode) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
