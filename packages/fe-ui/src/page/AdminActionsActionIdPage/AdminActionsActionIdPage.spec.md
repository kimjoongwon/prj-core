# AdminActionsActionIdPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AdminActionsActionIdPage/AdminActionsActionIdPage.tsx

## 역할

Action 상세 화면의 pure page 컴포넌트입니다.
상세 조회, 삭제 mutation, 라우팅은 route thin container가 소유하고 이 파일은 상세 시각 조합과 삭제 확인 modal 같은 화면 로컬 상태만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminActionsActionIdPageAction | 상세 화면 Action 표시 계약 |
| AdminActionsActionIdPageProps | pure page 입력 계약 |
| AdminActionsActionIdPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | Action 상세를 pure page로 재정의하고 조회·삭제·라우팅 책임을 route thin container로 이동 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
