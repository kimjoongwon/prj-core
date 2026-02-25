# Templates Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/server/src/module/template/templates.controller.ts`

## 역할

메시지 템플릿(EMAIL/SMS/PUSH) 관련 CRUD 및 특수 액션(활성 토글, 미리보기, 발송 테스트) API를 제공합니다. System Space 전용 API로 FULL_ACCESS 권한이 필요합니다.

## 베이스 경로

`/api/v1/templates`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | Query: `QueryTemplateDto` (search, type, isActive, skip, take) | `TemplateDto[]` + meta | 템플릿 목록 조회 (검색, 필터링, 페이지네이션) |
| GET | `/:templateId` | Param: `templateId` (UUID) | `TemplateDto` | 템플릿 상세 조회 |
| POST | `/` | Body: `CreateTemplateDto` | `TemplateDto` | 템플릿 등록 |
| PATCH | `/:templateId` | Param: `templateId` (UUID), Body: `UpdateTemplateDto` | `TemplateDto` | 템플릿 수정 |
| DELETE | `/:templateId` | Param: `templateId` (UUID) | void (204) | 템플릿 삭제 |
| PATCH | `/:templateId/toggle-status` | Param: `templateId` (UUID) | `TemplateDto` | 활성/비활성 토글 |
| POST | `/:templateId/preview` | Param: `templateId` (UUID), Body: `PreviewTemplateDto` | PreviewResult | 변수 치환 미리보기 |
| POST | `/:templateId/send-test` | Param: `templateId` (UUID), Body: `SendTestTemplateDto` | SendTestResult | 테스트 발송 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET `/` | O | FULL_ACCESS (`@Roles`, `RolesGuard`) |
| GET `/:templateId` | O | FULL_ACCESS |
| POST `/` | O | FULL_ACCESS |
| PATCH `/:templateId` | O | FULL_ACCESS |
| DELETE `/:templateId` | O | FULL_ACCESS |
| PATCH `/:templateId/toggle-status` | O | FULL_ACCESS |
| POST `/:templateId/preview` | O | FULL_ACCESS |
| POST `/:templateId/send-test` | O | FULL_ACCESS |

## 의존성

| 서비스 | 역할 |
|--------|------|
| `TemplatesService` | 템플릿 CRUD, 토글, 미리보기, 발송 테스트 로직 |

## 목록 조회 응답 구조

```typescript
{
  data: TemplateDto[],
  meta: {
    total: number,
    skip: number,
    take: number,
    totalPages: number
  }
}
```

- `wrapResponse` 유틸 사용으로 data + meta 구조 반환

## 응답 메시지

| 엔드포인트 | 메시지 키 |
|------------|----------|
| GET `/` | `template.list.success` |
| GET `/:templateId` | `template.read.success` |
| POST `/` | `template.create.success` |
| PATCH `/:templateId` | `template.update.success` |
| DELETE `/:templateId` | `template.delete.success` |
| PATCH `/:templateId/toggle-status` | `template.toggle-status.success` |
| POST `/:templateId/preview` | `template.preview.success` |
| POST `/:templateId/send-test` | `template.send-test.success` |

## 에러 응답

| 엔드포인트 | 상태 코드 | 조건 |
|------------|----------|------|
| GET `/` | 401, 403, 500 | 인증/권한/서버 에러 |
| GET `/:templateId` | 401, 403, 404, 500 | 인증/권한/미존재/서버 에러 |
| POST `/` | 400, 401, 403, 409, 500 | 유효성/인증/권한/코드 중복/서버 에러 |
| PATCH `/:templateId` | 400, 401, 403, 404, 500 | 유효성/인증/권한/미존재/서버 에러 |
| DELETE `/:templateId` | 401, 403, 404, 500 | 인증/권한/미존재/서버 에러 |
| PATCH `/:templateId/toggle-status` | 401, 403, 404, 500 | 인증/권한/미존재/서버 에러 |
| POST `/:templateId/preview` | 401, 403, 404, 500 | 인증/권한/미존재/서버 에러 |
| POST `/:templateId/send-test` | 400, 401, 403, 404, 500 | 유효성/인증/권한/미존재/서버 에러 |

## 특이사항

- 모든 엔드포인트에 `@ApiAuth()` 데코레이터 적용
- `ParseUUIDPipe`로 templateId 파라미터 UUID 유효성 검증
- DELETE는 `HttpStatus.NO_CONTENT` (204) 반환, body 없음
- API 태그: `TEMPLATES`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
