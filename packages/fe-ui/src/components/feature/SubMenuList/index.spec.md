# SubMenuList Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/SubMenuList/

## 역할

모바일 환경에서 선택된 1depth 아이템의 2depth 하위 아이템을 전체 화면 리스트로 표시하는 Feature 컴포넌트입니다.
NavigationStore에서 현재 선택된 아이템의 subNavItems를 가져와 수직 리스트로 렌더링합니다.
하위 아이템이 없거나 선택된 아이템이 없으면 렌더링하지 않습니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 하위 네비게이션 아이템 조회 및 선택 |
| UI Library | `@heroui/react` > `cn` | 조건부 클래스 적용 |
| Pure UI | `VStack` | 하위 아이템 수직 정렬 |

## Props

```typescript
interface SubMenuListProps {
  /** 하위 아이템 클릭 시 콜백 */
  onSelectSubNavItem?: (subNavItemId: string) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| NavigationStore | `subNavItems` | 현재 선택된 1depth의 2depth 하위 아이템 목록 |
| NavigationStore | `selectedNavItem` | 현재 선택된 1depth 아이템 확인 |
| NavigationStore | `selectSubNavItem(id)` | 2depth 아이템 클릭 시 선택 상태 업데이트 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onSelectSubNavItem` | 하위 아이템 클릭 시 | subNavItemId 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `VStack` | Pure UI | 하위 아이템 수직 배치 |
| `button` | HTML | 클릭 가능한 하위 메뉴 버튼 |

## 구현 체크리스트

- [x] SubMenuList.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] SSR 대응 (useIsMounted / useSyncExternalStore)
- [x] 전체 화면 오버레이 (fixed inset-0, md:hidden)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
