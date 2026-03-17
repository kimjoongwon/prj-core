# reference-data-migration.prisma 스키마 기획서

> 생성일: 2026-03-17
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/platform/reference-data-migration.prisma

## 역할

운영 기준 데이터(reference data) migration의 적용 이력을 기록합니다.

## 운영 규칙

- `reference-data-migration.prisma` 변경 시 sidecar 문서를 함께 갱신합니다.
- 이력 모델은 운영 배포 추적용이므로 기존 row를 덮어쓰지 않습니다.
- 같은 migration `id`를 수정하는 대신 신규 migration을 추가합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-17 | reference data migration checksum 및 적용 시각을 저장하는 이력 모델 추가 | codex |
