# IdpManagement Progress

## Stage 1: 기획
- [x] L0-L2 기획 (01-overview.md) (2026-02-10)
- [x] L3-L4 기획 (02-structure.md) (2026-02-10)
- [x] L5-L6 기획 (03-interactions.md) (2026-02-10)
- [x] L7-L8 기획 (04-ui-details.md) (2026-02-10)
- [x] L9-L10 기획 (05-technical-design.md) (2026-02-10)
- [x] 사용자 리뷰 완료 (2026-02-10)

## Stage 2: 스키마
- [x] Prisma 스키마 - 기존 OidcClient, OidcModel 활용 (변경 불필요) (2026-02-10)
- [x] Entity 클래스 (2026-02-10)
  - 생성: `packages/be-entity/src/oidc-client.entity.ts`
  - 생성: `packages/be-entity/src/oidc-model.entity.ts`
- [x] DTO 클래스 (2026-02-10)
  - 생성: `packages/be-dto/src/oidc/oidc-client.dto.ts` (Response)
  - 생성: `packages/be-dto/src/oidc/oidc-session.dto.ts` (Response)
  - 생성: `packages/be-dto/src/create/create-oidc-client.dto.ts`
  - 생성: `packages/be-dto/src/update/update-oidc-client.dto.ts`
- [x] Query DTO 클래스 (2026-02-10)
  - 생성: `packages/be-dto/src/query/query-oidc-client.dto.ts`
  - 생성: `packages/be-dto/src/query/query-oidc-session.dto.ts`
- [x] Repository 클래스 (2026-02-10)
  - 생성: `packages/be-repository/src/oidc-clients.repository.ts`
  - 생성: `packages/be-repository/src/oidc-models.repository.ts`
- [x] Seed 데이터 - 기존 시드 활용 (변경 불필요) (2026-02-10)
- [x] TypeScript 타입 체크 통과 (2026-02-10)
- [x] 사용자 리뷰 완료 (2026-02-10)

## Stage 3: 백엔드
- [x] OidcClientsService (2026-02-10)
  - 생성: `packages/be-service/src/oidc-clients.service.ts`
  - getMany, getById, create, update, remove, toggleActive
- [x] OidcSessionsService (2026-02-10)
  - 생성: `packages/be-service/src/oidc-sessions.service.ts`
  - getMany, revokeByKey, revokeByGrantId
- [x] OidcClientsController + Module (2026-02-10)
  - 생성: `apps/server/src/module/oidc-client/oidc-clients.controller.ts`
  - 생성: `apps/server/src/module/oidc-client/oidc-clients.module.ts`
  - API: GET/POST /oidc-clients, GET/PATCH/DELETE /oidc-clients/:oidcClientId, PATCH /oidc-clients/:oidcClientId/toggle-active
- [x] OidcSessionsController + Module (2026-02-10)
  - 생성: `apps/server/src/module/oidc-session/oidc-sessions.controller.ts`
  - 생성: `apps/server/src/module/oidc-session/oidc-sessions.module.ts`
  - API: GET /oidc-sessions, POST /oidc-sessions/:key/revoke, POST /oidc-sessions/revoke-by-grant/:grantId
- [x] AppModule 라우팅 등록 (2026-02-10)
  - `/api/v1/oidc-clients` → OidcClientsModule
  - `/api/v1/oidc-sessions` → OidcSessionsModule
- [x] Service index.ts 업데이트 (2026-02-10)
- [x] TypeScript 타입 체크 통과 (2026-02-10)
- [x] 사용자 리뷰 완료 (2026-02-10)

