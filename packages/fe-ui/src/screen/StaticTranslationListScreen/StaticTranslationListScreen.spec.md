# StaticTranslationListScreen ui 기획서

> 생성일: 2026-05-01
> 타입: ui
> 위치: packages/fe-ui/src/screen/StaticTranslationListScreen/StaticTranslationListScreen.tsx

## 역할

정적 다국어 번역 key-value를 관리하는 pure screen 컴포넌트입니다.
조회, mutation, toast, query state는 route thin container가 소유하고 이 파일은 목록, 필터, 등록/수정 modal, 삭제 확인 modal의 시각 조합을 담당합니다.

## 디자인 스케치

```text
StaticTranslationListScreen
- VStack
  - PageTitleBar(actions: cache invalidation, create)
  - SectionSurface
    - DataGrid(filters: key, category, languageCode, isTranslated)
  - Modal(create/update form)
  - ConfirmModal(delete)
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack`, `HStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목과 액션 |
| `SectionSurface` | `@cocrepo/ui` | 목록 영역 elevation |
| `DataGrid` | `@cocrepo/ui` | 번역 목록 표시 |
| `Modal` | `@heroui/react` | 등록/수정 form |
| `ConfirmModal` | `@cocrepo/ui` | 삭제 확인 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| `StaticTranslationListScreenProps.translations` | Orval `TranslationResponseDto[]` row 계약 |
| `StaticTranslationForm` | 등록/수정 입력 계약 |
| `adminStaticTranslationsPageQueryInputs` | route와 page가 공유하는 query input 정의 |
| `StaticTranslationListScreen` | 공개 pure screen 컴포넌트 |

## 상태별 렌더링

| 상태 | 렌더링 |
|------|--------|
| loading | DataGrid loading 상태 |
| empty | `등록된 정적 번역이 없습니다.` |
| create modal | 언어, key, category, text, 완료 여부 입력. 기본 category는 한글 의미 key 정책에 맞춰 `공통`으로 시작 |
| edit modal | language/key는 고정하고 category/text/완료 여부만 수정 |
| delete modal | 선택한 key와 언어를 확인한 뒤 삭제 |