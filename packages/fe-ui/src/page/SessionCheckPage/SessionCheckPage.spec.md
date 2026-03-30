# SessionCheckPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/SessionCheckPage/SessionCheckPage.tsx

## 역할

루트 진입 시 세션 확인 중 상태를 표시하는 재사용 page 컴포넌트입니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SessionCheckPageProps | 공개 계약 요소 |
| SessionCheckPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-25 | admin/idp 루트 redirect 로딩 상태를 page 레이어로 승격 | codex |
