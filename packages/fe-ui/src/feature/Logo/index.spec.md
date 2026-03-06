# AppLogo Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/Logo/

## 역할

Header의 left 영역에 표시되는 앱 로고 Feature 컴포넌트입니다.
NavigationStore와 연결하여 로고 클릭 시 첫 번째 네비게이션 아이템으로 이동합니다.
Lucide 아이콘과 텍스트를 조합하여 로고를 렌더링합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
 헤더 내 Logo 위치
┌──────────────────────────────────────────────────────────────┐
│ Header                                                       │
│  [Logo]    [Nav 메뉴]    [SpaceSelector ▼]   [UserMenu 👤]  │
└──────────────────────────────────────────────────────────────┘

 Logo 컴포넌트 상세
┌──────────────────┐
│  [⊞]  Admin      │  ← Button (variant="light")
│   아이콘  텍스트  │
└──────────────────┘

 icon="LayoutGrid", text="Admin" (기본값)
┌──────────────────┐
│  ⊞  Admin        │
└──────────────────┘

 icon="Layers", text="Core" (커스텀)
┌──────────────────┐
│  ≡  Core         │
└──────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 로고 정상 표시 | 아이콘 + 텍스트 수평 배치 |
| 호버 | 마우스 오버 시 | Button light variant 호버 효과 |
| 클릭 | 로고 클릭 시 | NavigationStore의 첫 번째 아이템으로 이동 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useNavigationStore` | 첫 번째 아이템으로 이동 |
| UI Library | `@heroui/react` > `Button`, `cn` | 로고 버튼 UI |
| Library | `lucide-react` | Lucide 아이콘 문자열을 파일 내부 helper로 렌더링 |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | 전역 iconUtils 대신 파일 내부 Lucide helper 사용으로 정리 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
