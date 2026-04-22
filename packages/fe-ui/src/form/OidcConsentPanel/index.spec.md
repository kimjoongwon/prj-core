# OidcConsentPanel index 배럴 기획서

> 생성일: 2026-02-18
> 타입: index
> 위치: packages/fe-ui/src/form/OidcConsentPanel/index.ts

## 역할

`OidcConsentPanel` 관련 공개 계약을 재노출하는 배럴 파일입니다.
page/feature/route가 동일한 `OidcConsentPanelState`와 props 타입을 공통으로 사용하도록 연결합니다.

## 공개 export

| 항목 | 설명 |
|------|------|
| OidcConsentPanel | form/widget 컴포넌트 export |
| OidcConsentPanelProps | props type export |
| OidcConsentPanelState | consent state slice type export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | 배럴이 `OidcConsentPanelState`를 함께 export하고 page/feature/route가 동일한 consent state slice를 재사용하도록 정리 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
