# LoginRedirectScreen ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/screen/LoginRedirectScreen/LoginRedirectScreen.tsx

## 역할

관리자 로그인 redirect/error 상태를 표시하는 재사용 page 컴포넌트입니다.

## 디자인 스케치

```text
LoginRedirectScreen
- SectionSurface
  - VStack
    - VStack
    - Button
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `SectionSurface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `../../rhythm` | 화면 조합 요소 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `../../action` | 사용자 액션 실행 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| LoginRedirectScreenProps | 공개 계약 요소 |
| LoginRedirectScreen | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | redirect/error 상태 문구를 런타임 i18n catalog 번역 대상으로 연결 | codex |
| 2026-03-25 | 초기 화면 기획 수립 | codex |
