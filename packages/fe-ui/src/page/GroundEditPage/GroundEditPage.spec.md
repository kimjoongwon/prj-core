# GroundEditPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/GroundEditPage/GroundEditPage.tsx

## 역할

이 파일은 시설 수정 화면의 pure presentational page 컴포넌트를 담당합니다.
라우팅, API 호출, 로컬 폼 상태, 저장 mutation은 app route container가 소유하고 이 page는 props contract만 렌더링합니다.

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
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | API/router/local state를 route로 이동하고 pure page props contract로 재정의 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
