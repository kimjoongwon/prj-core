# DashboardScreen page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/DashboardScreen/DashboardScreen.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 디자인 스케치

```text
DashboardScreen
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | screen rhythm root |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `ScreenSurface` | route page | page-level surface topology |
| `SectionSurface` | `@cocrepo/ui` | screen 주요 구역 surface |
| `div` | DOM | 반복 metric item을 border/background로 구분 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| DashboardScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-01 | 카드 라벨의 런타임 i18n 번역 적용 경로 반영 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
