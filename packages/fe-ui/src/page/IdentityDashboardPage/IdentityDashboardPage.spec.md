# IdentityDashboardPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/IdentityDashboardPage/IdentityDashboardPage.tsx

## 역할

IDP 대시보드 화면의 pure page 컴포넌트입니다.
통계와 로그인 추이 조회는 route thin container가 소유하고 이 파일은 detail shell 안의 시각 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdentityDashboardPageStats | 대시보드 통계 계약 |
| IdentityDashboardPageTrendItem | 최근 로그인 추이 row 계약 |
| IdentityDashboardPageProps | pure page 입력 계약 |
| IdentityDashboardPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | IDP 대시보드를 pure page로 재정의하고 통계/추이 조회를 route thin container로 이동 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
