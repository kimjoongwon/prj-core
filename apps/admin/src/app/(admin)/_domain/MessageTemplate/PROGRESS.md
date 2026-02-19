# Template Progress

## Stage 1: 기획
- [x] L0-L2 기획 (01-overview.md)
- [x] L3-L4 기획 (02-structure.md) - 2026-02-17
  - L3: 13개 기능 (FEA-001~013)
  - L4: 4개 화면 (SCR-001~004)
- [x] L5-L6 기획 (03-interactions.md) - 2026-02-17
  - L5: 25개 인터랙션 (ACT-001~025), 4개 화면별 액션 정의
  - L6: 8개 API (API-001~008), 상세 스키마 포함
- [x] L7-L8 기획 (04-ui-details.md) - 2026-02-17
  - L7: 2개 엔티티 (Template, TemplateVariable), 1개 Enum, 19개 필드, 9개 DTO
  - L8: 15개 컴포넌트 (Cell 2, Widget 11, Feature 2), 기존 재사용 9개
- [x] L9-L10 기획 (05-technical-design.md) - 2026-02-17
  - L9: 16개 비즈니스 로직 (백엔드 9개 + 프론트엔드 7개)
  - L10: 7개 테스트 스위트 (백엔드 2개 + 프론트엔드 5개), 총 56개 테스트 케이스
- [x] 사용자 리뷰 완료 (2026-02-17)

## Stage 2: 스키마
- [x] Prisma 스키마 (Template, TemplateVariable) - 2026-02-17
  - `packages/be-prisma/schema/template.prisma`
  - Template, TemplateVariable 모델 + TemplateType enum
- [x] Entity 클래스 - 2026-02-17
  - `packages/be-entity/src/template.entity.ts`
  - `packages/be-entity/src/template-variable.entity.ts`
- [x] DTO 클래스 - 2026-02-17
  - `packages/be-dto/src/template/template.dto.ts` (Response)
  - `packages/be-dto/src/template/template-variable.dto.ts` (Response)
  - `packages/be-dto/src/create/create-template.dto.ts`
  - `packages/be-dto/src/update/update-template.dto.ts`
  - `packages/be-dto/src/template/preview-template.dto.ts`
  - `packages/be-dto/src/template/send-test-template.dto.ts`
- [x] Query DTO 클래스 - 2026-02-17
  - `packages/be-dto/src/query/query-template.dto.ts`
  - 필터: search(code/name), type(enum), isActive(boolean)
- [x] Repository 클래스 - 2026-02-17
  - `packages/be-repository/src/templates.repository.ts`
  - 9개 메서드: findById, findByIdOrThrow, findByCode, findMany, create, createWithVariables, updateById, updateWithVariables, removeById
- [x] Seed 데이터 - 2026-02-17
  - `packages/be-prisma/seed-data.ts` (6개 템플릿: EMAIL 2, SMS 2, PUSH 2)
  - `packages/be-prisma/seed.ts` (createTemplates 함수 추가)
- [x] 사용자 리뷰 완료 (2026-02-17)

## Stage 3: 백엔드
- [x] TemplatesService - 2026-02-17
  - `packages/be-service/src/templates.service.ts`
  - 8개 public 메서드: getTemplates, getTemplateById, create, update, remove, toggleStatus, preview, sendTest
  - 3개 private 메서드: validateTypeConstraints, validateRecipient, substituteVariables
  - 발송 테스트는 TODO 처리 (발송 서비스 미구현, 로그만 남김)
- [x] TemplatesController + TemplatesModule - 2026-02-17
  - `apps/server/src/module/template/templates.controller.ts` (8개 API 엔드포인트)
  - `apps/server/src/module/template/templates.module.ts`
  - `apps/server/src/module/template/index.ts`
  - API 경로: /api/v1/templates (FULL_ACCESS 권한 필수)
- [x] AppModule 라우팅 등록 - 2026-02-17
  - `apps/server/src/module/app.module.ts`에 TemplatesModule import + RouterModule 경로 추가
- [x] 사용자 리뷰 완료 (2026-02-17)

## Stage 4: 컴포넌트 (페이지별)
- [x] TemplateList 컴포넌트 - 2026-02-17
  - Cell: `TemplateTypeChipCell` (유형 Chip), `TemplateActiveToggleCell` (인라인 토글)
  - Menu: `admin-menu.ts`에 템플릿 경로/Subject/메뉴 추가
  - Widget/Feature: 기존 SearchFilterBar, DataGrid 재사용 (신규 없음)
- [x] TemplateDetail 컴포넌트 - 2026-02-17
  - Widget: `TemplateTypeBadge`, `HtmlContentRenderer`, `ByteCounter`, `VariableReadTable`, `VariableInputForm`, `TemplateContentViewer`, `PreviewModal`, `SendTestModal`
  - Feature: `TemplateActions` (액션 버튼 그룹)
- [x] TemplateCreate 컴포넌트 - 2026-02-17
  - Widget: `HtmlEditor`, `VariableEditTable`, `TemplateContentEditor`, `TemplateForm` (등록/수정 공용)
- [x] TemplateEdit 컴포넌트 - 2026-02-17
  - TemplateCreate와 공유 (TemplateForm mode="edit")
- [x] 사용자 리뷰 완료 (2026-02-17)

## Stage 5: 페이지 (페이지별)
- [x] TemplateList 페이지 - 2026-02-17
  - `apps/admin/src/app/(admin)/templates/page.tsx` (서버 컴포넌트, SSR prefetch)
  - `apps/admin/src/app/(admin)/templates/_client.tsx` (MetaDataGrid, 3 필터, 6 컬럼)
  - `apps/admin/src/app/(admin)/templates/_prefetch.ts` (withServerCookies)
- [x] TemplateDetail 페이지 - 2026-02-17
  - `apps/admin/src/app/(admin)/templates/[templateId]/page.tsx`
  - `apps/admin/src/app/(admin)/templates/[templateId]/_client.tsx` (3 모달, TemplateActions, 3 섹션)
  - `apps/admin/src/app/(admin)/templates/[templateId]/_prefetch.ts`
- [x] TemplateCreate 페이지 - 2026-02-17
  - `apps/admin/src/app/(admin)/templates/new/page.tsx`
  - `apps/admin/src/app/(admin)/templates/new/_client.tsx` (TemplateForm mode="create", 유효성 검증)
- [x] TemplateEdit 페이지 - 2026-02-17
  - `apps/admin/src/app/(admin)/templates/[templateId]/edit/page.tsx`
  - `apps/admin/src/app/(admin)/templates/[templateId]/edit/_client.tsx` (TemplateForm mode="edit", useEffect 초기화)
  - `apps/admin/src/app/(admin)/templates/[templateId]/edit/_prefetch.ts`
- [x] 사용자 리뷰 완료 (2026-02-17)
