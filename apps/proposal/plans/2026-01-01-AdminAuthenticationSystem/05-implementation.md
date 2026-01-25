# 구현 필요 사항 및 상세 명세

## 백엔드 수정 필요 (선행 조건)

| 우선순위 | 작업 | 설명 |
|:--------:|------|------|
| 0-1 | Prisma 스키마 수정 | `User.selectedSpaceId` 필드 추가 |
| 0-2 | Login API 응답 수정 | `accessTokenExpiresAt`, `refreshTokenExpiresAt`, `selectedSpaceId` 필드 추가 |
| 0-3 | Space 변경 API 추가 | `PATCH /api/v1/users/me/selected-space` 엔드포인트 추가 |

### Prisma 스키마 변경

```prisma
// packages/prisma/schema/user.prisma
model User {
  // ... 기존 필드들
  selectedSpaceId  String?   @map("selected_space_id")
  selectedSpace    Space?    @relation("UserSelectedSpace", fields: [selectedSpaceId], references: [id])
  // ...
}
```

### Space 변경 API

```typescript
// PATCH /api/v1/users/me/selected-space
// Request Body
interface UpdateSelectedSpaceRequest {
  spaceId: string;
}

// Response
interface UpdateSelectedSpaceResponse {
  httpStatus: number;
  message: string;
  data: {
    selectedSpaceId: string;
  };
}
```

**호출 시점:**
- 사용자가 헤더의 Space 드롭다운에서 다른 Space를 선택할 때
- Space 선택 페이지(`/select-space`)에서 Space를 선택할 때

---

## 신규 생성이 필요한 파일

| 우선순위 | 파일 | 설명 |
|:--------:|------|------|
| 1 | `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 여부 확인 훅 |
| 2 | `apps/admin/src/hooks/useChangeSpace.ts` | Space 변경 훅 (API 호출 + Store 업데이트) |
| 3 | `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx` | Space 선택 드롭다운 (슈퍼매니저용 "전체" 포함) |
| 4 | `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert 컴포넌트 |

---

## 수정이 필요한 파일

| 우선순위 | 파일 | 작업 내용 |
|:--------:|------|----------|
| 1 | `packages/store/src/stores/persistStore.ts` | 토큰 만료 시간 필드 및 메서드 추가 |
| 2 | `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` | 로그인 성공 후 만료 시간 저장 및 Space 자동 선택 |
| 3 | `packages/api/src/libs/customAxios.ts` | x-space-id 헤더 인터셉터 추가 |
| 4 | `apps/admin/app/(admin)/layout.tsx` | Space 미선택 시 Alert 표시 |

---

## 상세 구현 명세

### useAuthLoginPage 수정

**파일:** `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx`

```typescript
// 기존 코드에 추가할 내용

import { usePersistStore } from "@/stores/AppStoreProvider";

export function useAuthLoginPage() {
  const router = useRouter();
  const persistStore = usePersistStore();

  const loginMutation = useLogin({
    mutation: {
      onSuccess: (response) => {
        const {
          accessTokenExpiresAt,
          refreshTokenExpiresAt,
          selectedSpaceId,  // [추가] 마지막 선택한 Space
          user
        } = response.data!;

        // 1. 토큰 만료 시간 저장 (실제 토큰은 httpOnly 쿠키로 자동 저장됨)
        persistStore?.setTokenExpiries(accessTokenExpiresAt, refreshTokenExpiresAt);

        // 2. Space 선택 (selectedSpaceId 우선, 없으면 첫 번째 tenant)
        let targetTenant = selectedSpaceId
          ? user.tenants?.find(t => t.spaceId === selectedSpaceId)
          : undefined;

        if (!targetTenant) {
          targetTenant = user.tenants?.[0];
        }

        if (targetTenant?.spaceId && targetTenant?.space?.ground) {
          const groundName = targetTenant.space.ground.name;
          persistStore?.setSpace(targetTenant.spaceId, groundName);
          // 3. 대시보드로 이동
          router.push("/");
        } else {
          // Space/Ground가 없는 경우
          alert("Space를 선택해주세요.");
          router.push("/select-space");
        }
      },
      onError: (error) => {
        runInAction(() => {
          state.errorMessage = "이메일 또는 비밀번호가 올바르지 않습니다.";
        });
      },
    },
  });

  // ... 나머지 코드
}
```

---

### x-space-id 헤더 인터셉터

**파일:** `packages/api/src/libs/customAxios.ts`

