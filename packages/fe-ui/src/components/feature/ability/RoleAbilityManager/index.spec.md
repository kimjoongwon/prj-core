# RoleAbilityManager Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/ability/RoleAbilityManager/

## 역할

Role별 ABAC(Attribute-Based Access Control) 권한을 관리하는 Feature 컴포넌트입니다.
Role 선택, Ability 목록 표시, 추가/수정/삭제 기능을 제공합니다.
AbilityRuleList와 AbilityFormModal Widget을 래핑하고, useRoleAbilityManager 훅을 통해 로컬 MobX 상태와 비즈니스 로직을 관리합니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Widget | `AbilityRuleList` | Ability 규칙 목록 UI |
| Widget | `AbilityFormModal` | Ability 추가/수정 모달 UI |
| Input | `Select` | Role 선택 드롭다운 |
| Pure UI | `Text`, `HStack`, `VStack` | 레이아웃 구성 |
| UI Library | `@heroui/react` > `Card`, `CardBody`, `CardHeader` | 카드 래퍼 |
| Hook | `useRoleAbilityManager` | 로컬 MobX 상태 + CRUD 로직 |

## Props

```typescript
interface RoleAbilityManagerProps {
  /** Role 목록 */
  roles: Role[];
  /** 선택된 Role ID */
  selectedRoleId?: string;
  /** Role 변경 핸들러 */
  onRoleChange?: (roleId: string) => void;
  /** Ability 목록 로드 핸들러 */
  onLoadAbilities: (roleId: string) => Promise<AbilityRule[]>;
  /** Ability 추가 핸들러 */
  onAddAbility: (roleId: string, data: AbilityFormData) => Promise<void>;
  /** Ability 수정 핸들러 */
  onUpdateAbility: (abilityId: string, data: AbilityFormData) => Promise<void>;
  /** Ability 삭제 핸들러 */
  onDeleteAbility: (abilityId: string) => Promise<void>;
  /** Ability 활성화 상태 토글 핸들러 */
  onToggleActive: (abilityId: string, isActive: boolean) => Promise<void>;
  /** Subject 목록 (폼용) */
  subjects: Subject[];
  /** Action 목록 (폼용) */
  actions: Action[];
  /** Subject 필드 로드 핸들러 (조건 편집기용) */
  onLoadSubjectFields?: (subjectName: string) => Promise<string[]>;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| RoleAbilityManagerState (로컬 MobX) | `abilities` | Ability 규칙 목록 |
| RoleAbilityManagerState (로컬 MobX) | `isLoading` | 로딩 상태 |
| RoleAbilityManagerState (로컬 MobX) | `isModalOpen` | 모달 열림 상태 |
| RoleAbilityManagerState (로컬 MobX) | `modalMode` | 생성/수정 모드 |
| RoleAbilityManagerState (로컬 MobX) | `editingInitialData` | 수정 시 초기 데이터 |
| RoleAbilityManagerState (로컬 MobX) | `subjectFields` | Subject 필드 목록 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onRoleChange` | Role 선택 변경 시 | roleId 전달 |
| `onLoadAbilities` | Role 선택 시 / 목록 새로고침 시 | roleId 전달, Promise<AbilityRule[]> 반환 |
| `onAddAbility` | 모달에서 추가 제출 시 | roleId, AbilityFormData 전달 |
| `onUpdateAbility` | 모달에서 수정 제출 시 | abilityId, AbilityFormData 전달 |
| `onDeleteAbility` | 삭제 버튼 클릭 시 | abilityId 전달 |
| `onToggleActive` | 활성화 토글 시 | abilityId, isActive 전달 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `Select` | Input | Role 선택 드롭다운 |
| `AbilityRuleList` | Widget | Ability 규칙 목록 (추가/수정/삭제/토글 버튼 포함) |
| `AbilityFormModal` | Widget | Ability 추가/수정 모달 폼 |

## 구현 체크리스트

- [x] RoleAbilityManager.tsx
- [x] types.ts (Props, Role 타입)
- [x] useRoleAbilityManager.ts (커스텀 훅 + 로컬 MobX State)
- [x] index.ts (re-export)
- [x] observer 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
