# SessionCheckScreen ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/screen/SessionCheckScreen/SessionCheckScreen.tsx

## 역할

루트 진입 시 세션 확인 중 상태를 표시하는 재사용 page 컴포넌트입니다.

## 디자인 스케치

```text
SessionCheckScreen
- VStack
  - PageTitleBar
  - ScreenSurface
    - SectionSurface
      - Spinner
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `SectionSurface` | `../../surface` | 콘텐츠 그룹과 elevation 구성 |
| `useT` | `../../i18n` | 대기 메시지 런타임 번역 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| SessionCheckScreenProps | 공개 계약 요소 |
| SessionCheckScreen | 공개 계약 요소 |