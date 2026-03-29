# program-activity.dto dto 기획서

> 생성일: 2026-03-29
> 타입: dto
> 위치: packages/be-dto/src/program-activity.dto.ts

## 역할

이 파일은 Program 상세 조회에서 사용하는 실행 운동 snapshot DTO를 정의합니다.
`Activity` 템플릿과 `Exercise` 상세를 Program 운영 문맥으로 결합한 읽기 계약입니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| ProgramActivityDto | Program 실행 운동 1개에 대한 응답 DTO |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/decorator | Swagger/검증 데코레이터 |
| @cocrepo/prisma | Prisma 타입 구현 |
| ./abstract.dto | 공통 엔터티 필드 상속 |

## 읽기 모델 규칙

- `order`, `repetitions`, `restTime`, `notes`는 Routine `Activity` snapshot입니다.
- `exerciseName`, `exerciseDescription`, `exerciseDuration`, `exerciseCount`, `imageFileId`, `videoFileId`는 Exercise snapshot입니다.
- `programId`, `taskId`는 Program과 원본 자산 identity를 추적하기 위한 연결 키입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program 실행 운동 snapshot DTO 신규 추가 | codex |
