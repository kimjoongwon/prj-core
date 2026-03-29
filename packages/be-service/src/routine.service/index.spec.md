# routine.service service 기획서

> 생성일: 2026-03-03
> 타입: service
> 위치: packages/be-service/src/routine.service/index.ts

## 역할

이 파일은 service 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.
Routine aggregate 저장 전에 참조 Task/Exercise가 스케줄 가능한지 검증합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| RoutineService | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/context | 기능 구현 의존성 |
| @cocrepo/dto | 기능 구현 의존성 |
| @cocrepo/entity | 기능 구현 의존성 |
| @cocrepo/repository | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |

## 저장 검증 규칙

- Routine 작성/수정 시 참조된 Task ID를 일괄 조회합니다.
- `task.exercise.videoFileId`가 없으면 `TASK_EXERCISE_NOT_SCHEDULABLE` 예외를 반환합니다.
- 동일한 Task를 한 Routine 안에 중복 배치하지 않도록 현재 admin write contract에서 차단합니다.

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

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
| 2026-03-29 | Routine 저장 시 Task/Exercise schedulable 검증과 중복 Task 차단 규칙을 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | `routine.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
