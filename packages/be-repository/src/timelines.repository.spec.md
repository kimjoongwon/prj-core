# timelines.repository repository 기획서

> 생성일: 2026-03-03
> 타입: repository
> 위치: packages/be-repository/src/timelines.repository.ts

## 역할

이 파일은 repository 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

Program 목록/상세 조회의 read model 조합과 Program execution snapshot 영속화를 함께 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelinesRepository | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/prisma | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |
| @nestjs-cls/transactional | 기능 구현 의존성 |
| @nestjs-cls/transactional-adapter-prisma | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## Program Snapshot 계약

- `findManyPrograms`는 `activityCount`, `previewExerciseNames`를 포함한 summary projection을 반환합니다.
- `findProgramById`는 `executionPlan` 전체를 포함한 detail projection을 반환합니다.
- `createProgramActivities`는 Program 생성 시 execution snapshot row를 일괄 생성합니다.
- `replaceProgramActivities`는 Program의 `routineId` 변경 시 기존 snapshot을 전부 교체합니다.
- `softDeleteProgram`은 Program과 하위 `ProgramActivity`를 함께 soft delete 합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Program summary/detail read model과 `ProgramActivity` 생성·교체·삭제 영속화 계약을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
