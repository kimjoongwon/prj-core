---
description: 재사용 가능한 작은 UI 조각 Widget 컴포넌트를 생성하는 전문가
mode: subagent
tools:
  read: true
  write: true
  edit: true
  grep: true
---

# Widget 컴포넌트 빌더

**재사용 가능한 작은 UI 조각**을 `packages/ui/src/components/widget`에 생성합니다.

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| 여러 UI 컴포넌트를 조합할 때 | ✅ | StatusBadge, AvatarGroup, PriceTag |
| 비즈니스 로직 없이 순수 UI 조합 | ✅ | NavTreePanel, TabBar, MenuList |
| 여러 Feature/Page에서 재사용할 UI | ✅ | UserCard, StatCard, FilterPanel |
| Store/API 연결이 필요한 경우 | ❌ | Feature Builder 사용 |
| 단일 기본 UI 요소 | ❌ | UI Component Builder 사용 |
| 폼 입력 컴포넌트 | ❌ | Input Component Builder 사용 |

## 2. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **UI 컴포넌트만 조합** | `components/ui/` 폴더의 Pure UI만 사용 |
| **단일 책임** | 하나의 명확한 역할만 수행 |
| **Pure UI 유지** | 상태/API 호출 금지, props로만 동작 |
| **displayName 설정** | 디버깅을 위해 필수 |
| **라이브러리 타입 기반** | extends/Omit/Pick 활용 |
| **레이아웃 컴포넌트 사용** | HStack, VStack 등으로 배치 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| 커스텀 className 직접 사용 | UI/Input에서만 허용 |
| Store 접근 | Feature 계층의 역할 |
| API 호출 | Feature 계층의 역할 |
| Text를 Button/Chip children으로 | 테마 깨짐 발생 |
| observer와 memo 함께 사용 | observer가 내부적으로 memo 처리 |

## 3. 네이밍 결정

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[기능]Panel` | 패널 형태의 UI | NavTreePanel, FilterPanel |
| `[기능]Bar` | 막대 형태의 UI | TabBar, ToolBar, SearchBar |
| `[기능]List` | 목록 형태의 UI | MenuList, ItemList |
| `[기능]Card` | 카드 형태의 UI | UserCard, StatCard |
| `[기능]Badge` | 뱃지 형태의 UI | StatusBadge, CountBadge |

## 4. 체크리스트

- [ ] `packages/ui/src/components/widget/[Name]/` 에 생성
- [ ] 필요한 Pure UI가 없으면 UI Component Builder에게 요청
- [ ] 단일 책임 원칙 확인
- [ ] 커스텀 className 사용하지 않음 (HeroUI/레이아웃 컴포넌트만)
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] observer 사용 시 memo 제외 확인
- [ ] Props 인터페이스 export
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] widget/index.ts에 barrel export 추가
