---
name: 기능-컴포넌트-빌더
description: 비즈니스 기능을 담당하는 Feature 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep
---

# Feature 컴포넌트 빌더

**비즈니스 로직, 상태, API 호출, 라우터 이동을 포함하는 기능 컴포넌트**를 `packages/ui/src/components/feature`에 생성합니다.

---

## 1. Feature란?

| 구분 | 설명 | 예시 |
|------|------|------|
| **정의** | 상태 + API + 비즈니스 로직 + 라우터 이동을 포함하는 자립적 기능 단위 | LoginForm, CommentList, UserProfile |
| **특징** | 자체적으로 데이터를 가져오고 상태를 관리하며 페이지 이동을 수행함 | API 호출, 로컬 상태, 이벤트 핸들링, Next.js useRouter |
| **위치** | `packages/ui/src/components/feature/` | |

### 컴포넌트 계층 구조와 개발 순서 (Critical)

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

**개발 원칙:**
- **항상 Pure UI → Widget → Feature 순서로 개발**
- Feature 개발 시 필요한 Widget이 없으면 **먼저 Widget 생성 요청**
- **최대한 Widget으로 분리** - 순수 UI는 Widget으로, 비즈니스 로직만 Feature에
- Feature는 **Widget + Store 연결** - Widget에 데이터/핸들러 주입

| 계층 | 상태 | API | 비즈니스 로직 | 라우팅 | 예시 |
|------|:----:|:---:|:------------:|:------:|------|
| **Widget** | △ 로컬만 | ❌ | ❌ | ❌ | NavTreePanel, TabBar, MenuList |
| **Feature** | ✅ | ✅ | ✅ | ✅ | SideNav, BottomTab, SubMenuList |
| **Page** | ✅ | ✅ | ✅ | ✅ | DashboardPage, UsersPage |

### 네이밍 규칙 (Critical)

**Feature 네이밍: `[위치/역할][기능]`** - "어디서 어떻게 사용되는가"

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[위치]Nav` | 특정 위치의 네비게이션 | SideNav, BottomNav, TopNav |
| `[위치]Tab` | 특정 위치의 탭 | BottomTab, HeaderTab |
| `[기능]Menu` | 메뉴 기능 | UserMenu, ContextMenu |
| `[기능]Selector` | 선택 기능 | SpaceSelector, ThemeSelector |
| `[기능]Form` | 폼 기능 | LoginForm, SearchForm |

**Widget → Feature 분리 패턴:**

```typescript
// Widget (widget/NavTreePanel.tsx) - 순수 UI
export interface NavTreePanelProps {
  items: NavItemData[];
  expandedKeys: Set<string>;
  onToggle: (id: string) => void;
  onSelectItem: (id: string) => void;
  width?: number;
}

export const NavTreePanel = ({ items, expandedKeys, onToggle, ... }: NavTreePanelProps) => {
  // 순수 렌더링만 - Store 접근 없음
};

// Feature (feature/SideNav.tsx) - 비즈니스 로직
export const SideNav = observer(({ width, className }: SideNavProps) => {
  const store = useNavigationStore();

  // Store → Widget props 변환
  const handleToggle = (id: string) => store.toggleNavItem(id);

  return (
    <NavTreePanel
      items={store.items}
      expandedKeys={store.expandedKeys}
      onToggle={handleToggle}
      width={width}
    />
  );
});
```

**분리의 장점:**
- Widget은 Storybook에서 독립 테스트 가능
- Feature 없이 Widget만 다른 곳에서 재사용 가능
- Store 교체 시 Feature만 수정

---

## 2. 폴더 구조

```
packages/ui/src/components/feature/
├── LoginForm/
│   ├── LoginForm.tsx         # 메인 컴포넌트
│   ├── useLoginForm.ts       # 커스텀 훅 (상태/로직 분리)
│   ├── types.ts              # 타입 정의
│   └── index.ts              # export
├── CommentList/
│   ├── CommentList.tsx
│   ├── useCommentList.ts
│   └── index.ts
└── index.ts                  # barrel export
```

---

## 3. 컴포넌트 템플릿

### 메인 컴포넌트

```tsx
// packages/ui/src/components/feature/CommentList/CommentList.tsx
import { observer } from "mobx-react-lite";
import { useCommentList } from "./useCommentList";
import { CommentItem } from "../../widget/CommentItem";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { Text } from "../../Text";

export interface CommentListProps {
  postId: string;
  onCommentDeleted?: () => void;
}

export const CommentList = observer<CommentListProps>(
  ({ postId, onCommentDeleted }) => {
    const {
      comments,
      isLoading,
      error,
      handleDelete,
      handleEdit,
    } = useCommentList({ postId, onCommentDeleted });

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <Text>댓글을 불러오는데 실패했습니다.</Text>;
    }

    return (
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>
    );
  },
);

CommentList.displayName = "CommentList";
```

### 커스텀 훅 (로직 분리)

```tsx
// packages/ui/src/components/feature/CommentList/useCommentList.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetComments, useDeleteComment } from "@cocrepo/api";

interface UseCommentListParams {
  postId: string;
  onCommentDeleted?: () => void;
}

