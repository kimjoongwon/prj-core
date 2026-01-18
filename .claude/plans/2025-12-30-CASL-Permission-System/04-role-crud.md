# 역할(Role) 관리 CRUD 모달 기능 기획서

**작성일:** 2026-01-17
**관련 기획:** `.claude/plans/2025-12-30-CASL-Permission-System/`

---

## 1. 개요

역할 목록 페이지(`/roles`)에 역할 추가/수정/삭제 CRUD 기능을 URL 기반 모달로 구현합니다.

### 1.1 URL 패턴
- 목록: `/roles`
- 생성: `/roles/new`
- 수정: `/roles/[id]/edit`

### 1.2 주요 변경사항
- **스키마 확장**: Role 모델에 `displayName`, `description`, `isSystem` 필드 추가
- **name 필드 변경**: `Roles` enum → `String` (동적 역할 생성 지원)
- **백엔드 API**: Role CRUD 엔드포인트 신규 구현
- **프론트엔드**: RoleFormModal Widget + URL 기반 라우팅

---

## 2. 스키마 변경

### 2.1 Role 모델 확장

**파일:** `packages/prisma/schema/role.prisma`

```prisma
model Role {
  id             String              @id @default(uuid())
  seq            Int                 @unique @default(autoincrement())
  createdAt      DateTime            @default(now()) @map("created_at")
  updatedAt      DateTime?           @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt      DateTime?           @map("removed_at") @db.Timestamptz(6)

  /// @displayName 역할 식별자
  name           String              @unique  // enum → String 변경
  /// @displayName 표시명
  displayName    String?             @map("display_name")
  /// @displayName 설명
  description    String?
  /// @displayName 시스템 역할 여부
  isSystem       Boolean             @default(false) @map("is_system")

  abilities      Ability[]
  assignments    Assignment[]
  associations   RoleAssociation[]
  classification RoleClassification?
  tenants        Tenant[]

  @@map("roles")
}
```

### 2.2 Roles enum 처리

**파일:** `packages/prisma/schema/core.prisma`

```prisma
// 삭제: enum Roles { USER, SUPER_ADMIN, ADMIN }
// → String 타입으로 대체, 시드 데이터로 기본 역할 생성
```

### 2.3 시드 데이터

**파일:** `packages/prisma/seed-data.ts`

```typescript
export const roleSeedData = [
  { name: 'SUPER_ADMIN', displayName: '슈퍼 관리자', description: '시스템의 모든 권한을 가진 최고 관리자', isSystem: true },
  { name: 'ADMIN', displayName: '관리자', description: '일반 관리 업무를 수행하는 관리자', isSystem: true },
  { name: 'USER', displayName: '일반 사용자', description: '기본 사용자 역할', isSystem: true },
];
```

---

## 3. 화면 기획

### 3.1 역할 추가 모달

```
┌──────────────────────────────────────────────────────┐
│  역할 추가                                      [X]  │
├──────────────────────────────────────────────────────┤
│                                                      │
│  역할 식별자 *                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │ MANAGER                                        │  │
│  └────────────────────────────────────────────────┘  │
│  영문 대문자와 언더스코어만 사용 (예: TEAM_LEADER)   │
│                                                      │
│  표시명 *                                            │
│  ┌────────────────────────────────────────────────┐  │
│  │ 매니저                                         │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  설명                                                │
│  ┌────────────────────────────────────────────────┐  │
│  │ 팀을 관리하는 중간 관리자 역할                 │  │
│  │                                                │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
├──────────────────────────────────────────────────────┤
│                              [취소]  [저장]          │
└──────────────────────────────────────────────────────┘
```

**필드 정의:**

| 필드 | 타입 | 필수 | 유효성 검사 |
|------|------|------|-------------|
| name | string | Y | `^[A-Z][A-Z0-9_]*$`, 중복 불가 |
| displayName | string | Y | 최대 50자 |
| description | string | N | 최대 200자 |

### 3.2 역할 수정 모달

- 제목: "역할 수정"
- `name` 필드: **읽기 전용** (시스템 안정성)
- 시스템 역할(isSystem=true): 모달 진입 차단

### 3.3 역할 삭제 확인

- 연결된 사용자가 있으면 삭제 차단
- 시스템 역할은 삭제 불가

---

## 4. URL 라우팅 설계

### 4.1 폴더 구조 (Parallel Routes + Intercepting Routes)

```
apps/admin/app/(admin)/roles/
├── layout.tsx                    # children + modal 슬롯
├── page.tsx                      # 역할 목록 (수정)
├── @modal/
│   ├── default.tsx               # null 반환
│   ├── (.)new/
│   │   └── page.tsx              # 생성 모달 (인터셉트)
│   └── (.)[id]/
│       └── edit/
│           └── page.tsx          # 수정 모달 (인터셉트)
├── new/
│   └── page.tsx                  # 생성 페이지 (직접 접근)
└── [id]/
    └── edit/
        └── page.tsx              # 수정 페이지 (직접 접근)
```

### 4.2 layout.tsx

```tsx
export default function RolesLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
```

### 4.3 동작 방식

| 액션 | URL 변화 | 결과 |
|------|----------|------|
| "역할 추가" 클릭 | `/roles` → `/roles/new` | 목록 위에 모달 오버레이 |
| "수정" 클릭 | `/roles` → `/roles/[id]/edit` | 목록 위에 모달 오버레이 |
| 모달 닫기 | `/roles/new` → `/roles` | 모달 닫힘 |
| 브라우저 뒤로가기 | 이전 URL로 복원 | 모달 닫힘 |
| `/roles/new` 직접 접근 | - | 전체 페이지로 폼 표시 |

