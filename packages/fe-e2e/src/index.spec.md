# e2e index 기획서

> 생성일: 2026-03-04
> 타입: barrel
> 위치: packages/fe-e2e/src/index.ts

## 역할

`@cocrepo/e2e` 서브패스에서 사용하는 E2E 헬퍼를 재수출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `idp-login` | IDP 로그인 헬퍼 |
| `oidc-login` | OIDC 공통 로그인 헬퍼 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 문서 정합성을 위해 레거시 패키지 경로 표기를 제거 | codex |
| 2026-03-06 | E2E 헬퍼를 신규 패키지 `@cocrepo/e2e`로 분리 이관 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-04 | E2E 헬퍼 서브패스 배럴 신규 생성 | codex |
