# whitelist-entry.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/whitelist-entry.prisma

## 역할

화이트리스트 항목 엔티티(`WhitelistEntry`)와 유형 enum(`WhitelistType`)을 정의합니다.
IP/이메일 도메인/CORS Origin 허용 목록의 데이터 원본을 제공합니다.

## 운영 규칙

- `whitelist-entry.prisma` 변경 시 `whitelist-entry.prisma.spec.md`를 함께 갱신합니다.
- `type + value` 유니크 무결성을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | security-policy.prisma에서 WhitelistEntry/WhitelistType을 분리하여 Aggregate Root 단위로 정렬 | codex |
