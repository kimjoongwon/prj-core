# useHandlers hook 기획서

> 생성일: 2026-03-26
> 타입: hook
> 위치: packages/fe-ui/src/page/InquiryDetailPage/hooks/useHandlers.ts

## 역할

이 파일은 page 레이어 하위의 보조 hook 책임을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| UseHandlersOptions | 공개 계약 요소 |
| UseHandlersReturn | 공개 계약 요소 |
| useHandlers | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/inquiries | 기능 구현 의존성 |
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/toolkit | 기능 구현 의존성 |
| next | 기능 구현 의존성 |
| next/navigation | 기능 구현 의존성 |
| ./useInquiryWebSocket | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | semantic pure page naming sweep에 맞춰 hook sidecar의 소속 page 이름을 semantic 기준으로 갱신 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
