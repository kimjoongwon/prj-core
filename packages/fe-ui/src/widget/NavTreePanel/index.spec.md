# NavTreePanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/NavTreePanel/

## 역할

2depth 트리 구조의 네비게이션 UI를 표시하는 순수 UI 컴포넌트입니다. HeroUI Accordion으로 펼침/접힘 애니메이션을 제공합니다. Store에 접근하지 않으며 모든 데이터와 핸들러는 props로 전달받습니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (width: 240)
┌────────────────────────┐
│ ▼ [아이콘] 메뉴 A      │  ← 1depth 펼쳐진 항목
│    · 서브메뉴 A-1      │  ← 2depth 선택됨 (강조)
│    · 서브메뉴 A-2      │
│    · 서브메뉴 A-3      │
├────────────────────────┤
│ ▶ [아이콘] 메뉴 B      │  ← 1depth 접힌 항목
├────────────────────────┤
│ ▼ [아이콘] 메뉴 C      │  ← 1depth 펼쳐진 항목
│    · 서브메뉴 C-1      │
│    · 서브메뉴 C-2      │  ← 현재 활성 (강조)
└────────────────────────┘

서브메뉴 없는 항목 (leaf node)
┌────────────────────────┐
│   [아이콘] 단일 메뉴   │  ← 펼침 아이콘 없음
└────────────────────────┘

좁은 너비 (width: 60, 아이콘 전용)
┌──────┐
│  🏠  │  ← 아이콘만
│  📋  │
│  ⚙  │
└──────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (240px) | 아이콘 + 텍스트 + 펼침 화살표 2depth 트리 |
| 펼쳐진 항목 | Accordion 애니메이션으로 서브메뉴 표시 |
| 접힌 항목 | 1depth 항목만 표시 |
| 활성 항목 | 선택된 서브메뉴 배경 강조 |

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
| lucide-react 기반 로컬 helper | 아이콘 이름 문자열을 실제 Lucide 아이콘으로 렌더링 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | 전역 iconUtils 대신 파일 내부 Lucide helper 사용으로 정리 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
