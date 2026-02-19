# FloatingActionButton Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/FloatingActionButton/

## 역할

화면에 고정되어 주요 액션을 제공하는 플로팅 액션 버튼(FAB)입니다. 뱃지, 펄스 애니메이션, 키보드 단축키 힌트를 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (position: bottom-right)
┌────────────────────────────────────┐
│                                    │
│                                    │
│                               ●●   │  ← showPulse 애니메이션
│                            ╔═════╗ │
│                            ║  ✏  ║ │  ← icon
│                            ╚═════╝ │
└────────────────────────────────────┘

뱃지 있는 상태 (badgeCount > 0)
                             ┌──┐
                          ┌─3─┤
                          │   │
                       ╔══╧════╗
                       ║   ✏   ║
                       ╚═══════╝

호버 시 툴팁 + hoverIcon
                       ╔═══════╗
                       ║   ➕   ║  ← hoverIcon
                       ╚═══╤═══╝
                    ┌──────┴───────┐
                    │ 새 항목 추가  │  ← tooltip
                    │  ⌘ + N      │  ← shortcutHint
                    └─────────────┘

position 변형
┌────────────────────────────────────┐
│ ╔═══╗                    ╔═══╗    │  top-left / top-right
│ ║ ✏ ║                    ║ ✏ ║    │
│ ╚═══╝                    ╚═══╝    │
│                                    │
│ ╔═══╗                    ╔═══╗    │  bottom-left / bottom-right
│ ║ ✏ ║                    ║ ✏ ║    │
│ ╚═══╝                    ╚═══╝    │
└────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 둥근 FAB + 펄스 애니메이션 |
| 뱃지 있음 | FAB 우상단에 숫자 뱃지 표시 |
| 호버 | hoverIcon 교체 + 툴팁 표시 |
| 단축키 힌트 | 툴팁 하단에 `⌘ + N` 등 표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
