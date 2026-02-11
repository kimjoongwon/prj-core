# User 기획 진행 상황

## 기본 정보

- **프로젝트**: prj-core
- **앱**: admin-web
- **기능**: User (이용자 목록 조회)
- **시작일**: 2026-02-02

---

## Stage 1: 기획

### L0-L2: 컨텍스트/사용자/목표
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `01-overview.md`

### L3-L4: 기능/화면
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `02-structure.md`

### L5-L6: 인터랙션/API
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `03-interactions.md`

### L7-L8: 엔티티/컴포넌트
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `04-ui-details.md`

### L9-L10: 로직/테스트
- [x] orch-requirement 실행 완료 (2026-02-02)
  - 생성: `05-technical-design.md`

### 통합 파일
- [x] `requirement-graph.json` 생성 완료
- [x] Proposal 앱 동기화 완료
  - 생성: `data/requirements/prj-core__admin-web__user.json`

---

## Stage 2: 스키마

- [x] 기존 User 스키마 존재 (`packages/be-prisma/schema/user.prisma`)
- [x] 기존 DTO 존재 (`packages/be-dto/src/user.dto.ts`, `packages/be-dto/src/users/`)

---

## Stage 3: 백엔드

- [x] 기존 UsersController 존재 (`apps/server/src/module/users/`)
- [x] API 구현 완료: GET /api/users, GET /api/users/:id

---

## Stage 4: 컴포넌트 (UserList)

### Cell 컴포넌트
- [x] UserRoleCell - 역할 뱃지 Cell (2026-02-02)
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/UserRoleCell/`
  - 기존 `RoleChipCell`을 래핑하여 tenants 배열에서 첫 번째 역할 표시
- [x] StatusChipCell - 상태 뱃지 Cell (기존)
  - 위치: `packages/fe-ui/src/components/ui/data-display/cells/StatusChipCell/`
  - removedAt 기반 상태 계산 지원
- [x] DateTimeCell - 날짜 포맷팅 Cell (기존)
  - 위치: `packages/fe-ui/src/components/ui/data-display/cells/DateTimeCell/`

### Widget 컴포넌트
- [x] SearchFilterBar - 검색+필터 Widget (2026-02-02)
  - 생성: `packages/fe-ui/src/components/widget/SearchFilterBar/`
- [x] StatsCard - 통계 카드 Widget (2026-02-02)
  - 생성: `packages/fe-ui/src/components/widget/StatsCard/`
- [x] FilterPanel - 접이식 필터 패널 Widget (기존)
  - 위치: `packages/fe-ui/src/components/widget/FilterPanel/`

---

## Stage 5: 페이지 (UserList)

- [x] UserList 페이지 (`/users`) 완료 (2026-02-02)
  - 수정: `apps/admin/src/app/(admin)/users/page.tsx` - skip/take 기반 SSR
  - 수정: `apps/admin/src/app/(admin)/users/_prefetch.ts` - skip/take 파라미터
  - 수정: `apps/admin/src/app/(admin)/users/_client.tsx` - MetaDataGrid 기반 재구현

### 구현된 기능
- [x] 이용자 목록 테이블 (MetaDataGrid + DataGrid)
- [x] 통계 카드 (전체/활성/비활성)
- [x] 검색 기능 (이름, 이메일, 전화번호) - nuqs URL 동기화
- [x] 페이지네이션 - nuqs 기반 skip/take
- [x] SSR Prefetch 적용

### 사용된 컴포넌트
- `PageSurface` / `SectionSurface` - Surface 시스템
- `MetaDataGrid` - 선언적 DataGrid Feature
- `useMetaDataGridQueryStates` - nuqs URL 상태 관리
- `StatsCard` - 통계 카드 Widget
- `UserRoleCell` - 역할 Cell
- `StatusChipCell` - 상태 Cell
- `DateTimeCell` - 날짜 Cell
- `PhoneCell` - 전화번호 Cell

---

## 비고

- 조회 전용 기능으로 CUD 관련 기획 제외
- 기존 백엔드 API 활용
- 상세 페이지는 현재 기획 범위에 포함하지 않음 (필요 시 별도 기획)
