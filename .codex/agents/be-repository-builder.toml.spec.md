# be-repository-builder.toml 기획서

> 생성일: 2026-03-10
> 타입: agent-config
> 위치: .codex/agents/be-repository-builder.toml

## 역할

Repository builder 에이전트의 생성 범위와 명명 규칙을 정의합니다.
특히 Prisma schema의 `@aggregate-root: true` 모델에 대해서만 독립 Repository를 만들도록 기준을 고정합니다.

## 운영 규칙

- 에이전트는 대상 모델의 schema 주석에서 `@aggregate-root: true`를 먼저 확인해야 합니다.
- `CHILD`, `DETAIL`, `JOIN` 등 비대표 모델은 부모 aggregate root Repository 내부 메서드로 처리하도록 안내해야 합니다.
- `packages/be-repository/src/index.ts`와 대응 `*.repository.spec.md` 업데이트를 항상 산출물에 포함해야 합니다.
- Repository 메서드명은 도메인 목적이 아니라 데이터 조회 형태를 설명해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | aggregate root 모델에만 Repository를 생성하도록 builder 규칙과 sidecar 문서 신규 생성 | codex |
