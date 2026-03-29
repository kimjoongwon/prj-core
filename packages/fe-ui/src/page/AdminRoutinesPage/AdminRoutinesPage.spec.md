# AdminRoutinesPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/AdminRoutinesPage/AdminRoutinesPage.tsx

## 역할

루틴 목록 화면의 pure page 컴포넌트입니다. 루틴 조회, query state, 삭제 mutation, 라우팅은 route thin container가 소유하고 이 파일은 목록 렌더링과 삭제 modal만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminRoutinesPageRoutine | 루틴 목록 row 계약 |
| AdminRoutinesPageProps | pure page 입력 계약 |
| adminRoutinesPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AdminRoutinesPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/hook | query state type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | 루틴 목록을 pure page로 재정의하고 조회·삭제·라우팅을 route thin container로 이동 | codex |
| 2026-03-27 | 루틴 목록 `MetaDataGrid` 컬럼 정의를 `@cocrepo/ui` `columns` 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
