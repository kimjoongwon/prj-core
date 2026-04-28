# SessionCheckPage ui 기획서

> 생성일: 2026-03-25
> 타입: ui
> 위치: packages/fe-ui/src/page/SessionCheckPage/SessionCheckPage.tsx

## 역할

루트 진입 시 세션 확인 중 상태를 표시하는 재사용 page 컴포넌트입니다.

## 디자인 스케치

```text
SessionCheckPage
- DetailPage
  - PageTitleBar
  - DetailPageSurface
    - DetailSectionCard
      - Spinner
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailPage` | `../../detail` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `../../widget` | 상단 제목, 설명, 주요 액션 표시 |
| `DetailPageSurface` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSectionCard` | `../../detail` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |

## 구성 요소

| 항목 | 설명 |
|------|------|
| SessionCheckPageProps | 공개 계약 요소 |
| SessionCheckPage | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-25 | 초기 화면 기획 수립 | codex |
