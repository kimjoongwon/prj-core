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

### Widget vs Feature vs Page

| 계층 | 상태 | API | 비즈니스 로직 | 라우팅 | 예시 |
|------|:----:|:---:|:------------:|:------:|------|
| **Widget** | △ 로컬만 | ❌ | ❌ | ❌ | Dropdown, Modal, Tabs |
| **Feature** | ✅ | ✅ | ✅ | ✅ | LoginForm, CommentList |
| **Page** | ✅ | ✅ | ✅ | ✅ | LoginPage, DashboardPage |

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

## 6. 체크리스트

- [ ] `packages/ui/src/components/feature/[Name]/` 에 생성
- [ ] API 호출은 `@cocrepo/api` 사용
- [ ] 라우터 이동은 `next/navigation`의 `useRouter` 사용
- [ ] 복잡한 로직은 `use[Name].ts`로 분리
- [ ] observer로 감싸기 (MobX 사용 시)
- [ ] 로딩/에러 상태 처리
- [ ] displayName 설정
- [ ] index.ts에서 export
- [ ] feature/index.ts에 barrel export 추가