```typescript
import { AXIOS_INSTANCE } from "./customAxios";

// Store 참조를 위한 변수 (앱 초기화 시 설정)
let persistStoreRef: { spaceId: string | null } | null = null;

export function setApiPersistStore(store: { spaceId: string | null }) {
  persistStoreRef = store;
}

// Request 인터셉터: x-space-id 헤더 추가
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // spaceId가 있으면 헤더에 추가
    if (persistStoreRef?.spaceId) {
      config.headers["x-space-id"] = persistStoreRef.spaceId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

---

### useSpaceGuard 훅

**파일:** `apps/admin/src/hooks/useSpaceGuard.ts`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePersistStore } from "@/stores/AppStoreProvider";

export function useSpaceGuard() {
  const router = useRouter();
  const persistStore = usePersistStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    // spaceId가 없으면 Alert 표시
    if (!persistStore?.spaceId) {
      setShowAlert(true);
    }
  }, [persistStore?.spaceId]);

  const handleConfirm = () => {
    setShowAlert(false);
    router.push("/select-space");
  };

  return {
    showAlert,
    handleConfirm,
    hasSpace: !!persistStore?.spaceId,
  };
}
```

---

### useChangeSpace 훅

**파일:** `apps/admin/src/hooks/useChangeSpace.ts`

```typescript
"use client";

import { useCallback } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";
import { useUpdateSelectedSpace } from "@cocrepo/api";

interface UseChangeSpaceOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Space 변경 훅 (슈퍼매니저의 "전체" 선택 지원)
 *
 * - spaceId가 string: 해당 Space 선택 → X-Space-ID: spaceId
 * - spaceId가 null: "전체" 선택 → X-Space-ID: 헤더 미포함 (슈퍼매니저만)
 */
export function useChangeSpace(options?: UseChangeSpaceOptions) {
  const persistStore = usePersistStore();

  const mutation = useUpdateSelectedSpace({
    mutation: {
      onSuccess: () => {
        options?.onSuccess?.();
      },
      onError: (error) => {
        options?.onError?.(error);
      },
    },
  });

  const changeSpace = useCallback(
    async (spaceId: string | null, groundName: string) => {
      // 1. API 호출 (DB 저장) - "전체"면 null 전송
      await mutation.mutateAsync({ data: { spaceId } });

      // 2. PersistStore 업데이트
      // - spaceId가 null: "전체" 선택 → API 인터셉터에서 X-Space-ID 헤더 미포함
      // - spaceId가 string: 특정 Space 선택 → X-Space-ID: spaceId
      persistStore?.setSpace(spaceId, groundName);
    },
    [mutation, persistStore]
  );

  return {
    changeSpace,
    isLoading: mutation.isPending,
  };
}
```

---

### SpaceSelector 컴포넌트

**파일:** `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx`

```typescript
"use client";

import { observer } from "mobx-react-lite";

/**
 * SpaceItem - 선택 가능한 Space 정보
 */
interface SpaceItem {
  spaceId: string | null;  // null = "전체" 선택
  groundName: string;
}

interface SpaceSelectorProps {
  /** 선택 가능한 Space 목록 (tenants에서 추출) */
  spaces: SpaceItem[];
  /** 현재 선택된 spaceId (null = "전체") */
  selectedSpaceId: string | null;
  /** 슈퍼매니저 여부 (true면 "전체" 옵션 표시) */
  isSuperManager: boolean;
  /** Space 선택 시 콜백 */
  onSelectSpace: (spaceId: string | null, groundName: string) => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

/**
 * SpaceSelector - Space 선택 드롭다운
 *
 * - 슈퍼매니저: "전체" 옵션 + Space 목록
 * - 일반 매니저: Space 목록만 표시
 */
export const SpaceSelector = observer(function SpaceSelector({
  spaces,
  selectedSpaceId,
  isSuperManager,
  onSelectSpace,
  isLoading = false,
}: SpaceSelectorProps) {
  // 현재 선택된 항목의 표시 텍스트
  const selectedLabel =
    selectedSpaceId === null
      ? "전체"
      : spaces.find((s) => s.spaceId === selectedSpaceId)?.groundName ?? "선택";

  const handleSelect = (spaceId: string | null, groundName: string) => {
    onSelectSpace(spaceId, groundName);
  };

  return (
    <Dropdown>
      <DropdownTrigger disabled={isLoading}>
        <Text>{selectedLabel}</Text>
        <ChevronDownIcon />
      </DropdownTrigger>
      <DropdownContent>
        {/* 슈퍼매니저인 경우 "전체" 옵션 표시 */}
        {isSuperManager && (
          <>
            <DropdownItem
              key="all"
              onClick={() => handleSelect(null, "전체")}
              selected={selectedSpaceId === null}
            >
              <Text>전체</Text>
            </DropdownItem>
            <DropdownSeparator />
          </>
        )}

        {/* Space 목록 */}
        {spaces.map((space) => (
          <DropdownItem
            key={space.spaceId}
            onClick={() => handleSelect(space.spaceId, space.groundName)}
            selected={selectedSpaceId === space.spaceId}
          >
            <Text>{space.groundName}</Text>
          </DropdownItem>
        ))}
      </DropdownContent>
    </Dropdown>
  );
});
```

