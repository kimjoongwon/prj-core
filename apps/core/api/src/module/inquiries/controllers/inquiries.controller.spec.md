# Inquiries Controller 기획서

> 생성일: 2026-02-25
> 타입: controller
> 위치: apps/server/src/module/inquiries/controllers/inquiries.controller.ts

## 역할

고객 문의(Inquiry) 리소스의 CRUD 및 추가 기능을 처리하는 REST 컨트롤러. 문의 목록, 상세, 생성, 수정, AI 초안 생성, 메시지 관리 등의 엔드포인트를 제공한다.

## 베이스 경로

`/api/v1/inquiries`

## 의존성

| 서비스 | 역할 |
|--------|------|
| InquiriesService | 문의 비즈니스 로직 처리 |
| InquiryMessagesService | 문의 메시지 비즈니스 로직 처리 |
| KnowledgeBaseService | 지식베이스 검색 |

## 엔드포인트

### 문의 관리

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/` | getInquiries | InquiryListQueryDto | InquiryDto[] + meta + stats | 200 | 문의 목록 조회 |
| GET | `/:inquiryId` | getInquiryById | - | InquiryDetailDto | 200 | 문의 상세 조회 |
| POST | `/` | createInquiry | CreateInquiryDto | InquiryDto | 201 | 문의 접수 |
| PATCH | `/:inquiryId` | updateInquiry | UpdateInquiryDto | InquiryDto | 200 | 문의 수정 (상태, 우선순위 등) |
| DELETE | `/:inquiryId` | deleteInquiry | - | void | 204 | 문의 삭제 |

### 문의 메시지

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| GET | `/:inquiryId/messages` | getInquiryMessages | PaginationDto | InquiryMessageDto[] + meta | 200 | 문의 메시지 목록 |
| POST | `/:inquiryId/messages` | sendInquiryMessage | CreateInquiryMessageDto | InquiryMessageDto | 201 | 메시지 전송 |

### AI 기능

| Method | 경로 | Operation ID | DTO (요청) | 반환값 | HTTP Status | 설명 |
|--------|------|-------------|------------|--------|-------------|------|
| POST | `/:inquiryId/draft` | generateAIDraft | GenerateDraftDto | AIDraftDto | 200 | AI 응답 초안 생성 |
| POST | `/:inquiryId/auto-resolve` | attemptAutoResolve | AutoResolveDto | AutoResolveResultDto | 200 | AI 자동 해결 시도 |

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
| GET `/:inquiryId` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| PATCH `/:inquiryId` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| DELETE `/:inquiryId` | O | RolesGuard | FULL_ACCESS |
| GET `/:inquiryId/messages` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/:inquiryId/messages` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/:inquiryId/draft` | O | RolesGuard | MANAGE, FULL_ACCESS, AGENT |
| POST `/:inquiryId/auto-resolve` | O | RolesGuard | FULL_ACCESS |
| GET `/stats` | O | RolesGuard | MANAGE, FULL_ACCESS |
| GET `/sla/breaches` | O | RolesGuard | MANAGE, FULL_ACCESS |

## 에러 코드

| 엔드포인트 | 에러 코드 |
|------------|-----------|
| GET `/` | 401, 403, 500 |
| GET `/:inquiryId` | 401, 403, 404, 500 |
| POST `/` | 400, 401, 403, 500 |
| PATCH `/:inquiryId` | 400, 401, 403, 404, 409, 500 |
| DELETE `/:inquiryId` | 400, 401, 403, 404, 500 |
| POST `/:inquiryId/messages` | 400, 401, 403, 404, 500 |
| POST `/:inquiryId/draft` | 401, 403, 404, 500 (AI 서비스 에러) |

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
- AGENT 역할은 자신이 담당한 문의만 조회/수정 가능 (선택적)
- CLOSED 상태 문의는 수정 불가
- AI 초안 생성은 최근 메시지 기반
- 자동 해결은 신뢰도 임계값 이상일 때만 적용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-25 | 초기 생성 | orch-requirement |
