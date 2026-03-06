# useAIClassification hook 기획서

> 생성일: 2026-03-03
> 타입: hook
> 위치: apps/admin/web/src/app/(admin)/inquiries/new/hooks/useAIClassification.ts

## 역할

이 파일은 hook 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| useAIClassification | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/ui | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 규칙 위반 정리: useMemo/useCallback/useIsMounted 제거 및 observer/이벤트 네이밍 규칙 반영 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
