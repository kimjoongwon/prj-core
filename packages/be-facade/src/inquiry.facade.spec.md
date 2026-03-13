# Inquiry Facade 기획서

> 생성일: 2026-03-11
> 타입: facade
> 위치: packages/be-facade/src/inquiry.facade.ts

## 역할

Inquiry aggregate root API의 controller boundary를 담당합니다.
메시지/참여자 변경은 Inquiry root를 통해서만 수행하며 목록/메시지 조회 메타를 조립합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Inquiry root facade 신규 생성 | codex |
| 2026-03-13 | `@cocrepo/app`에서 `@cocrepo/facade`로 이관 | codex |
| 2026-03-13 | frontend 런타임 미사용 메시지 전송/참여 join boundary 메서드를 제거 | codex |
