# Inquiries Controller 기획서

> 생성일: 2026-02-25
> 타입: controller
> 위치: apps/core/api/src/module/inquiries/inquiries.controller.ts

## 역할

고객 문의(Inquiry) aggregate root의 REST 엔드포인트를 제공합니다. Controller는 인증 컨텍스트와 DTO만 수집하고, controller boundary 조합은 `InquiryFacade`로 위임합니다.

## 베이스 경로

`/api/v1/inquiries`

## 의존성

| 서비스 | 역할 |
|--------|------|
| InquiryFacade | Inquiry root 기준 CRUD, 메시지, 참여자, bootstrap, AI fill controller boundary |
| AuthContext | 현재 사용자 식별 |
| SpaceContext | 현재 Space 식별 |

## 엔드포인트

### 문의 관리

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/` | getInquiries | InquiryListQueryDto | InquiryDto[] + meta + stats | 200 | 문의 목록 조회 |
| GET | `/form/create` | getCreateInquiryForm | - | InquiryCreateUpdateFormBootstrapDto | 200 | 문의 생성 폼 bootstrap 조회 |
| GET | `/:inquiryId/form/update` | getUpdateInquiryForm | - | InquiryCreateUpdateFormBootstrapDto | 200 | 문의 수정 폼 bootstrap 조회 |
| GET | `/:inquiryId` | getInquiryById | - | InquiryDetailDto | 200 | 문의 상세 조회 |
| POST | `/` | createInquiry | CreateInquiryDto | InquiryDto | 201 | 문의 접수 |
| PATCH | `/:inquiryId` | updateInquiry | UpdateInquiryDto | InquiryDto | 200 | 문의 수정 (상태, 우선순위 등) |
| DELETE | `/:inquiryId` | deleteInquiry | - | void | 204 | 문의 삭제 |

### 문의 메시지

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/:inquiryId/messages` | getInquiryMessages | PaginationDto | InquiryMessageDto[] + meta | 200 | 문의 메시지 목록 |

### AI 기능

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| POST | `/form/ai-fill` | fillInquiryFormWithAi | FillInquiryFormRequestDto | FillInquiryFormResponseDto | 200 | 문의 폼 AI 채움 patch 생성 |

### 통계

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/stats` | getInquiryStats | InquiryStatsQueryDto | InquiryStatsDto | 200 | 문의 통계 조회 |

### SLA

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/sla/breaches` | getSlaBreaches | SlaBreachesQueryDto | SLABreachDto[] | 200 | SLA 위반 목록 |

## 인증/인가

| 엔드포인트 | 인증 필요 | Guard | 권한 |
|------------|:---------:|-------|------|
| GET `/` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| GET `/form/create` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| GET `/:inquiryId/form/update` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| GET `/:inquiryId` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| PATCH `/:inquiryId` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| DELETE `/:inquiryId` | O | RolesGuard | FULL_ACCESS |
| GET `/:inquiryId/messages` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/form/ai-fill` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| GET `/stats` | O | RolesGuard | MANAGE, FULL_ACCESS |

## 에러 코드

| 엔드포인트 | 에러 코드 |
|------------|-----------|
| GET `/` | 401, 403, 500 |
| GET `/form/create` | 401, 403, 500 |
| GET `/:inquiryId/form/update` | 401, 403, 404, 500 |
| GET `/:inquiryId` | 401, 403, 404, 500 |
| POST `/` | 400, 401, 403, 500 |
| PATCH `/:inquiryId` | 400, 401, 403, 404, 409, 500 |
| DELETE `/:inquiryId` | 400, 401, 403, 404, 500 |
| POST `/form/ai-fill` | 400, 401, 403, 500 |

## 데코레이터 사용

| 데코레이터 | 용도 |
|------------|------|
| @ApiTags("INQUIRIES") | Swagger 태그 |
| @ApiAuth() | 인증 필요 API 문서화 |
| @ApiErrors(...) | 에러 응답 문서화 |
| @ApiResponseEntity(...) | 응답 타입 문서화 |
| @ResponseMessage(...) | 응답 메시지 설정 |
| @Roles([...]) | 역할 기반 접근 제어 |
| @UseGuards(RolesGuard) | 역할 Guard 적용 |

## 비즈니스 규칙

- 모든 문의는 Space 격리 (X-Space-ID 헤더 필수)
- 메시지/참여자 변경은 child service 직접 호출이 아니라 Inquiry root application service를 통해서만 처리한다.
- CLOSED 상태 문의는 메시지 전송 및 상태 변경 제약을 따른다.
- Create/Update 화면은 bootstrap 계약(defaultObject/options/ui/fieldMeta/aiSchemas)을 따른다.
- AI 채움은 서버에서 fillable/path 권한을 재검증한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-02-25 | 초기 생성 | orch-requirement |
| 2026-03-01 | 문의 Form Bootstrap(`/form/create`, `/:inquiryId/form/update`) 및 AI Fill(`/form/ai-fill`) 반영, draft endpoint 제거 | codex |
| 2026-03-11 | controller 경로와 의존성을 Inquiry root Service 기준으로 갱신 | codex |
| 2026-03-11 | Form bootstrap/AI patch DTO의 Swagger extra model 등록을 반영 | codex |
| 2026-03-12 | Controller-서비스 API 정합성 정리 (`createInquiry`/`sendInquiryMessage` 호출명 반영, Payload 구성 보강) | codex |
| 2026-03-12 | 목록 조회 메타 계산을 InquiryFacade로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `InquiryFacade`로 이관 | codex |
| 2026-03-13 | admin/idp/web 및 fe-ui 런타임 미사용 `sendInquiryMessage` endpoint를 제거해 메시지 API를 조회 전용으로 정리 | codex |
