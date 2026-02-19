# FloatingActionButton Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/FloatingActionButton/

## 역할

화면에 고정되어 주요 액션을 제공하는 플로팅 액션 버튼(FAB)입니다. 뱃지, 펄스 애니메이션, 키보드 단축키 힌트를 지원합니다.

## Props

```typescript
interface FloatingActionButtonProps {
  onPress: () => void;
  icon: ReactNode;
  hoverIcon?: ReactNode;
  tooltip?: string;
  badgeCount?: number;          // 기본값: 0
  showPulse?: boolean;          // 기본값: true
  shortcutHint?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";  // 기본값: "bottom-right"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Button | 둥근 FAB 버튼 |
| HeroUI Tooltip | 호버 시 툴팁 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| icon | 메인 아이콘 (ReactNode) |
| hoverIcon | 호버 시 보조 아이콘 (ReactNode) |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
