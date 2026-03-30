# AdminInquiriesInquiryIdPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminInquiriesInquiryIdPage/AdminInquiriesInquiryIdPage.tsx

## 역할

이 파일은 문의 상세 화면의 pure page 레이어를 담당합니다. 조회, WebSocket 연결 관리, 삭제/메타 mutation, 로컬 실시간 상태, 라우팅은 app route가 소유하고 이 파일은 실시간 상태 스냅샷과 핸들러를 받아 화면만 합성합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminInquiriesInquiryIdPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 문의 enum type 참조 |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| ./hooks/useInquiryWebSocket | WebSocket status type 참조 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-30 | 문의 조회/실시간/WebSocket/mutation/삭제 modal state를 route로 이동하고 page를 pure props contract로 재정의 | codex |
| 2026-03-30 | page export 규칙을 `observer(() => ...)` + named export only 형태로 정리 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
