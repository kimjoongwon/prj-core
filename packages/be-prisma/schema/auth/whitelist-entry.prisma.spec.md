# whitelist-entry.prisma 스키마 기획서

> 생성일: 2026-03-09
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/auth/whitelist-entry.prisma

## 역할

화이트리스트 항목 엔티티(`WhitelistEntry`)와 유형 enum(`WhitelistType`)을 정의합니다.
IP/이메일 도메인/CORS Origin 허용 목록의 데이터 원본을 제공합니다.

## 운영 규칙

- `whitelist-entry.prisma` 변경 시 `whitelist-entry.prisma.spec.md`를 함께 갱신합니다.
- `type + value` 유니크 무결성을 유지합니다.
- 모델 주석 메타데이터는 `@aggregate-root: true`, `@schema-type`와 보조 태그(`@relation-pattern`, `@ownership`, `@scope`, `@join-role`) 체계를 함께 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 스키마 파일을 도메인 폴더 구조로 재배치하고 sidecar 위치 메타데이터를 갱신 | codex |
| 2026-03-10 | 모델 주석 분류를 주 역할(`@schema-type`)과 보조 태그 체계로 개편 | codex |
| 2026-03-09 | security-policy.prisma에서 WhitelistEntry/WhitelistType을 분리하여 Aggregate Root 단위로 정렬 | codex |
