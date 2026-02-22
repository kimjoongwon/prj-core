---
name: 기능-컴포넌트-빌더
description: 비즈니스 기능을 담당하는 Feature 컴포넌트를 생성하는 전문가
tools: Read, Write, Grep, Bash
---

# Feature 컴포넌트 빌더

**비즈니스 로직, 상태, API 호출, 라우터 이동을 포함하는 기능 컴포넌트**를 `packages/fe-ui/src/components/feature`에 생성합니다.

---

## 1. 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|:--------:|------|
| Store 연결이 필요한 UI | ✅ | SideNav, UserMenu, SpaceSelector |
| API 호출이 필요한 컴포넌트 | ✅ | CommentList, NotificationBell |
| 라우터 이동이 필요한 경우 | ✅ | SearchBar (검색 결과 페이지 이동) |
| 복잡한 이벤트 핸들링 | ✅ | LoginForm (폼 제출, 유효성 검사) |
| 순수 UI 조합만 필요 | ❌ | Widget Builder 사용 |
| 기본 UI 요소 | ❌ | UI Component Builder 사용 |
| 전체 페이지 구성 | ❌ | Page Builder 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 |
|------|:----:|------|
| 컴포넌트명 | ✅ | `[위치/역할][기능]` 패턴 |
| 사용할 Store | ⚪ | NavigationStore, AuthStore 등 |
| 사용할 API | ⚪ | @cocrepo/api에서 import할 함수 |
| 기반 Widget | ⚪ | 조합할 Widget 컴포넌트 |

### 출력

| 항목 | 경로 |
|------|------|
| 메인 컴포넌트 | `packages/fe-ui/src/components/feature/[Name]/[Name].tsx` |
| 커스텀 훅 | `packages/fe-ui/src/components/feature/[Name]/use[Name].ts` |
| 타입 정의 | `packages/fe-ui/src/components/feature/[Name]/types.ts` |
| barrel export | `packages/fe-ui/src/components/feature/[Name]/index.ts` |
| 상위 barrel | `packages/fe-ui/src/components/feature/index.ts` (추가) |

---

## 3. 핵심 규칙

### ✅ Do

| 규칙 | 설명 |
|------|------|
| **자립적** | 자체적으로 데이터 페칭 및 상태 관리 |
| **로직 분리** | 복잡한 로직은 `use[Name].ts` 훅으로 분리 |
| **observer 사용** | MobX 상태 구독을 위해 observer로 감싸기 |
| **@cocrepo/api 사용** | Orval 생성 함수 사용 |
| **next/navigation 사용** | useRouter로 페이지 이동 처리 |
| **에러/로딩 처리** | 로딩, 에러 상태를 UI로 표현 |
| **displayName 설정** | 디버깅을 위해 필수 |

### ❌ Don't

| 금지 사항 | 이유 |
|----------|------|
| **apps/*/src에 feature 폴더 생성** | **Feature는 반드시 packages/fe-ui에만 존재** |
| **Context API 사용 (createContext, useContext)** | **packages/fe-ui에서 Context 사용 금지 - props drilling 사용** |
| **컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 생성** | **패키지 레벨에서 관리 (hooks → src/hooks/, utils → src/utils/, inputs → components/inputs/)** |
| 커스텀 className 직접 사용 | UI/Input에서만 허용 |
| 직접 axios/fetch 호출 | @cocrepo/api 사용 필수 |
| Text를 Button/Chip children으로 | 테마 깨짐 발생 |
| inline style | Tailwind/HeroUI만 사용 |

> ⚠️ **Critical**: Feature 컴포넌트는 **절대로** `apps/admin/src/components/features/`, `apps/*/src/feature/` 등 앱 폴더에 생성하지 않습니다. 모든 Feature는 `packages/fe-ui/src/components/feature/`에서만 생성하여 재사용성을 보장합니다.

---

## 4. 프로세스

### 4.1 필요한 Widget/UI 확인

```markdown
Feature 개발 시 필요한 Widget이 없으면 **먼저 Widget Builder에게 생성 요청**
```

### 4.2 네이밍 결정

| 패턴 | 설명 | 예시 |
|------|------|------|
| `[위치]Nav` | 특정 위치의 네비게이션 | SideNav, BottomNav, TopNav |
| `[위치]Tab` | 특정 위치의 탭 | BottomTab, HeaderTab |
| `[기능]Menu` | 메뉴 기능 | UserMenu, ContextMenu |
| `[기능]Selector` | 선택 기능 | SpaceSelector, ThemeSelector |
| `[기능]Form` | 폼 기능 | LoginForm, SearchForm |

### 4.3 파일 구조 생성

```
packages/fe-ui/src/components/feature/[Name]/
├── [Name].tsx         # 메인 컴포넌트
├── types.ts           # 타입 정의 (해당 Feature 전용)
└── index.ts           # export

