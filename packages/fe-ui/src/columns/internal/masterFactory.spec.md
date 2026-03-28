# internal/masterFactory 기획서

> 생성일: 2026-03-27
> 타입: ui-support
> 위치: packages/fe-ui/src/columns/internal/masterFactory.tsx

## 역할

`MetaDataGrid` 기반 컬럼 빌딩의 내부 factory 모음입니다.
공개 도메인 컬럼 파일은 이 helper를 조합만 하고, 이 파일은 외부에 직접 공개하지 않습니다.

## 공개 계약

| 항목                                               | 설명                         |
| -------------------------------------------------- | ---------------------------- |
| `buildColumns`, `buildColumnsWithDefaultCreatedAt` | 내부 조립 helper             |
| `createNameColumn` 외 field factory                | 내부 preset 기반 컬럼 생성기 |
| `getActionGroupColor` 외 formatting helper         | 내부 표시 유틸               |

## 변경 이력

| 일자       | 내용                                                          | 작성자 |
| ---------- | ------------------------------------------------------------- | ------ |
| 2026-03-28 | masterFactory 함수 주석을 영문에서 한글로 정리해 preset/helper 의도를 통일 | codex  |
| 2026-03-28 | master factory 함수에 preset/variant 의도를 설명하는 주석을 추가 | codex  |
| 2026-03-28 | 기본 text/email/phone/description 컬럼 렌더링을 `src/cell` 공통 셀로 통일하고 IDP 보조 셀은 cell 레이어로 이동 | codex  |
| 2026-03-27 | `columns/master/shared.tsx`를 내부 builder 전용 파일로 재배치 | codex  |
