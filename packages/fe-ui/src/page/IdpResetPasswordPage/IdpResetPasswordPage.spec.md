# IdpResetPasswordPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/IdpResetPasswordPage/IdpResetPasswordPage.tsx

## 역할

비밀번호 재설정 단계를 page 레이어에서 조합하는 재사용 컴포넌트입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| IdpResetPasswordPageProps | 공개 계약 요소 |
| IdpResetPasswordPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-25 | reset-password route 시각 owner를 page 레이어로 이동 | codex |
