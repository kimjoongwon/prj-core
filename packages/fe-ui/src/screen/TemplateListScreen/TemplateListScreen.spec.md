# TemplateListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/TemplateListScreen/TemplateListScreen.tsx

## 역할

템플릿 목록 화면의 pure screen 컴포넌트입니다. 템플릿 조회, query state, 상태 토글 mutation, 라우팅은 route thin container가 소유하고 이 파일은 grid 렌더링만 담당합니다.

## 디자인 스케치

```text
TemplateListScreen
- PageTitleBar
  - Button
- SectionSurface
  - DataGrid
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `SectionSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `TemplatesScreenFallback` | `현재 파일` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TemplateListScreenProps.templates | TemplateDto[] optional row 계약 |
| TemplateListScreenProps | pure screen 입력 계약 |
| adminTemplatesPageQueryInputs | route와 page가 공유하는 query input 정의 |
| TemplateListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |