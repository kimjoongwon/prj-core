# feature barrel 기획서

> 생성일: 2026-03-03
> 타입: feature-barrel
> 위치: packages/fe-ui/src/feature/index.ts

## 역할

`feature` 계층 컴포넌트의 공용 export 진입점을 제공합니다.
페이지에서는 반드시 `@cocrepo/ui`를 통해 feature를 import하도록 경로를 단일화합니다.
재사용 분류가 필요한 화면은 `feature` 하위가 아니라 `master/table`, `master/list`, `master/grid`, `detail/view`, `form` 엔트리를 우선 사용합니다.

## 구조 규칙

- `feature` 바로 아래에는 실제 feature 엔트리만 둡니다.
- `feature/idp`, `feature/user`, `feature/message-template`, `feature/ability`처럼 단순 묶음을 위한 중간 폴더는 금지합니다.
- 새 feature는 `src/feature/IdpLogin`, `src/feature/UserList`처럼 평탄한 경로를 사용합니다.
- 기존 중간 묶음 폴더는 유지보수 중 점진적으로 제거하는 마이그레이션 대상으로 봅니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | `feature` 아래 중간 묶음 폴더(`idp`, `user`, `message-template`, `ability`)를 금지하는 평탄화 규칙 추가 | codex |
| 2026-03-25 | `master/detail/form` 재사용 계층을 `feature`와 같은 위계의 루트 배럴로 분리하고 `feature/index.ts`에서 제외 | codex |
| 2026-03-21 | `master/detail` 재사용 계층 export를 추가하고 `MetaDataGrid` 공개 진입점을 `master/table`로 승격 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | `ProgramPickerModal` export 추가 및 feature 경로 단일화 기준 문서화 | codex |
