# Nav Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/Nav/

## 역할

Header의 center 영역에 표시되는 수평 네비게이션 Feature 컴포넌트입니다.
NavigationStore에서 1depth 아이템 목록을 가져와 수평 버튼으로 렌더링합니다.
활성 아이템은 primary 색상으로 강조 표시됩니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 네비게이션 아이템 및 선택 상태 관리 |
| UI Library | `@heroui/react` > `NavbarItem`, `cn` | 네비게이션 아이템 UI |
| Util | `iconUtils` > `renderLucideIcon` | Lucide 아이콘 렌더링 |

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
