# AuthErrorPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/AuthErrorPage/AuthErrorPage.tsx

## 역할

OIDC 오류 표시와 복귀 액션을 담당하는 재사용 page 컴포넌트입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthErrorPageProps | 공개 계약 요소 |
| AuthErrorPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-25 | error route 시각 owner를 page 레이어로 이동 | codex |
