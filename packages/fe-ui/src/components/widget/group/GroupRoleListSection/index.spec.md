# GroupRoleListSection Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/group/GroupRoleListSection/

## 역할

그룹에 소속된 역할 목록을 읽기 전용 테이블로 표시합니다. 역할 식별자(링크), 표시명, 시스템 여부(Chip) 컬럼을 제공합니다.

## Props

```typescript
interface GroupRoleListSectionProps {
  roleAssociations: GroupRoleItem[];
  isLoading?: boolean;          // 기본값: false
  rolesBasePath?: string;       // 기본값: "/roles"
}

interface GroupRoleItem {
  id: string;
  roleId: string;
  role?: {
    id: string;
    name: string;
    displayName?: string | null;
    isSystem: boolean;
  };
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table (removeWrapper) | 역할 테이블 |
| HeroUI Link | 역할 상세 링크 |
| HeroUI Chip | 시스템 여부 배지 (success/default) |
| HeroUI Skeleton | 로딩 스켈레톤 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
