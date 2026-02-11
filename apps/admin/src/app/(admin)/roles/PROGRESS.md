# Role 기능 개발 진행 상황

## 기본 정보
- **프로젝트**: prj-core
- **앱**: admin-web
- **기능**: Role (역할 관리)
- **시작일**: 2026-02-03
- **경로**: /admin/roles

## Stage 진행 상황

### Stage 1: 기획 ⏭️ SKIP
- 기존 Role 스키마/API 존재하므로 스킵

### Stage 2: 스키마 ⏭️ SKIP
- 기존 Prisma 스키마 존재: `packages/be-prisma/schema/role.prisma`

### Stage 3: 백엔드 ⏭️ SKIP
- 기존 API 존재: `useGetRoles`, `useCreateRole`, `useUpdateRole`, `useDeleteRole`

### Stage 4: 컴포넌트 ⏭️ SKIP
- 기존 컴포넌트 재사용 (PageSurface, SectionSurface, DateTimeCell, StatusChipCell 등)

### Stage 5: 페이지 ✅ COMPLETED (2026-02-03)
- [x] RoleList 페이지 구현 (`/admin/roles`)
  - 생성: `apps/admin/src/app/(admin)/roles/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/_prefetch.ts`
- [x] RoleNew 페이지 구현 (`/admin/roles/new`)
  - 수정: `apps/admin/src/app/(admin)/roles/new/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/new/_client.tsx`
- [x] RoleDetail 페이지 구현 (`/admin/roles/[id]`)
  - 생성: `apps/admin/src/app/(admin)/roles/[id]/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/[id]/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/[id]/_prefetch.ts`
- [x] RoleEdit 페이지 구현 (`/admin/roles/[id]/edit`)
  - 수정: `apps/admin/src/app/(admin)/roles/[id]/edit/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/roles/[id]/edit/_client.tsx`

## 페이지 목록
| 페이지 | 경로 | Stage 4 | Stage 5 |
|--------|------|---------|---------|
| RoleList | /admin/roles | ⏭️ | ✅ |
| RoleNew | /admin/roles/new | ⏭️ | ✅ |
| RoleDetail | /admin/roles/[id] | ⏭️ | ✅ |
| RoleEdit | /admin/roles/[id]/edit | ⏭️ | ✅ |

## 생성된 파일
- `apps/admin/src/app/(admin)/roles/page.tsx` - 서버 컴포넌트 (SSR 프리페치)
- `apps/admin/src/app/(admin)/roles/_client.tsx` - 클라이언트 컴포넌트 (UI)
- `apps/admin/src/app/(admin)/roles/_prefetch.ts` - 프리페치 함수
- `apps/admin/src/app/(admin)/roles/new/page.tsx` - 역할 등록 서버 컴포넌트
- `apps/admin/src/app/(admin)/roles/new/_client.tsx` - 역할 등록 클라이언트 컴포넌트
- `apps/admin/src/app/(admin)/roles/[id]/page.tsx` - 역할 상세 서버 컴포넌트
- `apps/admin/src/app/(admin)/roles/[id]/_client.tsx` - 역할 상세 클라이언트 컴포넌트
- `apps/admin/src/app/(admin)/roles/[id]/_prefetch.ts` - 역할 상세 프리페치 함수
- `apps/admin/src/app/(admin)/roles/[id]/edit/page.tsx` - 역할 수정 서버 컴포넌트
- `apps/admin/src/app/(admin)/roles/[id]/edit/_client.tsx` - 역할 수정 클라이언트 컴포넌트
