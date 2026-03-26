# check-auth-email-templates script 기획서

> 생성일: 2026-03-23
> 타입: script
> 위치: scripts/check-auth-email-templates.js

## 역할

인증 메일 발송에 필요한 필수 템플릿 2개(`AUTH_PASSWORD_RESET`, `AUTH_TEMPORARY_PASSWORD`)가
대상 DB에 존재하고, `EMAIL` 유형이며, 활성 상태인지 점검합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | `packages/be-prisma/.env`의 local DB를 점검 |
| `--target=local|stg|prod` | 점검 대상 DB 선택 |
| `--env-file=...` | 다른 env 파일 경로 지정 |

## 출력

| 항목 | 설명 |
|------|------|
| `TARGET` | 점검 대상 |
| `ENV_FILE` | 사용한 env 파일 |
| `CONNECTION` | 비밀값을 제외한 연결 정보 |
| `FOUND` | 조회된 템플릿 row 수 |
| `STATUS` | `OK`, `FAILED`, `ERROR` 중 하나 |
| `MISSING`, `INACTIVE`, `REMOVED`, `TYPE_MISMATCH` | 실패 세부 원인 |

## 점검 규칙

- 필수 코드 2개가 모두 존재해야 합니다.
- 두 템플릿 모두 `EMAIL` 유형이어야 합니다.
- 두 템플릿 모두 `is_active=true`여야 합니다.
- `removed_at`이 설정된 템플릿은 실패로 간주합니다.
- DB 연결 자체가 불가능하면 `STATUS=ERROR`와 함께 non-zero로 종료합니다.

## 구현 체크리스트

- [x] local/stg/prod 대상 분기
- [x] env 파일 경로 오버라이드 지원
- [x] 비밀값을 제외한 연결 정보 출력
- [x] 실패 원인별 non-zero 종료

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-23 | 인증 메일 필수 템플릿 존재/활성 상태를 점검하는 스크립트 신규 추가 | codex |
