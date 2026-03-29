# timeline.service service 기획서

> 생성일: 2026-03-03
> 타입: service
> 위치: packages/be-service/src/timeline.service/index.ts

## 역할

이 파일은 service 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.
Timeline/Session/Program 운영 aggregate에서 Program execution snapshot 생성·교체 규칙을 소유합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TimelineService | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| @cocrepo/context | 현재 요청 space 접근 범위 확인 |
| @cocrepo/prisma | 기능 구현 의존성 |
| @cocrepo/repository | 기능 구현 의존성 |
| @nestjs/common | 기능 구현 의존성 |

## Program 실행 계획 규칙

- `createProgramInSession`은 Routine `Activity -> Task -> Exercise`를 읽어 `ProgramActivity[]` snapshot을 생성합니다.
- `updateProgramInSession`은 `routineId`가 바뀌면 snapshot을 재생성하고, 바뀌지 않으면 기존 snapshot을 유지합니다.
- `getRoutineExecutionSnapshot`은 현재 요청자의 접근 가능한 Space 범위 안에서 Routine 실행 계획을 계산합니다.
- Exercise에 `videoFileId`가 없으면 `PROGRAM_ROUTINE_EXERCISE_INCOMPLETE`로 Program 생성을 거부합니다.

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
| 2026-03-29 | Program execution snapshot 생성·교체 트랜잭션과 schedulable validation 규칙을 서비스 책임으로 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-13 | `timeline.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
