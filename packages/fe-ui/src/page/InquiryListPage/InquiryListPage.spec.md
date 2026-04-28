# InquiryListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/InquiryListPage/InquiryListPage.tsx

## 역할

문의 목록 화면의 pure page 컴포넌트입니다. 문의/통계 조회, query state, 라우팅은 route thin container가 소유하고 이 파일은 통계 카드와 grid 조합만 담당합니다.

## 디자인 스케치

```text
InquiryListPage
- PageTitleBar
  - Button
- VStack
  - Surface
    - PageTitleBar
    - InquiryStatsCards
  - Surface
    - PageTitleBar
    - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Surface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `InquiriesPageShellFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `InquiryStatsCards` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryListPageProps.inquiries | InquiryDto[] optional row 계약 |
| InquiryListPageProps | pure page 입력 계약 |
| adminInquiriesPageQueryInputs | route와 page가 공유하는 query input 정의 |
| InquiryListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | row click handler 조합 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-28 | 목록 row 계약을 Page 전용 view model 대신 Orval DTO optional props로 정리 | codex |
| 2026-04-24 | 목록 검색과 페이지네이션 검색 조건 계약을 명시적으로 정리 | codex |
| 2026-03-29 | 문의 목록 화면의 조회/검색 조건/이동 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
