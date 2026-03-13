# Routines Facade 기획서

> 생성일: 2026-03-11
> 타입: application-service
> 위치: packages/be-facade/src/routine.facade.ts

## 역할

Routine 컨트롤러에서 pagination 응답 계산과 인증 사용자 조회를 제거하고, 요청 컨텍스트 해석을 Facade에서 담당합니다.

## 의존성

| 의존성 | 역할 |
|--------|------|
| RoutineService | Routine 조회/생성/수정/삭제 수행 |
| AuthContext | 현재 인증 사용자 ID 제공 |

## 공개 메서드

| 메서드 | 설명 |
|--------|------|
| getRoutines | 목록과 pagination meta를 반환 |
| getRoutine | 루틴 상세 조회 |
| createRoutine | 현재 인증 사용자 ID를 creatorId로 사용해 생성 |
| updateRoutine | 루틴 수정 |
| deleteRoutine | 루틴 삭제 |

## 비즈니스 규칙

- 루틴 생성은 인증 사용자 ID가 있어야 합니다.
- Space 범위 판정과 소유권 검증은 RoutineService가 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-11 | Routines 도메인 facade 신규 생성 및 컨텍스트 해석 이동 | codex |
| 2026-03-13 | RoutineFacade boundary 조합을 `@cocrepo/facade`로 이관 | codex |
