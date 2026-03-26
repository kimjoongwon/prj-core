# useInquiryWebSocket hook 기획서

> 생성일: 2026-03-26
> 타입: hook
> 위치: packages/fe-ui/src/page/AdminInquiriesInquiryIdPage/hooks/useInquiryWebSocket.ts

## 역할

이 파일은 page 레이어 하위의 보조 hook 책임을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| WebSocketStatus | 공개 계약 요소 |
| UseInquiryWebSocketOptions | 공개 계약 요소 |
| UseInquiryWebSocketReturn | 공개 계약 요소 |
| useInquiryWebSocket | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/toolkit | 기능 구현 의존성 |
| @cocrepo/type | 기능 구현 의존성 |
| react | 기능 구현 의존성 |
| @/runtime-urls | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