---

## 5. 컴포넌트 설계

### 5.1 계층 구조

```
Page: /roles/page.tsx
├── Widget: RoleFormModal (순수 UI)
│   - isOpen, onClose, onSubmit, mode, initialData
└── (URL 기반 모달 컨테이너)
    └── RoleFormModalContainer (API 연결)
```

### 5.2 RoleFormModal Widget

**위치:** `packages/ui/src/components/widget/role/RoleFormModal/`

```typescript
// types.ts
export interface RoleFormData {
  name: string;
  displayName: string;
  description?: string;
}

export interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => void;
  initialData?: Partial<RoleFormData>;
  loading?: boolean;
  mode: "create" | "edit";
}
```

### 5.3 ConfirmModal Widget (범용)

**위치:** `packages/ui/src/components/widget/common/ConfirmModal/`

```typescript
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: "primary" | "danger";
  loading?: boolean;
}
```

---

## 6. 백엔드 API 설계

### 6.1 엔드포인트

| 메서드 | 경로 | 설명 | 권한 |
|--------|------|------|------|
| GET | `/api/v1/roles` | 역할 목록 조회 | ADMIN |
| GET | `/api/v1/roles/:id` | 역할 상세 조회 | ADMIN |
| POST | `/api/v1/roles` | 역할 생성 | SUPER_ADMIN |
| PATCH | `/api/v1/roles/:id` | 역할 수정 | SUPER_ADMIN |
| DELETE | `/api/v1/roles/:id` | 역할 삭제 | SUPER_ADMIN |

### 6.2 DTO

**CreateRoleDto:**
```typescript
export class CreateRoleDto {
  @StringField({ pattern: /^[A-Z][A-Z0-9_]*$/ })
  name: string;

  @StringField({ maxLength: 50 })
  displayName: string;

  @StringField({ maxLength: 200, nullable: true })
  description?: string;
}
```

**UpdateRoleDto:**
```typescript
export class UpdateRoleDto {
  @StringField({ maxLength: 50, nullable: true })
  displayName?: string;

  @StringField({ maxLength: 200, nullable: true })
  description?: string;
}
// name 필드 수정 불가
```

**RoleResponseDto:**
```typescript
export class RoleResponseDto extends AbstractDto {
  name: string;
  displayName?: string;
  description?: string;
  isSystem: boolean;
  userCount: number;
  abilityCount: number;
}
```

---

## 7. 제약사항

### 7.1 시스템 역할 보호
- `isSystem=true`인 역할 (SUPER_ADMIN, ADMIN, USER)
- 수정/삭제 불가
- 프론트엔드: 버튼 비활성화
- 백엔드: 403 Forbidden 반환

### 7.2 역할 삭제 제한
- 연결된 Tenant(사용자)가 있으면 삭제 차단
- 에러 메시지: "이 역할에 N명의 사용자가 연결되어 있습니다."

### 7.3 name 필드 제약
- 생성 시에만 입력 가능
- 수정 시 읽기 전용
- 패턴: `^[A-Z][A-Z0-9_]*$`

---

## 8. 구현 순서

### Stage 1: 스키마 확장
1. Role 모델에 displayName, description, isSystem 추가
2. name 필드 String으로 변경
3. Roles enum 제거
4. 마이그레이션 실행
5. 시드 데이터 업데이트

### Stage 2: 백엔드 구현
1. CreateRoleDto, UpdateRoleDto, RoleResponseDto 생성
2. RolesRepository 생성
3. RolesService 생성
4. RolesController 생성
5. Orval codegen 실행

### Stage 3: Widget 구현
1. RoleFormModal 컴포넌트 생성
2. ConfirmModal 컴포넌트 생성

### Stage 4: 페이지/라우팅 구현
1. roles/layout.tsx 생성
2. @modal 폴더 구조 생성
3. roles/page.tsx 수정 (API 연결)

---

## 9. Critical Files

| 파일 | 변경 내용 |
|------|----------|
| `packages/prisma/schema/role.prisma` | displayName, description, isSystem 추가, name → String |
| `packages/prisma/schema/core.prisma` | Roles enum 제거 |
| `packages/prisma/seed-data.ts` | roleSeedData 추가 |
| `packages/dto/src/role.dto.ts` | CreateRoleDto, UpdateRoleDto, RoleResponseDto |
| `apps/server/src/module/role/` | RolesController, RolesService, RolesRepository |
| `packages/ui/src/components/widget/role/RoleFormModal/` | 역할 폼 모달 Widget |
| `packages/ui/src/components/widget/common/ConfirmModal/` | 확인 모달 Widget |
| `apps/admin/app/(admin)/roles/` | layout.tsx, @modal/, page.tsx 수정 |

---

## 10. 검증 방법

1. **스키마 검증**: `pnpm prisma:generate` 후 타입 에러 없음
2. **API 검증**: Swagger UI에서 CRUD 테스트
3. **UI 검증**:
   - `/roles` 접속 → 역할 목록 표시
   - "역할 추가" 클릭 → `/roles/new`로 이동, 모달 표시
   - 폼 입력 후 저장 → 목록에 반영
   - "수정" 클릭 → `/roles/[id]/edit`로 이동, 모달 표시
   - 시스템 역할 수정/삭제 버튼 비활성화 확인
   - 브라우저 뒤로가기 → 모달 닫힘 확인
