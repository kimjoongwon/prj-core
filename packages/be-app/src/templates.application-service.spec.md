# Templates ApplicationService 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-app/src/templates.application-service.ts

## 역할

Template 컨트롤러의 CRUD/특수 액션 호출과 목록 응답 메타 계산을 ApplicationService로 옮깁니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| TemplatesService | Template CRUD, 상태 토글, 미리보기, 테스트 발송 수행 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getTemplates | 목록과 pagination meta를 함께 반환 |
| getTemplate | 템플릿 상세 조회 |
| createTemplate | 템플릿 생성 |
| updateTemplate | 템플릿 수정 |
| deleteTemplate | 템플릿 삭제 |
| toggleTemplateStatus | 활성 상태 토글 |
| previewTemplate | 변수 치환 미리보기 |
| sendTestTemplate | 테스트 발송 |

## 비즈니스 규칙

- 목록 응답은 `data + meta` 계약을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Templates 도메인 thin wrapper application service 신규 생성 | codex |
