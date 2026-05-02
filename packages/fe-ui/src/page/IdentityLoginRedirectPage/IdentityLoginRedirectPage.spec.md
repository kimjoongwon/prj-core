# IdentityLoginRedirectPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/IdentityLoginRedirectPage/IdentityLoginRedirectPage.tsx

## 역할

IDP 로그인 redirect/error 상태를 표시하는 재사용 page 컴포넌트입니다.

## 디자인 스케치

```text
IdentityLoginRedirectPage
- topActions
- ThemeToggleButton
- Spinner
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `ThemeToggleButton` | `../../feature` | 사용자 액션 실행 |
| `useT` | `../../i18n` | 상태 문구 런타임 번역 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `../../control` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| IdentityLoginRedirectPageProps | 공개 계약 요소 |
| IdentityLoginRedirectPage | 공개 계약 요소 |

## 입력 계약 변경

- `topActions`는 인증 화면 우상단에 언어 선택 등 앱별 shell action을 주입합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | 상태 문구 번역과 우상단 action 주입 계약을 추가 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
