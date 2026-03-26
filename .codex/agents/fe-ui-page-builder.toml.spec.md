# fe-ui-page-builder.toml 기획서

> 생성일: 2026-03-25
> 타입: agent-config
> 위치: .codex/agents/fe-ui-page-builder.toml

## 역할

`packages/fe-ui/src/page/[PageName]/[PageName].tsx` 기준의 pure page component를 담당하는 구현 에이전트입니다.
이 레이어는 `apps/admin/web`, `apps/idp/web`의 app route `page.tsx`와 분리되어,
page-level visual composition과 props contract만 소유합니다.

## 운영 규칙

- page visual owner는 반드시 `packages/fe-ui/src/page/[PageName]/[PageName].tsx`입니다.
- page는 pure presentational contract를 유지하고, 데이터와 핸들러는 props로 받습니다.
- page 내부에서 API hook, router, search params, cookies, headers, MobX store를 직접 읽지 않습니다.
- page는 `widget/feature/master/detail/form/layout/rhythm/display/control` 등 하위 재사용 계층만 조합합니다.
- 신규 stack/spacer 조합은 semantic rhythm preset을 우선 사용합니다.
- `src/page/admin`, `src/page/idp` 같은 단순 namespace depth는 금지합니다.
- `src/page`의 page component와 sidecar는 반드시 `src/page/[PageName]/` 폴더 안에 함께 둡니다.
- `src/page/[PageName].tsx`, `src/page/[PageName].spec.md` 같은 flat page 배치는 금지합니다.
- 코드 수정 시 `src/page/index.ts` export와 대응 `.spec.md`를 동기화합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | `rhythm` 레이어와 semantic spacing preset 사용 규칙을 반영 | codex |
| 2026-03-26 | pure page owner 경로를 folder-based sidecar 패턴으로 구체화 | codex |
| 2026-03-26 | page component와 sidecar를 `src/page/[PageName]/` 폴더로 묶는 규칙을 추가 | codex |
| 2026-03-25 | `packages/fe-ui/src/page/[PageName]/[PageName].tsx` pure page 전담 agent를 추가 | codex |
