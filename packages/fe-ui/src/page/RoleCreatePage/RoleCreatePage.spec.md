# RoleCreatePage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/RoleCreatePage/RoleCreatePage.tsx

## 역할

이 파일은 역할 등록 화면의 pure page 레이어를 담당합니다.
route의 mutation/router/local state는 app route가 소유하고, 이 파일은 props로 받은 값과 핸들러만 렌더링합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoleCreatePage | 공개 계약 요소 |
| RoleCreatePageProps | 역할 등록 화면 렌더링 props 계약 |

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
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | 역할 등록 로직을 route page로 이동하고 page를 pure props contract로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
