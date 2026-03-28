# req-page-planner.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/req-page-planner.toml

## 역할

`req-page-planner`를 route skeleton 소비형 `page.spec.md` planner로 재정의합니다.
root page뿐 아니라 named slot 콘텐츠용 `@slot/**/page.spec.md`도 같은 원칙으로 계획합니다.

## 운영 규칙

- `page.spec.md`에는 `## Consumed Layout Contract`와 `## Rendering Decision`을 반드시 포함합니다.
- `Rendering Decision`에는 `page role`, `reusable target`, `page component path`, `참조한 구현 role`을 함께 기록합니다.
- `Rendering Decision.page component path`는 반드시 `packages/fe-ui/src/page/[PageName]/[PageName].tsx` 형식을 사용합니다.
- `page role`은 `master | detail | form` 중 하나로 확정하고, `reusable target`은 Stage 5 구현 role과 일치해야 합니다.
- `req-page-planner`는 `fe-master-builder`, `fe-detail-builder`, `fe-form-builder`, `fe-ui-page-builder`, `fe-page-builder`를 함께 의식해 기획합니다.
- named slot 콘텐츠일 때는 consumed slot key와 대상 파일 경로를 계약에 함께 기록합니다.
- route-level 구조/표면 배치는 `layout.spec.md`가 먼저 정의합니다.
- `page.spec.md`는 데이터, 이벤트, 테스트, CSR/SSR 판단을 중심으로 작성합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | `page role/reusable target`과 `master/detail/form` 구현 role 참조 규칙을 추가 | codex |
| 2026-03-26 | page planner가 기록하는 pure page 경로를 folder-based sidecar 패턴으로 명시 | codex |
| 2026-03-21 | route layout contract 소비형 page planner로 역할을 재정의 | codex |
| 2026-03-21 | named slot 콘텐츠 spec 기획 규칙을 추가 | codex |
