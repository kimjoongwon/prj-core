# GroundEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/GroundEditPage/GroundEditPage.tsx

## 역할

이 파일은 시설 수정 화면의 pure presentational page 컴포넌트를 담당합니다.
라우팅, API 호출, 로컬 폼 상태, 저장 mutation은 app route container가 소유하고 이 page는 props contract만 렌더링합니다.

## 디자인 스케치

```text
GroundEditPage
- FormPage
  - PageTitleBar
  - FormPageSurface
    - FormSectionCard
      - FormSection
        - PageTitleBar
        - VStack
          - Input x6
          - Button x2
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `FormPage` | `@cocrepo/ui` | 페이지 외곽 레이아웃 구성 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `FormPageSurface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `FormSectionCard` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `Spinner` | `@heroui/react` | 로딩/대기 상태 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `FormSection` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `Input` | `@heroui/react` | 사용자 입력 컨트롤 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| GroundEditPage | 시설 수정 화면의 pure page contract |
| GroundEditPageProps | ground 수정 폼 값, 검증 상태, CTA handler를 주입받는 props 계약 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | JSX runtime |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-02 | Space 콘텐츠 언어 기준 리소스 작성 안내와 언어 선택/필터 계약 반영 | codex |
| 2026-03-30 | 수정 화면의 조회/저장/이동 책임 경계를 상위 컨테이너 기준으로 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
