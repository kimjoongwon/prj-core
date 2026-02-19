# UserMenu Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/UserMenu/

## 역할

Header의 right 영역에 표시되는 사용자 메뉴 Feature 컴포넌트입니다.
AuthStore와 PersistStore를 연결하여 사용자 정보 표시 및 로그아웃 기능을 제공합니다.
Avatar를 클릭하면 드롭다운 메뉴가 열리며 프로필 정보와 로그아웃 옵션이 표시됩니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 상태별 UI를 ASCII로 표현합니다.

```
[닫힌 상태 - Header 우측 영역]

┌──────────────────────────────────────────────────────────────────┐
│  ... (다른 헤더 요소들)                          [👤 홍길동]    │
│                                                    ↑ Avatar 버튼 │
└──────────────────────────────────────────────────────────────────┘

[열린 상태 - 드롭다운 메뉴]

                                          ┌───────────────────────┐
                                          │  👤 홍길동            │
                                          │  MANAGE               │
                                          │─────────────────────── │
                                          │  🚪 로그아웃          │
                                          └───────────────────────┘
                                            ↑ Dropdown (floating)

[드롭다운 상세 구조]

┌───────────────────────────────┐
│  DropdownItem (profile, 비활성)│
│  ┌─────────────────────────┐  │
│  │  홍길동                 │  │
│  │  MANAGE (역할명)        │  │
│  └─────────────────────────┘  │
│  ─────────────────────────── │
│  DropdownItem (logout)        │
│  ┌─────────────────────────┐  │
│  │  🚪  로그아웃           │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| 기본 | 드롭다운 닫힘 | Avatar 버튼만 표시 |
| 열림 | 드롭다운 펼쳐짐 | Avatar + floating 드롭다운 메뉴 |
| 로딩 | 데이터 로드 중 | 스켈레톤 또는 스피너 |
| 로그아웃 중 | API 호출 중 | 로그아웃 버튼 비활성화 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | `@cocrepo/store` > `useAuthStore` | 로그아웃 처리 |
| Store | `@cocrepo/store` > `usePersistStore` | 영속 데이터 초기화 (Space 정보) |
| UI Library | `@heroui/react` > `Avatar`, `Dropdown`, `DropdownItem`, `DropdownMenu`, `DropdownTrigger` | 드롭다운 메뉴 UI |
| Util | `iconUtils` > `renderLucideIcon` | LogOut 아이콘 렌더링 |

## Props

```typescript
type UserMenuProps = {};
// Props 없음 (Store에서 직접 데이터를 가져옴)
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AuthStore | `logout()` | 로그아웃 처리 (OIDC end session) |
| PersistStore | `clearSpace()` | 로그아웃 시 영속 Space 데이터 초기화 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleLogout` | 로그아웃 메뉴 클릭 시 | PersistStore 초기화 + sessionStorage 정리 + AuthStore.logout() |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Avatar` | HeroUI | 사용자 아바타 (드롭다운 트리거) |
| `Dropdown` / `DropdownMenu` | HeroUI | 사용자 메뉴 드롭다운 |
| `DropdownItem` (profile) | HeroUI | 프로필 정보 표시 (이름, 역할) |
| `DropdownItem` (logout) | HeroUI | 로그아웃 버튼 |

## 구현 체크리스트

- [x] UserMenu.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] 로그아웃 흐름 (PersistStore + sessionStorage + AuthStore)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
