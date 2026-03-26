# SideNav Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/SideNav/

## 역할

NavigationStore와 NavTreePanel Widget을 연결하는 사이드 네비게이션 Feature 컴포넌트입니다.
Store에서 네비게이션 데이터를 가져와 NavTreePanel에 주입하고, 사용자 인터랙션 핸들러를 정의합니다.
트리 구조의 네비게이션을 표시하며 아이템 펼침/접힘, 선택 기능을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 SideNav (기본 240px)
┌──────────────────────────┐
│ SideNav                  │
│                          │
│  NavTreePanel            │
│  ┌──────────────────┐    │
│  │ 🏠 홈            │    │  ← 1depth, 하위 없음 (선택 가능)
│  ├──────────────────┤    │
│  │ 📋 예약        ▼ │    │  ← 1depth, 펼침 상태 (하위 있음)
│  │   ├ 예약 목록    │    │  ← 2depth, 선택됨 (primary)
│  │   └ 예약 통계    │    │  ← 2depth, 비선택
│  ├──────────────────┤    │
│  │ 👥 회원        ▶ │    │  ← 1depth, 접힘 상태 (하위 있음)
│  ├──────────────────┤    │
│  │ ⚙️ 설정         ▼ │    │  ← 1depth, 펼침 상태
│  │   ├ 역할 관리    │    │
│  │   └ 권한 관리    │    │
│  └──────────────────┘    │
│                          │
└──────────────────────────┘

 아이템 상태별 표현
┌──────────────────────────┐
│  📋 예약        ▼        │  ← 펼침 (expandedKeys 포함)
│  📋 예약        ▶        │  ← 접힘 (expandedKeys 미포함)
│  ◼ 예약 목록             │  ← 2depth 활성 (primary 배경)
│    예약 통계             │  ← 2depth 비활성
└──────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 트리 네비게이션 표시 | 1depth 아이템 수직 나열, 하위 있으면 화살표 아이콘 |
| 아이템 펼침 | toggleNavItem 호출 후 | ▶ → ▼ 아이콘 변경, 2depth 아이템 표시 |
| 아이템 접힘 | toggleNavItem 재호출 | ▼ → ▶ 아이콘 변경, 2depth 아이템 숨김 |
| 1depth 선택 | 하위 없는 아이템 클릭 | primary 색상 강조, selectNavItem 호출 |
| 2depth 선택 | 하위 아이템 클릭 | primary 배경, selectSubNavItem 호출 |
| 활성 아이템 자동 펼침 | 현재 경로에 해당하는 아이템 | expandedKeys에 자동 포함 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 네비게이션 아이템 및 상태 관리 |
| Widget | `NavTreePanel` | 트리 구조 네비게이션 UI |

## Props

```typescript
interface SideNavProps {
  /** 사이드바 너비 (기본값: 240px) */
  width?: number;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| NavigationStore | `items` | 1depth 네비게이션 아이템 목록 |
| NavigationStore | `isNavItemExpanded(id)` | 아이템 펼침 상태 확인 |
| NavigationStore | `toggleNavItem(id)` | 아이템 펼침/접힘 토글 |
| NavigationStore | `selectNavItem(id)` | 1depth 아이템 선택 (하위 없는 경우) |
| NavigationStore | `selectSubNavItem(id)` | 2depth 하위 아이템 선택 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleToggle` | 아이템 펼침/접힘 토글 시 | NavigationStore를 통해 처리 |
| (내부) `handleSelectItem` | 단독 아이템 선택 시 | NavigationStore를 통해 처리 |
| (내부) `handleSelectSubItem` | 하위 아이템 선택 시 | NavigationStore를 통해 처리 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `NavTreePanel` | Widget | 트리 구조 네비게이션 UI 렌더링 |

## 구현 체크리스트

- [x] SideNav.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] expandedKeys 계산 (수동 토글 + 활성 아이템)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | 레이아웃 예시 표기를 `Page` 기준으로 정리 | codex |
