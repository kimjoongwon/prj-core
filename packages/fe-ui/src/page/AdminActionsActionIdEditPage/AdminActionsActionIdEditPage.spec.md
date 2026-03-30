# AdminActionsActionIdEditPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AdminActionsActionIdEditPage/AdminActionsActionIdEditPage.tsx

## 역할

Action 수정 화면의 pure page 컴포넌트입니다.
상세 조회, 저장 mutation, 라우팅은 route thin container가 소유하고 이 파일은 폼 렌더링과 로컬 입력 상태만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminActionsActionIdEditPageAction | 수정 화면 초기값 계약 |
| AdminActionsActionIdEditPageForm | route로 전달하는 폼 제출 계약 |
| AdminActionsActionIdEditPageProps | pure page 입력 계약 |
| AdminActionsActionIdEditPage | 공개 계약 요소 |

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
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Action 수정을 pure page로 재정의하고 조회·저장·라우팅 책임을 route thin container로 이동 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
| 2026-03-30 | route runtime ownership에 맞춰 page를 props 기반 pure contract로 정리 | codex |