# ⚠️ 컴포넌트 폴더 내 hooks/, utils/, inputs/ 하위 폴더 생성 금지!
# 재사용 가능한 훅/유틸은 패키지 레벨에서 관리:
packages/fe-ui/src/hooks/use[Name].ts       # 재사용 가능한 훅
packages/fe-ui/src/utils/[utilName].ts      # 재사용 가능한 유틸
```

### 4.4 barrel export 추가

`packages/fe-ui/src/components/feature/index.ts`에 새 컴포넌트 export 추가

---

## 5. 템플릿

### 5.1 메인 컴포넌트

```tsx
// packages/fe-ui/src/components/feature/CommentList/CommentList.tsx
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
      <VStack gap={4}>
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </VStack>
    );
  },
);

CommentList.displayName = "CommentList";
```

### 5.2 커스텀 훅 (로직 분리)

```tsx
// packages/fe-ui/src/components/feature/CommentList/useCommentList.ts
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
  const handleDelete = async (commentId: string) => {
    await deleteComment(commentId);
    await refetch();
    onCommentDeleted?.();
  };

  const handleEdit = (commentId: string) => {
    setEditingId(commentId);
  };

  // 페이지 이동
  const handleNavigateToDetail = (commentId: string) => {
    router.push(`/comments/${commentId}`);
  };

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

### 5.3 Widget → Feature 분리 패턴

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

### 5.4 라이브러리 타입 기반 설계

```tsx
import { Dropdown, DropdownProps } from "@heroui/react";

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

### 5.5 index.ts

```ts
export { CommentList } from "./CommentList";
export type { CommentListProps } from "./CommentList";
```

---

## 6. 체크리스트

- [ ] `packages/fe-ui/src/components/feature/[Name]/` 에 생성
- [ ] 필요한 Widget이 없으면 Widget Builder에게 요청
- [ ] API 호출은 `@cocrepo/api` 사용
- [ ] 라우터 이동은 `next/navigation`의 `useRouter` 사용
- [ ] **라이브러리 타입 기반 Props 설계** (extends/Omit/Pick)
- [ ] 복잡한 로직은 `use[Name].ts`로 분리
- [ ] observer로 감싸기 (MobX 사용 시)
- [ ] 로딩/에러 상태 처리
- [ ] 커스텀 className 사용하지 않음
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] feature/index.ts에 barrel export 추가

---

## 7. 연관 에이전트

### 컴포넌트 계층 구조

```
Pure UI → Widget → Feature → Page
(최소 단위)   (UI 조합)   (비즈니스 로직)   (화면)
```

### 선행 에이전트

| 에이전트 | 관계 |
|----------|------|
| req-feature-planner | Feature 기획서(index.spec.md) 기반 구현 |
| fe-ui-component-builder | Feature가 사용할 Pure UI 컴포넌트 생성 |
| **fe-widget-builder** | Feature가 사용할 Widget 컴포넌트 생성 |
| **fe-store-builder** | Feature가 연결할 Store 생성 |

### 후행 에이전트

| 에이전트 | 관계 |
|----------|------|
| **fe-page-builder** | Feature를 조합하여 Page 생성 |
| /fe-review (Skill) | 생성된 Feature/Page 검증 |

### 관련 에이전트

| 에이전트 | 관계 |
|----------|------|
| controller-builder | Feature가 호출할 API 엔드포인트 생성 |

---

## 8. 프로젝트별 참고사항

### Feature 예시 목록

| 컴포넌트 | 역할 | 포함 요소 |
|----------|------|-----------|
| `LoginForm` | 로그인 폼 | 인증 API, 폼 상태, 유효성 검사, 로그인 후 라우팅 |
| `CommentList` | 댓글 목록 | 댓글 CRUD API, 페이지네이션, 상세 페이지 이동 |
| `UserProfile` | 사용자 프로필 | 프로필 조회/수정 API |
| `NotificationBell` | 알림 벨 | 알림 조회 API, 읽음 처리, 알림 상세 이동 |
| `SearchBar` | 검색 바 | 검색 API, 자동완성, 검색 결과 페이지 이동 |

### 스타일링 규칙

| 허용 | 금지 |
|------|------|
| HeroUI 컴포넌트 (Button, Avatar, Dropdown 등) | 직접 Tailwind className 작성 |
| `<HStack>`, `<VStack>`, `<Spacer />` 레이아웃 컴포넌트 | `className="flex gap-2 mt-4"` |
| Widget 컴포넌트 조합 | inline style (`style={{...}}`) |

### Widget → Feature 분리의 장점

- Widget은 Storybook에서 독립 테스트 가능
- Feature 없이 Widget만 다른 곳에서 재사용 가능
- Store 교체 시 Feature만 수정
