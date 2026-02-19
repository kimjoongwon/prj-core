# NavTreePanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/NavTreePanel/

## 역할

2depth 트리 구조의 네비게이션 UI를 표시하는 순수 UI 컴포넌트입니다. HeroUI Accordion으로 펼침/접힘 애니메이션을 제공합니다. Store에 접근하지 않으며 모든 데이터와 핸들러는 props로 전달받습니다.

## Props

```typescript
interface NavTreePanelProps {
  items: NavTreeItem[];           // NavItem 타입 기반
  expandedKeys: Set<string>;
  onToggle: (id: string) => void;
  onSelectItem: (id: string) => void;
  onSelectSubItem: (id: string) => void;
  width?: number;                 // 기본값: 240
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Accordion/AccordionItem | 2depth 트리 펼침/접힘 |
| VStack | 하위 아이템 목록 레이아웃 |
| renderLucideIcon | 아이콘 렌더링 유틸 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
