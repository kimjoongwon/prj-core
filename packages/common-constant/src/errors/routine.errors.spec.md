# routine.errors util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-constant/src/errors/routine.errors.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ROUTINE_ERRORS | 공개 계약 요소 |

## 에러 의미

- `TASK_EXERCISE_NOT_SCHEDULABLE`: Task에 Exercise 영상이 없어 Routine 편성 또는 Program 생성 후보로 사용할 수 없는 상태

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Exercise 영상 누락으로 인한 schedulable 검증 실패 코드를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
