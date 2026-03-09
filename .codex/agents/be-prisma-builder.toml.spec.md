# be-prisma-builder.toml 기획서

> 생성일: 2026-03-10
> 타입: agent-config
> 위치: .codex/agents/be-prisma-builder.toml

## 역할

Prisma 스키마 빌더 에이전트의 작업 범위와 multi-file schema 규칙을 정의합니다.
도메인 폴더 구조, `@aggregate-root: true`, `@schema-type` 메타데이터 기준을 이 파일에서 고정합니다.

## 운영 규칙

- `packages/be-prisma/schema/_base.prisma`, `packages/be-prisma/docs/schema-file-conventions.md`, `packages/be-prisma/scripts/validate-schema-conventions.ts` 기준과 어긋나면 안 됩니다.
- 에이전트는 flat schema 경로를 새로 만들지 않고 도메인 폴더 경로만 사용해야 합니다.
- `_base.prisma`를 제외한 각 schema 파일의 대표 모델 1개에만 `@aggregate-root: true`를 두도록 안내해야 합니다.
- 스키마 변경 시 대응되는 `*.prisma.spec.md`와 변경 이력 업데이트까지 산출물 범위에 포함해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | 도메인 폴더 구조와 `@aggregate-root: true` 기반 Prisma builder 규칙 문서 신규 생성 | codex |
