# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/fe-ui/src/page/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `src/page/*` pure page component 배럴 export |
| export type | route container가 pure page props/state contract를 import하는 타입 배럴 |
| hook alias export | inquiry detail route가 쓰는 page-local websocket hook을 이름 충돌 없이 재노출 |

## Page Sidecar 폴더 규칙

- `packages/fe-ui/src/page` 계층은 sidecar 방식을 쓸 때 반드시 동일 이름 폴더를 사용합니다.
- 허용 예: `packages/fe-ui/src/page/AddressEmailVerifyPage/AddressEmailVerifyPage.tsx`
- 허용 예: `packages/fe-ui/src/page/AddressEmailVerifyPage/AddressEmailVerifyPage.spec.md`
- 허용 예: `packages/fe-ui/src/page/AddressEmailVerifyPage/AddressEmailVerifyPage.stories.tsx`
- 허용 예: `packages/fe-ui/src/page/AddressEmailVerifyPage/AddressEmailVerifyPage.stories.spec.md`
- 금지 예: `packages/fe-ui/src/page/AddressEmailVerifyPage.tsx`
- 금지 예: `packages/fe-ui/src/page/AddressEmailVerifyPage.spec.md`
- `src/page` 바로 아래에는 page component 폴더와 공용 배럴(`index.ts`, `index.spec.md`)만 둡니다.

## Migration Audit

- admin/idp route page pure page 이관 현황은 `packages/fe-ui/src/page/migration-audit.md`를 기준으로 확인합니다.
- 전체 이관 완료 여부를 말할 때는 반드시 audit 문서를 먼저 확인합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | inquiry/actions/idp pure page refactor에 맞춰 props contract export와 `useInquiryDetailWebSocket` alias export를 추가 | codex |
| 2026-03-30 | ground/task/template/role edit page 4종의 pure page props contract 배럴 export를 추가 | codex |
| 2026-03-30 | create page 5종의 pure page props contract 배럴 export를 추가 | codex |
| 2026-03-30 | `AdminTimelinesTimelineIdEditPageProps` 배럴 export를 추가해 pure page props contract를 외부 route에서 사용할 수 있게 정리 | codex |
| 2026-03-29 | admin 목록 pure page용 query input / row / props export를 배럴에 추가하고 thin route container 소비 경로를 정리 | codex |
| 2026-03-26 | route page pure page 이관 현황 문서(`migration-audit.md`) 참조 규칙 추가 | codex |
| 2026-03-26 | page 계층 sidecar 파일을 동일 이름 폴더에 묶는 규칙과 새 배럴 경로를 반영 | codex |
| 2026-03-25 | auth/root route용 page 컴포넌트 export를 추가 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
