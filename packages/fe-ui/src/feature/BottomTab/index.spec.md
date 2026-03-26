# BottomTab Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/BottomTab/

## 역할

모바일 환경에서 1depth 네비게이션 아이템을 하단 탭 바로 표시하는 Feature 컴포넌트입니다.
NavigationStore에서 네비게이션 아이템을 가져와 HeroUI Tabs 컴포넌트에 주입합니다.
최대 5개 아이템만 표시하며, 탭 선택 시 하위 메뉴 존재 여부를 부모에게 전달합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 모바일 화면 (하단 고정)
┌─────────────────────────────────────────┐
│                                         │
│           (페이지 콘텐츠 영역)           │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ BottomTab                               │
│                                         │
│  ┌──────┬──────┬──────┬──────┬──────┐  │
│  │  🏠  │  📋  │  👥  │  ⚙️  │  📊  │  │
│  │ 홈   │ 예약 │ 회원 │ 설정 │ 통계 │  │
│  │ [●]  │      │      │      │      │  │
│  └──────┴──────┴──────┴──────┴──────┘  │
└─────────────────────────────────────────┘

 탭 아이템 구조 (Tab 하나)
┌──────────┐
│    🏠    │  ← Lucide 아이콘
│  홈      │  ← 라벨
│  ━━━━   │  ← 활성 탭 인디케이터 (primary 색상)
└──────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 탭 바 정상 표시 | 최대 5개 탭 아이콘+라벨 렌더링 |
| 탭 활성 | 현재 선택된 탭 | 아이콘/라벨 primary 색상, 하단 인디케이터 표시 |
| 탭 비활성 | 선택되지 않은 탭 | 아이콘/라벨 default 색상 |
| 하위 메뉴 있음 | 하위 아이템을 가진 탭 선택 시 | onSelectTab(id, true) → SubMenuList 표시 |
| 하위 메뉴 없음 | 단독 아이템 탭 선택 시 | onSelectTab(id, false) → 바로 페이지 이동 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 네비게이션 아이템 및 선택 상태 관리 |
| UI Library | `@heroui/react` > `Tab`, `Tabs`, `cn` | 탭 UI 렌더링 |
| Library | `lucide-react` | Lucide 아이콘 문자열을 파일 내부 helper로 렌더링 |

## Props

```typescript
interface BottomTabProps {
  /** 탭 선택 시 콜백 (SubMenuList 표시 여부 결정용) */
  onSelectTab?: (navItemId: string, hasChildren: boolean) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| NavigationStore | `items` | 1depth 네비게이션 아이템 목록 조회 (최대 5개 표시) |
| NavigationStore | `selectedNavItem` | 현재 선택된 아이템 ID로 탭 활성 상태 표시 |
| NavigationStore | `findNavItemById(id)` | 탭 선택 시 해당 아이템 조회 |
| NavigationStore | `selectNavItem(id)` | 탭 선택 시 네비게이션 상태 업데이트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onSelectTab` | 탭(네비게이션 아이템) 선택 시 | navItemId와 hasChildren 여부 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Tabs` / `Tab` | HeroUI | 탭 바 UI 렌더링 |

## 구현 체크리스트

- [x] BottomTab.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] SSR 대응 (useIsMounted / useSyncExternalStore)
- [x] 최대 5개 아이템 제한

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | 전역 iconUtils 대신 파일 내부 Lucide helper 사용으로 정리 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
