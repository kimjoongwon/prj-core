# NavItem 기획서

> 생성일: 2026-02-18
> 수정일: 2026-02-18
> 타입: store
> 위치: packages/fe-store/src/stores/navItem.ts

## 역할

네비게이션 아이템을 표현하는 MobX observable 클래스. `NavItemConfig`를 기반으로 트리 구조의 네비게이션 항목을 생성하며, 활성화 상태 추적, 하위 아이템 관리, 경로 매칭, 탭(3depth) 관리를 담당합니다.

## 상태 (Observable)

| 속성 | 타입 | 초기값 | 설명 |
|------|------|--------|------|
| id | `string` (readonly) | config.id | 아이템 고유 ID |
| label | `string` (readonly) | config.label | 표시 라벨 |
| path | `string \| undefined` (readonly) | config.path | 연결 경로 |
| icon | `AppIconName \| undefined` (readonly) | config.icon | 허용된 앱 아이콘 이름 |
| subject | `string` (readonly) | config.subject | CASL Subject (권한 체크용) |
| scopeKind | `ScreenScopeKind \| undefined` (readonly) | config.scopeKind | 현재 tenant 기준 노출 정책 |
| children | `NavItem[]` (readonly) | config.children를 NavItem으로 재귀 변환 | 하위 아이템 목록 |
| tabs | `TabConfig[]` (readonly) | config.tabs ?? `[]` | 3depth 탭 목록 (v7.0) |
| _active | `boolean` (private) | `false` | 활성화 상태 |

## 계산된 값 (Computed)

| 속성 | 타입 | 계산 로직 |
|------|------|----------|
| active | `boolean` | `_active` 반환 |
| hasChildren | `boolean` | `children.length > 0` |
| hasTabs | `boolean` | `tabs.length > 0` (v7.0) |
| firstChildPath | `string \| undefined` | 하위 아이템이 있으면 첫 번째 child의 path, 없으면 자신의 path |
| activeChild | `NavItem \| undefined` | children 중 active가 true인 아이템 |

## 액션 (Action)

| 메서드 | 파라미터 | 동작 |
|--------|----------|------|
| `setActive` | `value: boolean` | 활성화 상태 설정 |
| `resetChildrenActive` | 없음 | 모든 하위 아이템의 active를 false로 초기화 |
| `findChildById` | `id: string` | ID로 하위 아이템 찾기 |
| `findChildByPath` | `path: string` | 경로로 하위 아이템 찾기 (가장 구체적인 경로 우선 매칭, 경로 경계 체크) |
| `findTabByPath` | `path: string` | 경로로 탭 찾기 (v7.0) |

## 비동기 액션 (Flow)

없음

## 의존 Store

없음 (독립적인 데이터 클래스)

## 외부 의존성

| 패키지 | 사용 |
|--------|------|
| `@cocrepo/type` | `AppIconName`, `NavItemConfig`, `ScreenScopeKind`, `TabConfig` 타입 |

## 경로 매칭 규칙 (findChildByPath)

1. 정확한 경로 일치 (`path === child.path`)
2. 경로 접두사 일치 (`path.startsWith(child.path + "/")`) - 경로 경계 체크로 `/roles`가 `/rolesX`를 매칭하지 않음
3. 여러 매칭 중 가장 긴 경로(가장 구체적인)를 우선 반환

## 사용 예시

```typescript
const navItem = new NavItem({
  id: 'members',
  label: '회원',
  subject: 'Member',
  children: [
    {
      id: 'member-list',
      label: '회원 목록',
      path: '/members/list',
      subject: 'MemberList',
      tabs: [
        { id: 'all', label: '전체', href: '/members/list' },
        { id: 'active', label: '활성', href: '/members/list/active' },
      ],
    },
  ],
});
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 메뉴 노출 정책을 재사용할 수 있도록 `scopeKind` 필드를 보존하도록 확장 | codex |
| 2026-03-11 | NavItem의 `icon`을 자유 문자열 대신 `AppIconName` 계약으로 고정 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
