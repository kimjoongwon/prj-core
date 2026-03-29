# 템플릿 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/templates`

## 사용자 시나리오

1. 관리자가 템플릿을 검색합니다.
2. 코드 버튼으로 상세 화면에 이동합니다.
3. 활성 상태를 토글하고 신규 등록 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure page + thin route container`
- page role: `master`
- reusable target: `master/table`
- page component path: `packages/fe-ui/src/page/AdminTemplatesPage/AdminTemplatesPage.tsx`
- route는 `useGetTemplates`, `useToggleTemplateStatus`, `useMetaDataGridQueryStates`, `router`를 소유합니다.

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| 클라이언트 렌더 | `useGetTemplates({ take, skip, search, isActive })` | 템플릿 목록 조회 |
| 상태 토글 | `useToggleTemplateStatus()` | 템플릿 활성 상태 전환 |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| `onClickCreateButton` | route가 `/templates/new`로 이동 |
| `onClickTemplateCode` | route가 `/templates/[templateId]`로 이동 |
| `onToggleTemplateStatusSwitch` | route가 토글 mutation과 캐시 무효화를 처리 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | `AdminTemplatesPage` pure page와 thin route container 구조로 전환하고 조회/토글/라우팅을 route로 이동 | codex |
| 2026-03-22 | 목록 콘텐츠 wrapper를 범용 `Surface` 기준으로 문서화 | codex |
| 2026-03-21 | 템플릿 목록 spec을 route-layout / page-builder 계약 형식으로 재작성 | codex |
