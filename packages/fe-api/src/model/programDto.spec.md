# model programDto 기획서

> 생성일: 2026-03-29
> 타입: generated-model
> 위치: packages/fe-api/src/model/programDto.ts

## 역할

Orval이 생성한 Plate API용 `ProgramDto` 타입입니다.
Program summary/detail 응답에서 routine snapshot, 대표 운동 요약, 실행 운동 snapshot 배열을 프론트로 전달합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| ProgramDto | Plate API Program 응답 타입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program response에 routine snapshot, activity summary, executionPlan 타입을 반영한 sidecar 신규 생성 | codex |
