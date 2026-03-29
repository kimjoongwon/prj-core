# program.dto dto 기획서

> 생성일: 2026-03-03
> 타입: dto
> 위치: packages/be-dto/src/program.dto.ts

## 역할

이 파일은 Program 운영 aggregate의 응답 DTO를 정의합니다.
요약 조회에서는 대표 운동/운동 수를, 상세 조회에서는 실행 운동 snapshot 전체를 노출합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| ProgramDto | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/decorator | 기능 구현 의존성 |
| @cocrepo/prisma | 기능 구현 의존성 |
| ./abstract.dto | 기능 구현 의존성 |
| ./program-activity.dto | 실행 운동 snapshot DTO |
| ./routine.dto | 기능 구현 의존성 |
| ./session.dto | 기능 구현 의존성 |

## 읽기 모델 규칙

- `routineNameSnapshot`, `routineLabelSnapshot`은 Program 생성 시점의 루틴 표시값을 담습니다.
- `activityCount`, `previewExerciseNames`는 목록/요약 조회용 필드입니다.
- `executionPlan`은 상세 조회에서만 채워지는 `ProgramActivityDto[]`입니다.

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program 응답 DTO에 routine snapshot, 대표 운동 요약, 실행 계획 snapshot 필드를 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
