# timeline.errors util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/common-constant/src/errors/timeline.errors.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| TIMELINE_ERRORS | 공개 계약 요소 |

## 에러 의미

- `PROGRAM_ROUTINE_EXERCISE_INCOMPLETE`: 선택한 Routine에 영상이 없는 Exercise가 포함되어 Program 실행 snapshot을 만들 수 없는 상태

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program snapshot 생성 시 불완전 Exercise 포함 Routine을 차단하는 비즈니스 에러 코드 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
