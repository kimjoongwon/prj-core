# MetaDataGrid master 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/master/table/MetaDataGrid/MetaDataGrid.tsx

## 역할

이 파일은 `master/table` 계층의 범용 DataGrid 조합을 담당합니다.
도메인 비즈니스 상태를 직접 소유하지 않고, page-owned `MetaDataGridState`를 받아 검색/필터/페이지네이션 UI를 연결합니다.
호출부는 plain object를 넘기지 않고 `useLocalObservable`로 생성한 `MetaDataGridStateModel` class instance를 전달합니다.
서버 조회 결과는 `rows`, `totalCount`, `isLoading` render props로 받고, `config`는 컬럼/입력/액션 같은 선언적 설정만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| MetaDataGrid | `config`와 `state`를 받아 Header, Body, Footer, ActionBar를 조합하는 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| ./MetaDataGridActionBar | 기능 구현 의존성 |
| ./MetaDataGridBody | 기능 구현 의존성 |
| ./MetaDataGridEmpty | 기능 구현 의존성 |
| ./MetaDataGridFooter | 기능 구현 의존성 |
| ./MetaDataGridHeader | 기능 구현 의존성 |
| ./MetaDataGridSkeleton | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-25 | JSDoc 예시를 MetaDataGridStateModel class instance 사용 방식으로 갱신 | codex |
| 2026-04-25 | state prop을 plain object가 아닌 useLocalObservable 기반 MetaDataGridStateModel class instance로 받도록 계약 보강 | codex |
| 2026-04-25 | server render data를 rows/totalCount/isLoading props로 분리 | codex |
| 2026-04-25 | MetaDataGrid가 `state` prop을 받아 query/selection interaction state를 소비하도록 변경 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
