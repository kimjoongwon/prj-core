# be-repository-builder.toml 기획서

> 생성일: 2026-03-10
> 타입: agent-config
> 위치: .codex/agents/be-repository-builder.toml

## 역할

Repository builder 에이전트의 생성 범위와 명명 규칙을 정의합니다.
Prisma schema의 `@schema-owner: true` 모델 기준으로 독립 Repository를 만들도록 기준을 고정합니다.

## 운영 규칙

- 에이전트는 대상 모델의 schema 주석에서 `@schema-owner: true`를 먼저 확인해야 합니다.
- `CHILD`, `DETAIL`, `JOIN` 등 비대표 모델은 부모 schema-owner Repository 내부 메서드로 처리하도록 안내해야 합니다.
- `packages/be-repository/src/index.ts`와 대응 `*.repository.spec.md` 업데이트를 항상 산출물에 포함해야 합니다.
- Repository 메서드명은 도메인 목적이 아니라 데이터 조회 형태를 설명해야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-10 | Repository 생성 대상을 `@schema-owner: true` + `@aggregate-root: true` 조합으로 명확화 | codex |
| 2026-03-10 | aggregate root 모델에만 Repository를 생성하도록 builder 규칙과 sidecar 문서 신규 생성 | codex |
| 2026-03-11 | schema-owner 기준 단일 기준(`@schema-owner: true`)으로 repository 규칙 정합화 및 재발 방지 문서화 | codex |
| 2026-03-12 | be-repository-builder 규칙을 child 모델 독립 Repository 금지와 pass-through 사례로 보강 | codex |
