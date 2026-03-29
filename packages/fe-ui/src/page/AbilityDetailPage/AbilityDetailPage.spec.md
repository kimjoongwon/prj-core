# AbilityDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AbilityDetailPage/AbilityDetailPage.tsx

## 역할

권한 상세 route의 loading, not-found, ready, delete-confirm modal 상태를 page 레이어에서 조합하는 pure page 컴포넌트입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AbilityDetailPageAbility | 상세 view model 계약 |
| AbilityDetailPageProps | 공개 계약 요소 |
| AbilityDetailPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | page 컴포넌트를 `observer`로 감싸 MobX 변경 추적 계약을 명시적으로 보강 | codex |
| 2026-03-26 | abilities 상세 route의 page-level UI를 page 레이어로 이동 | codex |
