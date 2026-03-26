# UserAbilityManager Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/ability/UserAbilityManager/

## 역할

User별 예외 권한(ABAC)을 관리하는 Feature 컴포넌트입니다.
Role 기반 권한을 덮어쓰는 사용자별 예외 권한의 검색, 목록 표시, 추가/수정/삭제 기능을 제공합니다.
사용자 검색(Autocomplete + 300ms 디바운스)으로 대상 사용자를 선택한 후 해당 사용자의 예외 권한을 관리합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌─────────────────────────────────────────────────────────────┐
│  사용자 예외 권한 관리                                        │
│                                                             │
│  사용자 검색                                                 │
│  ┌───────────────────────────────────────────┐             │
│  │ 🔍 사용자 이름 또는 이메일 검색...         │             │
│  └───────────────────────────────────────────┘             │
│  ┌───────────────────────────────────────────┐             │
│  │ 👤 홍길동  hong@example.com               │             │
│  │ 👤 김철수  kim@example.com                │             │
│  └───────────────────────────────────────────┘             │
│                                                             │
│  선택된 사용자: [👤 홍길동  hong@example.com  ✕]            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  예외 권한 규칙                          [+ 추가]    │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Subject   │ Action  │ 조건    │ 활성 │ 작업 │   │   │
│  │  ├───────────┼─────────┼─────────┼──────┼──────┤   │   │
│  │  │ Post      │ DELETE  │ owner   │ ON   │ ✎ ✕  │   │   │
│  │  │ Comment   │ UPDATE  │ -       │ OFF  │ ✎ ✕  │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 사용자 미선택 | 검색 입력만 표시, 규칙 목록 숨김 |
| 검색 중 | 드롭다운 목록에 후보 사용자 표시 |
| 사용자 선택 후 | 선택된 사용자 Chip + 규칙 목록 표시 |
| 규칙 로딩 중 | 규칙 목록 영역 스피너 표시 |
| 모달 열림 | AbilityFormModal 오버레이 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Widget | `AbilityRuleList` | Ability 규칙 목록 UI |
| Widget | `AbilityFormModal` | Ability 추가/수정 모달 UI |
| Pure UI | `Text`, `HStack`, `VStack` | 레이아웃 구성 |
| UI Library | `@heroui/react` > `Autocomplete`, `AutocompleteItem`, `Avatar`, `Button`, `Card`, `CardBody`, `Chip` | UI 컴포넌트 |
| Icon | `lucide-react` > `Plus`, `Search`, `User` | 아이콘 |
| Hook | `useUserAbilityManager` | 검색 + CRUD 로직 |

## Props

```typescript
interface UserAbilityManagerProps {
  /** 사용자 검색 함수 */
  onSearchUsers: (query: string) => Promise<AbilityUser[]>;
  /** 선택된 사용자 (외부 제어용) */
  selectedUser?: AbilityUser;
  /** 사용자 선택 콜백 (외부 제어용) */
  onUserSelect?: (user: AbilityUser | null) => void;
  /** Ability 규칙 로드 함수 */
  onLoadAbilities: (userId: string) => Promise<AbilityRule[]>;
  /** Ability 추가 함수 */
  onAddAbility: (userId: string, data: AbilityFormData) => Promise<void>;
  /** Ability 수정 함수 */
  onUpdateAbility: (abilityId: string, data: AbilityFormData) => Promise<void>;
  /** Ability 삭제 함수 */
  onDeleteAbility: (abilityId: string) => Promise<void>;
  /** 활성화 토글 함수 */
  onToggleActive: (abilityId: string, isActive: boolean) => Promise<void>;
  /** Subject 목록 (폼용) */
  subjects: Subject[];
  /** Action 목록 (폼용) */
  actions: Action[];
  /** Subject 필드 로드 함수 */
  onLoadSubjectFields?: (subjectName: string) => Promise<string[]>;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| UserAbilityManagerState (로컬 useState) | `abilities` | Ability 규칙 목록 |
| UserAbilityManagerState (로컬 useState) | `isLoading` | 로딩 상태 |
| UserAbilityManagerState (로컬 useState) | `isModalOpen` | 모달 열림 상태 |
| UserAbilityManagerState (로컬 useState) | `formMode` | add/edit/null 모드 |
| UserAbilityManagerState (로컬 useState) | `editingAbility` | 수정 시 초기 데이터 |
| UserAbilityManagerState (로컬 useState) | `subjectFields` | Subject 필드 목록 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onSearchUsers` | 검색어 입력 후 300ms 디바운스 | query 전달, Promise<AbilityUser[]> 반환 |
| `onUserSelect` | 사용자 선택/해제 시 | AbilityUser 또는 null 전달 |
| `onLoadAbilities` | 사용자 선택 시 자동 호출 | userId 전달 |
| `onAddAbility` | 예외 추가 모달 제출 시 | userId, AbilityFormData 전달 |
| `onUpdateAbility` | 수정 모달 제출 시 | abilityId, AbilityFormData 전달 |
| `onDeleteAbility` | 삭제 버튼 클릭 시 | abilityId 전달 |
| `onToggleActive` | 활성화 토글 시 | abilityId, isActive 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Autocomplete` | HeroUI | 사용자 검색 입력 (디바운스 적용) |
| `AbilityRuleList` | Widget | 예외 권한 규칙 목록 |
| `AbilityFormModal` | Widget | 예외 권한 추가/수정 모달 폼 |

## 구현 체크리스트

- [x] UserAbilityManager.tsx
- [x] type.ts (Props, AbilityUser, FormMode 타입)
- [x] useUserAbilityManager.ts (검색 디바운스 + CRUD 로직)
- [x] index.ts (re-export)
- [x] observer 적용
- [x] 외부/내부 제어 모드 지원 (selectedUser prop)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 중복 export 충돌을 피하기 위해 index.ts 공개 타입을 고유 타입(AbilityUser, FormMode, UserAbilityManagerProps)으로 축소 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
