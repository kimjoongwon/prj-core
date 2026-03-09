# dmmf-parser util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-prisma/src/utils/dmmf-parser.ts

## 역할

멀티 파일 Prisma schema를 읽어 DMMF를 구성하고, 모델/필드의 `@displayName` 메타데이터를 추출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ModelInfo | 공개 계약 요소 |
| FieldInfo | 공개 계약 요소 |
| DmmfParser | 공개 계약 요소 |

## 운영 규칙

- schema 디렉터리는 하위 도메인 폴더까지 재귀적으로 스캔해야 합니다.
- `_base.prisma`는 항상 가장 먼저 읽어 generator/datasource 블록이 선행되도록 유지합니다.
- 모델/필드 `@displayName` 추출 규칙 변경 시 subject 동기화 영향 범위를 함께 검토합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 도메인 폴더 구조를 지원하도록 schema 재귀 스캔 규칙을 문서화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
