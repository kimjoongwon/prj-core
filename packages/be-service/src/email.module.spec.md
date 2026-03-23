# Email Module 기획서

> 생성일: 2026-03-23
> 타입: module
> 위치: packages/be-service/src/email.module.ts

## 역할

이 파일은 `EmailService`와 실제 전송 구현체 사이의 Nest DI wiring을 캡슐화합니다.
기본 바인딩은 `EmailProvider` 추상 token을 `SmtpEmailProvider` 구현체에 연결합니다.
또한 `EmailService`가 사용하는 템플릿 렌더링 의존성(`TemplateService`, `TemplatesRepository`)도 함께 등록합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| `EmailModule` | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@nestjs/common` | 모듈 선언 |
| `./email.service` | `EmailProvider`, `SmtpEmailProvider`, `EmailService` wiring |
| `./template.service` | 메일 템플릿 렌더링 |
| `@cocrepo/repository` | 템플릿 영속성 접근 |

## 비즈니스 규칙

- importing module은 `EmailModule`만 가져오면 `EmailService`를 바로 주입받을 수 있습니다.
- 기본 구현체는 SMTP이지만, 추후 다른 provider로 교체할 때는 이 모듈의 binding만 바꾸면 됩니다.
- 템플릿 기반 메일 발송을 위해 `TemplateService`와 `TemplatesRepository`를 함께 구성합니다.

## 구현 체크리스트

- [x] `EmailProvider -> SmtpEmailProvider` 바인딩
- [x] 템플릿 렌더링 의존성 등록
- [x] `EmailService` export

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | `EmailService`의 provider binding을 모듈 수준으로 캡슐화하는 `EmailModule` 신규 추가 | codex |