## Stage 4: 컴포넌트 (페이지별)
- [x] OidcClientList 컴포넌트 (2026-02-10)
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/AuthMethodCell/AuthMethodCell.tsx`
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/GrantTypeCell/GrantTypeCell.tsx`
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/ActiveStatusCell/ActiveStatusCell.tsx`
  - 수정: `packages/fe-ui/src/components/ui/data-display/cells/index.ts` (barrel export 추가)
  - Widget/Feature: 불필요 (기존 MetaDataGrid, PageSurface 활용)
- [x] OidcClientDetail 컴포넌트 (2026-02-10)
  - 생성: `packages/fe-ui/src/components/widget/SecretField/SecretField.tsx` (마스킹/보기/복사)
  - 수정: `packages/fe-ui/src/components/widget/index.ts` (SecretField export 추가)
  - Widget: SecretField만 신규 (DetailRow는 기존 dl/dt/dd 패턴 활용)
  - Feature: OidcClientActions는 PageSurface actions 인라인으로 처리 (Roles 상세 패턴 동일)
- [x] OidcClientCreate 컴포넌트 (2026-02-10)
  - 생성: `packages/fe-ui/src/components/widget/RedirectUriListInput/RedirectUriListInput.tsx` (동적 URI 추가/삭제)
  - 수정: `packages/fe-ui/src/components/widget/index.ts` (RedirectUriListInput export 추가)
  - Feature: OidcClientForm은 인라인 폼으로 처리 (Roles 등록 패턴 동일, useLocalObservable)
- [x] OidcClientEdit 컴포넌트 (2026-02-10)
  - 신규 컴포넌트 불필요 (RedirectUriListInput 재사용, 폼 인라인)
- [x] OidcSessionList 컴포넌트 (2026-02-10)
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/ModelTypeCell/ModelTypeCell.tsx` (모델 타입 컬러 코딩 뱃지)
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/ExpiryCell/ExpiryCell.tsx` (만료 시간 + 남은 시간)
  - 생성: `packages/fe-ui/src/components/ui/data-display/cells/RevokeButtonCell/RevokeButtonCell.tsx` (폐기 버튼 + 확인 팝오버)
  - 수정: `packages/fe-ui/src/components/ui/data-display/cells/index.ts` (barrel export 추가)
  - Widget/Feature: 불필요 (기존 MetaDataGrid, PageSurface 활용)

## Stage 5: 페이지 (페이지별)
- [x] OidcClientList 페이지 (2026-02-10)
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/layout.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/_prefetch.ts`
  - 주의: Orval codegen 필요 (로컬 서버 실행 후 `pnpm --filter=@cocrepo/api codegen`)
- [x] OidcClientDetail 페이지 (2026-02-10)
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/_prefetch.ts`
  - 구성: 기본 정보 (SecretField), 인증 설정, Redirect URIs, 추가 정보
  - 액션: 수정/삭제/활성토글 버튼 + 삭제 확인 모달
- [x] OidcClientCreate 페이지 (2026-02-10)
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/new/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/new/_client.tsx`
  - 구성: 기본 정보 (clientId/name/secret + 자동생성 + Public 토글), 인증 설정 (Select/CheckboxGroup), Redirect URIs (RedirectUriListInput), 추가 정보
  - 폼: useLocalObservable + validate + useCreateOidcClient mutation
- [x] OidcClientEdit 페이지 (2026-02-10)
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/edit/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/edit/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-clients/[oidcClientId]/edit/_prefetch.ts`
  - 구성: Client ID (readonly) + 나머지 필드 수정 가능
  - 폼: useLocalObservable + useEffect 초기화 + useUpdateOidcClient mutation
- [x] OidcSessionList 페이지 (2026-02-10)
  - 생성: `apps/admin/src/app/(admin)/oidc-sessions/layout.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-sessions/page.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-sessions/_client.tsx`
  - 생성: `apps/admin/src/app/(admin)/oidc-sessions/_prefetch.ts`
  - 구성: ModelType 필터(Select), DataGrid (key/modelType/grantId/expiresAt/createdAt/actions)
  - 기능: 단건 폐기 (RevokeButtonCell), Grant 일괄 폐기 (Grant ID 클릭 → 확인 모달)
  - 주의: Orval codegen 필요 (로컬 서버 실행 후 `pnpm --filter=@cocrepo/api codegen`)
