# inquiry-thread.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/inquiry-thread.prisma

## 역할

문의 대화 스레드/메시지/참여자/첨부파일과 관련 enum을 정의합니다.

## 운영 규칙

- `inquiry-thread.prisma` 변경 시 `inquiry-thread.prisma.spec.md`를 함께 갱신합니다.
- 스레드 및 메시지의 실시간 상태 필드 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용으로 inquiry.prisma에서 대화 도메인 분리 | codex |

