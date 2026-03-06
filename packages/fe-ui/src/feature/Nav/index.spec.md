# Nav Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/Nav/

## 역할

Header의 center 영역에 표시되는 수평 네비게이션 Feature 컴포넌트입니다.
NavigationStore에서 1depth 아이템 목록을 가져와 수평 버튼으로 렌더링합니다.
활성 아이템은 primary 색상으로 강조 표시됩니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 헤더 내 Nav 위치
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
│  [Logo]    [Nav 메뉴]    [SpaceSelector ▼]   [UserMenu 👤]  │
└──────────────────────────────────────────────────────────────┘

 Nav 컴포넌트 상세 (수평 네비게이션)
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   [🏠 홈]   [📋 예약]   [👥 회원]   [⚙️ 설정]   [📊 통계]  │
│    ━━━━━━━                                                  │
│   (활성 - primary 색상 + 하단 인디케이터)                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘

 NavbarItem 하나 상세 (활성)           (비활성)
┌──────────────────┐               ┌──────────────────┐
│  🏠  홈          │               │  📋  예약         │
│  ━━━━━━━━━━      │  ← primary    │                  │  ← default
└──────────────────┘               └──────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 네비게이션 정상 표시 | 1depth 아이템 수평 나열 |
| 활성 아이템 | 선택된 아이템 | primary 색상 텍스트/아이콘, 하단 인디케이터 표시 |
| 비활성 아이템 | 선택되지 않은 아이템 | default 색상 텍스트/아이콘 |
| 아이템 클릭 | 버튼 클릭 시 | NavigationStore.selectNavItem() 호출, 페이지 이동 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 네비게이션 아이템 및 선택 상태 관리 |
| UI Library | `@heroui/react` > `NavbarItem`, `cn` | 네비게이션 아이템 UI |
| Library | `lucide-react` | Lucide 아이콘 문자열을 파일 내부 helper로 렌더링 |

## Props

```typescript
// Props 없음 (Store에서 직접 데이터를 가져옴)
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| NavigationStore | `items` | 1depth 네비게이션 아이템 목록 조회 |
| NavigationStore | `selectNavItem(id)` | 아이템 클릭 시 선택 상태 업데이트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleClickNavItem` | 네비게이션 아이템 클릭 시 | NavigationStore를 통해 처리 (부모 전달 없음) |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `NavbarItem` | HeroUI | 네비게이션 아이템 래퍼 |
| `button` | HTML | 클릭 가능한 네비게이션 버튼 |

## 구현 체크리스트

- [x] Nav.tsx
- [x] index.ts (re-export)
- [x] observer 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | 전역 iconUtils 대신 파일 내부 Lucide helper 사용으로 정리 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
