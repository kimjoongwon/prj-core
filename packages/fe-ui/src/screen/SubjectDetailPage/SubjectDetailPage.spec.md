# SubjectDetailPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/SubjectDetailPage/SubjectDetailPage.tsx

## 역할

Subject 상세 화면의 pure screen 컴포넌트입니다.
상세 조회, 필드 조회, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합만 담당합니다.

## 디자인 스케치

```text
SubjectDetailPage
- DetailPage
  - DetailPageSurface
    - VStack
      - SubjectInfoSection
      - SubjectFieldsSection
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `DetailSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DetailSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `DefaultCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `BooleanCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `DateTimeCell` | `@cocrepo/ui` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `Box` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Table` | `@heroui/react` | 목록/표 데이터 표시 |
| `TableHeader` | `@heroui/react` | 목록/표 데이터 표시 |
| `TableColumn` | `@heroui/react` | 목록/표 데이터 표시 |
| `TableBody` | `@heroui/react` | 목록/표 데이터 표시 |
| `TableRow` | `@heroui/react` | 목록/표 데이터 표시 |
| `TableCell` | `@heroui/react` | 목록/표 데이터 표시 |
| `DetailPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `DetailPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `ArrowLeft` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `SubjectInfoSection` | `현재 파일` | 콘텐츠 그룹과 elevation 구성 |
| `SubjectFieldsSection` | `현재 파일` | 콘텐츠 그룹과 elevation 구성 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| SubjectDetailPageSubject | Subject 상세 표시 계약 |
| SubjectDetailPageField | Subject 필드 표시 계약 |
| SubjectDetailPageProps | pure screen 입력 계약 |
| SubjectDetailPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Subject 상세 화면의 상세/필드 조회와 라우팅 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
