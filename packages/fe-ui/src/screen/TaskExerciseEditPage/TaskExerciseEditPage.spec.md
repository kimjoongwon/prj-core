# TaskExerciseEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/screen/TaskExerciseEditPage/TaskExerciseEditPage.tsx

## 역할

이 파일은 Exercise 수정 화면의 pure presentational page 컴포넌트를 담당합니다.
기존 Exercise 상세를 수정하면서 선택된 이미지/영상 preview와 공통 `AssetBrowser` picker modal을 함께 표시하지만, 조회/저장/route 이동과 로컬 폼 상태는 app route container가 소유합니다.

## 디자인 스케치

```text
TaskExerciseEditPage
- FormPage
  - PageTitleBar
    - Button x2
  - FormPageSurface
    - FormSectionCard
      - FormSection
        - PageTitleBar
        - Input x4
        - Textarea
        - ExerciseMediaField x2
        - Chip
  - AssetBrowser
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `MediaThumbnail` | `@cocrepo/ui` | 화면 조합 요소 |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |
| `Textarea` | `@heroui/react` | 사용자 입력 컨트롤 |
| `ExerciseMediaField` | `현재 파일` | 페이지 내부 보조 컴포넌트 |
| `Chip` | `@heroui/react` | 상태/정보를 카드 또는 표시 단위로 표현 |
| `AssetBrowser` | `@cocrepo/ui` | 화면 조합 요소 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| TaskExerciseEditPage | Exercise 수정 화면의 pure screen contract |
| TaskExerciseEditPageProps | Exercise 수정 폼 값, 스케줄 가능 상태, CTA handler를 주입받는 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | JSX runtime |

## UI 규칙

- 수정 폼은 `imageFileId`, `videoFileId`를 편집 가능한 입력으로 노출합니다.
- `videoFileId` 존재 여부에 따라 현재 Exercise의 `스케줄 가능` 상태를 즉시 표시합니다.
- 이미지/영상 선택 modal은 `/assets`와 동일한 `AssetBrowser` feature를 picker mode로 재사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | 런타임 i18n hook을 적용해 Exercise 수정 화면의 정적 문구와 상태 문구를 catalog 번역 대상으로 정리 | codex |
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-04-01 | Exercise 수정 화면의 공통 자산 선택 흐름 정리 | codex |
| 2026-03-30 | 수정 화면의 조회/저장/이동 책임 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-29 | Exercise 수정 화면의 영상 기반 스케줄 가능 상태와 자산 식별자 입력 기준 추가 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
