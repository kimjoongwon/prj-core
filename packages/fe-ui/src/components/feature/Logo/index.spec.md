# AppLogo Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/Logo/

## 역할

Header의 left 영역에 표시되는 앱 로고 Feature 컴포넌트입니다.
NavigationStore와 연결하여 로고 클릭 시 첫 번째 네비게이션 아이템으로 이동합니다.
Lucide 아이콘과 텍스트를 조합하여 로고를 렌더링합니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 첫 번째 아이템으로 이동 |
| UI Library | `@heroui/react` > `Button`, `cn` | 로고 버튼 UI |
| Util | `iconUtils` > `renderLucideIcon` | Lucide 아이콘 렌더링 |

## Props

```typescript
interface AppLogoProps {
  /** 로고 아이콘 (Lucide 아이콘 이름, 기본값: "LayoutGrid") */
  icon?: string;
  /** 로고 텍스트 (기본값: "Admin") */
  text?: string;
  /** 추가 클래스명 */
  className?: string;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| NavigationStore | `items` | 첫 번째 네비게이션 아이템 조회 |
| NavigationStore | `selectNavItem(id)` | 로고 클릭 시 첫 번째 아이템 선택 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleClickLogo` | 로고 버튼 클릭 시 | NavigationStore를 통해 첫 번째 아이템으로 이동 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Button` | HeroUI | 로고 클릭 영역 (variant="light") |

## 구현 체크리스트

- [x] Logo.tsx (export name: AppLogo)
- [x] index.ts (re-export)
- [x] observer 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
