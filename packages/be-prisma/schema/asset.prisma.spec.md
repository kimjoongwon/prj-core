# asset.prisma 스키마 기획서

> 생성일: 2026-03-06
> 타입: prisma-schema
> 위치: packages/be-prisma/schema/asset.prisma

## 역할

Asset 도메인의 핵심 모델(에셋 본체, 파생 타입, 폴더/앨범 등)과 관계를 정의합니다.
파일 메타데이터, 분류/연결 구조, 상속/확장 관계를 스키마 차원에서 보장합니다.

## 운영 규칙

- `asset.prisma` 변경 시 `asset.prisma.spec.md`를 함께 갱신합니다.
- CTI/확장 관계를 유지하고, 무결성 조건은 Prisma 제약 또는 SQL 제약 계획으로 명시합니다.
- 모델 주석 표준(`@schema-type`, `@description`, `/// @displayName`)을 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-09 | strict aggregate-root 분할 적용: Folder/Album 도메인을 별도 파일로 분리하고 asset.prisma는 Asset CTI 코어만 유지 | codex |
| 2026-03-09 | 주석 표준 일관성 정렬: `@DisplayName` 표기를 `@displayName`으로 통일 | codex |
| 2026-03-06 | 누락된 sidecar spec 신규 생성 | codex |
