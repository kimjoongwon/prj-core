# Templates Controller 기획서

> 생성일: 2026-02-18
> 타입: controller
> 위치: `apps/core/api/src/module/templates/templates.controller.ts`

## 역할

Template CRUD 및 특수 액션 API를 노출하며, 목록 메타 계산과 유즈케이스 실행은 `TemplatesService`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| templatesService | TemplatesService | Template 목록/상세/생성/수정/삭제/특수 액션 유즈케이스 |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getTemplates` | 템플릿 목록 조회 (`data + meta`) |
| GET | `/:templateId` | `getTemplate` | 템플릿 상세 조회 |
| POST | `/` | `createTemplate` | 템플릿 등록 |
| PATCH | `/:templateId` | `updateTemplate` | 템플릿 수정 |
| DELETE | `/:templateId` | `deleteTemplate` | 템플릿 삭제 |
| PATCH | `/:templateId/toggle-status` | `toggleTemplateStatus` | 활성/비활성 토글 |
| POST | `/:templateId/preview` | `previewTemplate` | 변수 치환 미리보기 |
| POST | `/:templateId/send-test` | `sendTestTemplate` | 테스트 발송 |

## 비즈니스 메모

- 목록 응답의 pagination meta 계산은 Service가 담당합니다.
- controller는 `wrapResponse`를 직접 호출하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | Controller 의존성을 TemplatesService로 전환 | codex |
| 2026-03-12 | 템플릿 Controller 메서드 매핑 정합성 정리 (`getTemplateById`/`create`/`update`/`remove`/`toggleStatus`/`preview`/`sendTest`) | codex |
