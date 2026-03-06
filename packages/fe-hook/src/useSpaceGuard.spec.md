# useSpaceGuard util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/fe-hook/src/useSpaceGuard.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UseSpaceGuardOptions | 공개 계약 요소 |
| UseSpaceGuardReturn | 공개 계약 요소 |
| useSpaceGuard | 공개 계약 요소 |
| createUseSpaceGuard | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | UseSpaceGuardOptions/UseSpaceGuardReturn 로컬 선언을 제거하고 @cocrepo/type 계약 import/re-export로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