export function useCommentList({ postId, onCommentDeleted }: UseCommentListParams) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);

  // API 호출
  const { data: comments = [], isLoading, error, refetch } = useGetComments(postId);
  const { mutateAsync: deleteComment } = useDeleteComment();

  // 비즈니스 로직
  const handleDelete = useCallback(async (commentId: string) => {
    await deleteComment(commentId);
    await refetch();
    onCommentDeleted?.();
  }, [deleteComment, refetch, onCommentDeleted]);

  const handleEdit = useCallback((commentId: string) => {
    setEditingId(commentId);
  }, []);

  // 페이지 이동
  const handleNavigateToDetail = useCallback((commentId: string) => {
    router.push(`/comments/${commentId}`);
  }, [router]);

  return {
    comments,
    isLoading,
    error,
    editingId,
    handleDelete,
    handleEdit,
    handleNavigateToDetail,
  };
}
```

### index.ts

```ts
// packages/ui/src/components/feature/CommentList/index.ts
export { CommentList } from "./CommentList";
export type { CommentListProps } from "./CommentList";
```

---

## 4. 핵심 규칙

| 규칙 | 설명 |
|------|------|
| **자립적** | 자체적으로 데이터 페칭 및 상태 관리 |
| **로직 분리** | 복잡한 로직은 `use[Name].ts` 훅으로 분리 |
| **observer 사용** | MobX 상태 구독을 위해 observer로 감싸기 |
| **API는 @cocrepo/api** | Orval 생성 함수 사용, 직접 axios 호출 금지 |
| **라우터는 next/navigation** | `useRouter`로 페이지 이동 처리 |
| **에러/로딩 처리** | 로딩, 에러 상태를 UI로 표현 |
| **displayName** | 디버깅을 위해 displayName 설정 |

---

## 5. Feature 예시 목록

| 컴포넌트 | 역할 | 포함 요소 |
|----------|------|-----------|
| `LoginForm` | 로그인 폼 | 인증 API, 폼 상태, 유효성 검사, 로그인 후 라우팅 |
| `CommentList` | 댓글 목록 | 댓글 CRUD API, 페이지네이션, 상세 페이지 이동 |
| `UserProfile` | 사용자 프로필 | 프로필 조회/수정 API |
| `NotificationBell` | 알림 벨 | 알림 조회 API, 읽음 처리, 알림 상세 이동 |
| `SearchBar` | 검색 바 | 검색 API, 자동완성, 검색 결과 페이지 이동 |

---

## 6. 스타일링 규칙 (Critical)

**커스텀 className 사용 금지 - HeroUI와 기존 컴포넌트만 사용**

> **예외**: `components/ui/`와 `components/inputs/`에서만 커스텀 className이 허용됩니다. Feature 컴포넌트에서는 금지입니다.

Feature 컴포넌트 내부에서도 직접 Tailwind className을 작성하지 않습니다.

```tsx
// ❌ 금지 - 커스텀 className 직접 사용
export const UserMenu = observer(() => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">{user.name}</span>
      <button className="px-4 py-2 rounded-lg bg-danger text-white">
        로그아웃
      </button>
    </div>
  );
});

// ✅ 올바른 패턴 - HeroUI와 레이아웃 컴포넌트 사용
export const UserMenu = observer(() => {
  return (
    <HStack gap={2} align="center">
      <Text size="sm" weight="medium">{user.name}</Text>
      <Button color="danger" onPress={handleLogout}>
        로그아웃
      </Button>
    </HStack>
  );
});
```

**Feature 컴포넌트 스타일링 원칙:**

| 허용 | 금지 |
|------|------|
| HeroUI 컴포넌트 (Button, Avatar, Dropdown 등) | 직접 Tailwind className 작성 |
| `<HStack>`, `<VStack>`, `<Spacer />` 레이아웃 컴포넌트 | `className="flex gap-2 mt-4"` |
| Widget 컴포넌트 조합 | inline style (`style={{...}}`) |

**자주 사용되는 스타일 패턴 발견 시:**
1. HeroUI에서 해당 스타일을 지원하는 컴포넌트가 있는지 확인
2. 기존 UI/Widget 컴포넌트에서 해결 가능한지 확인
3. 해결 불가능하면 **UI 컴포넌트 빌더** 또는 **Widget 빌더**에게 새 컴포넌트 생성 요청
4. 생성된 컴포넌트를 Feature에서 활용

---

## 7. 라이브러리 타입 기반 설계 (Critical)

**라이브러리 컴포넌트를 사용할 때는 반드시 기존 라이브러리 타입을 기반으로 Props를 설계합니다.**

```tsx
// ✅ 올바른 패턴 - 라이브러리 타입 상속
import { Dropdown, DropdownProps } from "@heroui/react";

// 라이브러리 타입 기반으로 확장
export interface UserMenuProps extends Omit<DropdownProps, "children"> {
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export const UserMenu = observer(({ onLogout, onProfileClick, ...rest }: UserMenuProps) => {
  const authStore = useAuthStore();

  return (
    <Dropdown {...rest}>
      {/* Feature 로직 */}
    </Dropdown>
  );
});
```

```tsx
// ❌ 금지 - 라이브러리 타입 무시
export interface UserMenuProps {
  onLogout?: () => void;
  // Dropdown이 지원하는 placement, isOpen 등 다른 props 누락
}
```

**타입 설계 원칙:**

| 패턴 | 사용 시점 | 예시 |
|------|----------|------|
| `extends Omit<LibProps, 'key'>` | 일부 props 고정/재정의 | UserMenu (children 고정) |
| `extends LibProps` | 모든 props 전달 허용 | SearchBar |
| 자체 Props + spread | 내부에서 라이브러리 사용 | `...rest`로 전달 |

---

## 8. 체크리스트

- [ ] `packages/ui/src/components/feature/[Name]/` 에 생성
- [ ] API 호출은 `@cocrepo/api` 사용
- [ ] 라우터 이동은 `next/navigation`의 `useRouter` 사용
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] 복잡한 로직은 `use[Name].ts`로 분리
- [ ] observer로 감싸기 (MobX 사용 시)
- [ ] 로딩/에러 상태 처리
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] feature/index.ts에 barrel export 추가
