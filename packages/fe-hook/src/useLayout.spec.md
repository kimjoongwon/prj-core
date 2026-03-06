# useLayout util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/fe-hook/src/useLayout.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UseLayoutOptions | 공개 계약 요소 |
| UseLayoutReturn | 공개 계약 요소 |
| useLayout | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | UseLayoutOptions/UseLayoutReturn 로컬 선언을 제거하고 @cocrepo/type 계약 import/re-export로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | createUseLayout 팩토리를 제거하고 useLayout 직접 호출 방식으로 통합 | codex |
