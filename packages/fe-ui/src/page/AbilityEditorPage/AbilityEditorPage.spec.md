# AbilityEditorPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AbilityEditorPage/AbilityEditorPage.tsx

## 역할

권한 등록/수정 route가 공통으로 사용하는 pure editor page 컴포넌트입니다. 로딩, not-found, ready 상태와 폼 시각 조합만 소유하고 검증/뮤테이션/라우팅은 app route container가 담당합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityEditorPageOption | Select 옵션 계약 |
| AbilityEditorPageForm | 폼 값 계약 |
| AbilityEditorPageChangeHandlers | 필드 변경 핸들러 계약 |
| AbilityEditorPageProps | 공개 계약 요소 |
| AbilityEditorPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | page 컴포넌트를 `observer`로 감싸 MobX 변경 추적 계약을 명시적으로 보강 | codex |
| 2026-03-26 | abilities 등록/수정 route의 page-level UI를 page 레이어로 이동 | codex |
