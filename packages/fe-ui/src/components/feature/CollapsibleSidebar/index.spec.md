# CollapsibleSidebar Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/CollapsibleSidebar/

## 역할

접힘/펼침이 가능한 사이드바 레이아웃 컴포넌트입니다.
상위 메뉴 정보(아이콘, 이름, 경로)를 헤더에 표시하고, children으로 전달된 네비게이션 아이템을 내부에 렌더링합니다.
접힌 상태에서는 20px, 펼쳐진 상태에서는 288px(w-72) 너비로 전환됩니다.

> 참고: 이 컴포넌트는 Store에 직접 연결하지 않고 props로 상태를 받는 Presentational Feature입니다.
> 실제 파일명은 `CollapsibleSidebarLayout.tsx`입니다. index.ts는 존재하지 않습니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 펼쳐진 상태 (288px)         접힌 상태 (20px)
┌────────────────────┐       ┌──┐
│ CollapsibleSidebar │       │  │
│                    │       │  │
│ ┌────────────────┐ │       │  │
│ │ 🏠 대시보드  ❮ │ │       │❯ │  ← 토글 버튼
│ └────────────────┘ │       │  │
│  (parentMenuInfo)  │       │  │
│                    │       │  │
│  children 영역:    │       │  │
│  ─────────────     │       │  │
│  📋 예약 목록      │       │  │
│  👥 회원 관리      │       │  │
│  ⚙️  설정          │       │  │
│                    │       │  │
└────────────────────┘       └──┘

 헤더 영역 상세 (parentMenuInfo)
┌────────────────────────────────┐
│  [🏠]  대시보드          [❮]  │
│   아이콘  name          토글  │
└────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 펼쳐진 상태 | isCollapsed=false | 너비 288px, 텍스트/children 표시, ❮ 아이콘 |
| 접힌 상태 | isCollapsed=true | 너비 20px, 텍스트/children 숨김, ❯ 아이콘 |
| 토글 애니메이션 | onToggle 호출 시 | transition-all duration-300 전환 |
| parentMenuInfo 없음 | prop이 null인 경우 | 헤더 영역 미렌더링 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| UI Library | `@heroui/react` > `Button` | 접힘/펼침 토글 버튼 |
| Widget | `VStack` | 네비게이션 아이템 수직 정렬 |
| Util | `iconUtils` > `renderLucideIcon` | Lucide 아이콘 렌더링 |

## Props

```typescript
interface ParentMenuInfo {
  name: string;
  pathname: string;
  icon?: string;
}

interface CollapsibleSidebarProps {
  /** 사이드바 내부 컨텐츠 */
  children: React.ReactNode;
  /** 상위 메뉴 정보 (아이콘, 이름, 경로) */
  parentMenuInfo?: ParentMenuInfo | null;
  /** 접힌 상태 여부 */
  isCollapsed: boolean;
  /** 접힘/펼침 토글 핸들러 */
  onToggle: () => void;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | Props 기반 Presentational 컴포넌트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onToggle` | 접힘/펼침 토글 버튼 클릭 시 | 부모에서 isCollapsed 상태 전환 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Button` | HeroUI | 토글 버튼 (ChevronLeft/ChevronRight 아이콘) |
| `VStack` | Pure UI | children 수직 배치 |

## 구현 체크리스트

- [x] CollapsibleSidebarLayout.tsx
- [ ] observer 적용 (현재 일반 함수 컴포넌트)
- [x] Props 타입 정의
- [x] 접힘/펼침 애니메이션 (transition-all duration-300)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