---

### HeaderSpaceSelector (헤더용 래퍼)

**파일:** `apps/admin/src/components/Header/HeaderSpaceSelector.tsx`

```typescript
"use client";

import { observer } from "mobx-react-lite";
import { SpaceSelector } from "@cocrepo/ui";
import { useChangeSpace } from "@/hooks/useChangeSpace";
import { usePersistStore, useUserStore } from "@/stores/AppStoreProvider";

/**
 * HeaderSpaceSelector - 헤더에 표시되는 Space 선택 컴포넌트
 */
export const HeaderSpaceSelector = observer(function HeaderSpaceSelector() {
  const persistStore = usePersistStore();
  const userStore = useUserStore();

  const { changeSpace, isLoading } = useChangeSpace({
    onSuccess: () => {
      // Space 변경 후 현재 페이지 데이터 새로고침
      window.location.reload();
    },
  });

  // tenants에서 SpaceItem 배열 생성
  const spaces = userStore?.user?.tenants?.map((tenant) => ({
    spaceId: tenant.spaceId,
    groundName: tenant.space?.ground?.name ?? "Unknown",
  })) ?? [];

  const handleSelectSpace = (spaceId: string | null, groundName: string) => {
    // spaceId가 null이면 "전체" 선택 (슈퍼매니저만 가능)
    changeSpace(spaceId, groundName);
  };

  return (
    <SpaceSelector
      spaces={spaces}
      selectedSpaceId={persistStore?.spaceId ?? null}
      isSuperManager={userStore?.isSuperManager ?? false}
      onSelectSpace={handleSelectSpace}
      isLoading={isLoading}
    />
  );
});
```

---

### Admin Layout에 Space Guard 적용

**파일:** `apps/admin/app/(admin)/layout.tsx`

```typescript
"use client";

import { useSpaceGuard } from "@/hooks/useSpaceGuard";
import { SpaceAlert } from "@cocrepo/ui";
// ... 기존 imports

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { showAlert, handleConfirm } = useSpaceGuard();

  return (
    <PageLayout
      header={...}
      leftAside={<SideNav />}
    >
      {children}

      {/* Space 미선택 Alert */}
      {showAlert && (
        <SpaceAlert
          title="Space 선택 필요"
          message="서비스 이용을 위해 Space를 선택해주세요."
          onConfirm={handleConfirm}
        />
      )}
    </PageLayout>
  );
}
```

---

## 파일 경로 요약

### 기존 파일 (수정 필요)

| 파일 | 작업 |
|------|------|
| `packages/store/src/stores/persistStore.ts` | 토큰 만료 시간 필드 및 메서드 추가 |
| `apps/admin/app/auth/login/hooks/useAuthLoginPage.tsx` | 토큰 만료 시간 저장 + Space 선택 로직 추가 |
| `packages/api/src/libs/customAxios.ts` | x-space-id 인터셉터 추가 |
| `apps/admin/app/(admin)/layout.tsx` | Space Guard 적용 |

### 신규 파일

| 파일 | 설명 |
|------|------|
| `apps/admin/src/hooks/useSpaceGuard.ts` | Space 선택 확인 훅 |
| `apps/admin/src/hooks/useChangeSpace.ts` | Space 변경 훅 (null 지원) |
| `packages/ui/src/components/feature/SpaceSelector/SpaceSelector.tsx` | Space 선택 드롭다운 ("전체" 포함) |
| `apps/admin/src/components/Header/HeaderSpaceSelector.tsx` | 헤더용 SpaceSelector 래퍼 |
| `packages/ui/src/components/widget/SpaceAlert/SpaceAlert.tsx` | Space 선택 Alert |
