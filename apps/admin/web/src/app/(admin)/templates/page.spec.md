# 템플릿 목록 페이지 기획서

> 생성일: 2026-03-21
> 타입: page
> 경로: `/templates`

## 사용자 시나리오

1. 관리자가 템플릿을 검색합니다.
2. 코드 버튼으로 상세 화면에 이동합니다.
3. 활성 상태를 토글하고 신규 등록 화면으로 이동합니다.

## Rendering Decision

- 기본 패턴: `pure screen + thin route container`
- page role: `collection`
- reusable target: `data-grid`
- screen component path: `packages/fe-ui/src/screen/TemplateListScreen/TemplateListScreen.tsx`
- route는 `useGetTemplates`, `useToggleTemplateStatus`, `nuqs` query state, `router`를 소유합니다.

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