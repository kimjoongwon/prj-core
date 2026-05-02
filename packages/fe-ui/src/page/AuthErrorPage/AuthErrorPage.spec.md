# AuthErrorPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/AuthErrorPage/AuthErrorPage.tsx

## 역할

OIDC 오류 표시와 복귀 액션을 담당하는 재사용 page 컴포넌트입니다.

## 디자인 스케치

```text
AuthErrorPage
- AuthCard
  - AuthCardHeader
  - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `AuthCard` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AuthCardHeader` | `../../widget` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Button` | `../../control` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| AuthErrorPageProps | 공개 계약 요소 |
| AuthErrorPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | 오류 제목, 설명, 복귀 액션의 런타임 i18n 번역 적용 경로 반영 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
