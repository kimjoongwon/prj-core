# feature barrel 기획서

> 생성일: 2026-03-03
> 타입: feature-barrel
> 위치: packages/fe-ui/src/feature/index.ts

## 역할

`feature` 계층 컴포넌트의 공용 export 진입점을 제공합니다.
페이지에서는 반드시 `@cocrepo/ui`를 통해 feature를 import하도록 경로를 단일화합니다.
재사용 분류가 필요한 화면은 `feature/master/*`, `feature/detail/view` 엔트리를 우선 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | `master/detail` 재사용 계층 export를 추가하고 `MetaDataGrid` 공개 진입점을 `feature/master/table`로 승격 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | `ProgramPickerModal` export 추가 및 feature 경로 단일화 기준 문서화 | codex |
