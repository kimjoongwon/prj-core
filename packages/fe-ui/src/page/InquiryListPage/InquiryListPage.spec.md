# InquiryListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/InquiryListPage/InquiryListPage.tsx

## 역할

문의 목록 화면의 pure page 컴포넌트입니다. 문의/통계 조회, query state, 라우팅은 route thin container가 소유하고 이 파일은 통계 카드와 grid 조합만 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| InquiryListPageInquiry | 문의 목록 row 계약 |
| InquiryListPageProps | pure page 입력 계약 |
| adminInquiriesPageQueryInputs | route와 page가 공유하는 query input 정의 |
| InquiryListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | row click handler 조합 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | pure page query state 타입을 shared hook ReturnType 의존에서 명시 계약으로 정리 | codex |
| 2026-04-22 | semantic pure page naming sweep에 맞춰 route-mirror page 이름을 semantic screen 이름으로 정리 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-29 | 문의 목록을 pure page로 재정의하고 조회·query state·라우팅을 route thin container로 이동 | codex |
| 2026-03-27 | 문의 목록에서 카드 통계와 grid를 `Surface` 블록으로 나누고 `MetaDataGrid` 컬럼 정의를 columns 레이어 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
